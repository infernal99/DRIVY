-- Invite-by-link: opening someone's /invite/:friendCode link and being (or
-- becoming) authenticated adds you as their friend immediately — no
-- pending/accept step, unlike a normal search-and-request friend add.
-- Handing someone a link you generated yourself is already a stronger
-- consent signal than a cold friend-code lookup, so this skips straight to
-- 'accepted', reusing the exact same dedupe/no-duplicate-row logic
-- fn_send_friend_request already has for the "already a pending/accepted/
-- blocked row exists" cases.

create or replace function public.fn_accept_friend_invite(p_friend_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_target uuid;
  v_target_name text;
  v_existing record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select user_id, display_name into v_target, v_target_name
  from public.profiles where friend_code = upper(trim(p_friend_code));
  if v_target is null then
    raise exception 'friend code not found';
  end if;
  if v_target = v_uid then
    raise exception 'cannot friend yourself';
  end if;

  select * into v_existing from public.friendships
  where (requester_id = v_uid and addressee_id = v_target)
     or (requester_id = v_target and addressee_id = v_uid)
  order by created_at desc
  limit 1;

  if v_existing.id is not null then
    if v_existing.status = 'blocked' then
      raise exception 'request not allowed';
    elsif v_existing.status <> 'accepted' then
      update public.friendships set status = 'accepted', responded_at = now() where id = v_existing.id;
    end if;
  else
    insert into public.friendships (requester_id, addressee_id, status, responded_at)
    values (v_target, v_uid, 'accepted', now());
  end if;

  return jsonb_build_object('friendUserId', v_target, 'displayName', v_target_name);
end;
$$;

revoke all on function public.fn_accept_friend_invite(text) from public;
grant execute on function public.fn_accept_friend_invite(text) to authenticated;
