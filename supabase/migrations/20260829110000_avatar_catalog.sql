-- Avatar catalog: pure unlock-threshold data, same split as `achievements`
-- (this table is the source of truth for "can this user actually equip
-- this one", the TS copy in src/data/avatars.ts is the source of truth for
-- how it's drawn/named — keep the two in sync by hand, same caveat as
-- achievements). profiles.avatar_url (previously always null — DRIVY never
-- had an upload feature) now stores one of these catalog ids instead of a
-- real URL once a user picks one.

create table public.avatars (
  id text primary key,
  xp_required integer not null check (xp_required >= 0)
);

alter table public.avatars enable row level security;

create policy "avatars_select_all"
  on public.avatars for select
  to authenticated
  using (true);

insert into public.avatars (id, xp_required) values
  ('volante', 50),
  ('semaforo', 150),
  ('stop', 300),
  ('casco', 500),
  ('coche', 800),
  ('rayo', 1200),
  ('trofeo', 1800),
  ('corona', 2500),
  ('diamante', 3500);

-- ---------------------------------------------------------------------------
-- fn_set_my_avatar — re-derives the caller's own current XP server-side and
-- checks it against the catalog's threshold; never trusts a client claim
-- that an avatar is unlocked.
-- ---------------------------------------------------------------------------
create or replace function public.fn_set_my_avatar(p_avatar_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_required integer;
  v_xp integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select xp_required into v_required from public.avatars where id = p_avatar_id;
  if v_required is null then
    raise exception 'unknown avatar';
  end if;

  select xp into v_xp from public.user_progress where user_id = v_uid;
  if coalesce(v_xp, 0) < v_required then
    raise exception 'avatar not unlocked yet';
  end if;

  update public.profiles set avatar_url = p_avatar_id, updated_at = now() where user_id = v_uid;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_set_my_avatar(text) from public;
grant execute on function public.fn_set_my_avatar(text) to authenticated;
