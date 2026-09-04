-- Bloqueo y denuncia de usuarios.
--
-- `friendships.status` ya admitía 'blocked' desde la migración de amigos
-- (20260826160000) y el índice único parcial de la tabla ya cubre ese
-- estado, pero nunca se usaba. Este archivo activa esa vía en vez de crear
-- un sistema paralelo: bloquear reescribe (o crea) la fila de esa pareja de
-- usuarios a status='blocked', lo cual automáticamente hace desaparecer
-- cualquier amistad 'accepted' de fn_get_my_friendships (solo lista ese
-- estado) y bloquea nuevas solicitudes de amistad (fn_send_friend_request ya
-- rechaza cualquier fila 'blocked' existente) y nuevos duelos (exigen una
-- fila 'accepted', que el bloqueo destruye). No hace falta tocar ninguna de
-- esas dos funciones.
--
-- Regla de diseño deliberada: la persona bloqueada nunca recibe una señal
-- explícita de que la han bloqueado — ve los mismos errores genéricos que
-- vería con cualquier desconocido. Evita que el bloqueo se use como munición
-- contra quien lo activó.

alter table public.friendships add column blocked_by uuid references auth.users(id);

create table public.user_reports (
  id bigint generated always as identity primary key,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('spam', 'acoso', 'contenido_inapropiado', 'suplantacion', 'otro')),
  details text,
  created_at timestamptz not null default now(),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  check (reporter_id <> reported_user_id)
);

alter table public.user_reports enable row level security;

-- Solo el propio denunciante puede ver sus denuncias — no hay panel de
-- moderación en la app todavía; la revisión se hace directamente en
-- Supabase. Sin policy de insert/update/delete para `authenticated`: todo
-- pasa por fn_report_user.
create policy "user_reports_select_own"
  on public.user_reports for select
  to authenticated
  using ((select auth.uid()) = reporter_id);

create index user_reports_reported_user_idx on public.user_reports (reported_user_id, status);

-- ---------------------------------------------------------------------------
-- fn_block_user — crea o reescribe la fila de friendships de esta pareja a
-- 'blocked'. Si había una amistad aceptada o una solicitud pendiente, se
-- pierde (es lo esperado: bloquear implica dejar de estar conectados).
-- También cancela cualquier duelo todavía 'pending' entre los dos.
-- ---------------------------------------------------------------------------
create or replace function public.fn_block_user(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_existing record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if v_uid = p_user_id then
    raise exception 'cannot block yourself';
  end if;

  select * into v_existing from public.friendships
  where (requester_id = v_uid and addressee_id = p_user_id)
     or (requester_id = p_user_id and addressee_id = v_uid)
  order by created_at desc
  limit 1;

  if v_existing.id is not null and v_existing.status <> 'rejected' then
    update public.friendships
    set status = 'blocked', blocked_by = v_uid, responded_at = now()
    where id = v_existing.id;
  else
    insert into public.friendships (requester_id, addressee_id, status, blocked_by, responded_at)
    values (v_uid, p_user_id, 'blocked', v_uid, now());
  end if;

  update public.battles
  set status = 'cancelled', responded_at = now()
  where status = 'pending'
    and ((challenger_id = v_uid and opponent_id = p_user_id)
      or (challenger_id = p_user_id and opponent_id = v_uid));

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_block_user(uuid) from public;
grant execute on function public.fn_block_user(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_unblock_user — solo quien bloqueó puede deshacerlo. Vuelven a ser
-- desconocidos (no se restaura la amistad previa): si quieren reconectar,
-- hace falta una solicitud de amistad nueva.
-- ---------------------------------------------------------------------------
create or replace function public.fn_unblock_user(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_rows integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  delete from public.friendships
  where status = 'blocked' and blocked_by = v_uid
    and ((requester_id = v_uid and addressee_id = p_user_id)
      or (requester_id = p_user_id and addressee_id = v_uid));

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'block not found';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_unblock_user(uuid) from public;
grant execute on function public.fn_unblock_user(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_blocked_users — solo la gente que YO he bloqueado (blocked_by =
-- auth.uid()), para gestionarlo desde Ajustes.
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_blocked_users()
returns table (user_id uuid, display_name text, avatar_url text, blocked_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select
    case when f.requester_id = auth.uid() then f.addressee_id else f.requester_id end as user_id,
    p.display_name,
    p.avatar_url,
    f.responded_at as blocked_at
  from public.friendships f
  join public.profiles p
    on p.user_id = case when f.requester_id = auth.uid() then f.addressee_id else f.requester_id end
  where f.status = 'blocked' and f.blocked_by = auth.uid()
  order by f.responded_at desc;
$$;

revoke all on function public.fn_get_blocked_users() from public;
grant execute on function public.fn_get_blocked_users() to authenticated;

-- ---------------------------------------------------------------------------
-- fn_report_user — registra la denuncia y, por defecto, bloquea también al
-- denunciado (se puede desactivar pasando p_also_block := false).
-- ---------------------------------------------------------------------------
create or replace function public.fn_report_user(
  p_user_id uuid,
  p_reason text,
  p_details text default null,
  p_also_block boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if v_uid = p_user_id then
    raise exception 'cannot report yourself';
  end if;
  if p_reason not in ('spam', 'acoso', 'contenido_inapropiado', 'suplantacion', 'otro') then
    raise exception 'invalid reason';
  end if;

  insert into public.user_reports (reporter_id, reported_user_id, reason, details)
  values (v_uid, p_user_id, p_reason, nullif(trim(coalesce(p_details, '')), ''));

  if p_also_block then
    perform public.fn_block_user(p_user_id);
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_report_user(uuid, text, text, boolean) from public;
grant execute on function public.fn_report_user(uuid, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_search_profiles — re-creada para excluir cualquier pareja con una fila
-- 'blocked' entre los dos, en cualquier dirección: ni el bloqueado encuentra
-- a quien le bloqueó, ni al revés. Resto del cuerpo sin cambios respecto a
-- 20260826160000_friends.sql.
-- ---------------------------------------------------------------------------
create or replace function public.fn_search_profiles(p_query text, p_limit integer default 20, p_offset integer default 0)
returns table (friend_code text, display_name text, avatar_url text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.friend_code, p.display_name, p.avatar_url
  from public.profiles p
  where p.user_id <> auth.uid()
    and p.search_visibility
    and length(trim(p_query)) >= 2
    and (p.display_name ilike '%' || trim(p_query) || '%' or p.friend_code ilike trim(p_query) || '%')
    and not exists (
      select 1 from public.friendships f
      where f.status = 'blocked'
        and ((f.requester_id = auth.uid() and f.addressee_id = p.user_id)
          or (f.requester_id = p.user_id and f.addressee_id = auth.uid()))
    )
  order by p.display_name asc
  limit least(greatest(p_limit, 1), 50)
  offset greatest(p_offset, 0);
$$;

revoke all on function public.fn_search_profiles(text, integer, integer) from public;
grant execute on function public.fn_search_profiles(text, integer, integer) to authenticated;
