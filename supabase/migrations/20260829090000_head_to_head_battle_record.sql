-- Head-to-head duel record against one specific friend (e.g. "3 victorias
-- tuyas, 2 suyas"), distinct from user_battle_stats which only tracks each
-- player's aggregate win rate across every opponent combined.

create or replace function public.fn_get_head_to_head(p_friend_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_is_friend boolean;
  v_my_wins integer;
  v_their_wins integer;
  v_ties integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select exists(
    select 1 from public.friendships
    where status = 'accepted'
      and ((requester_id = v_uid and addressee_id = p_friend_user_id)
        or (requester_id = p_friend_user_id and addressee_id = v_uid))
  ) into v_is_friend;

  if not v_is_friend then
    raise exception 'not friends with this user';
  end if;

  select
    count(*) filter (where winner_id = v_uid),
    count(*) filter (where winner_id = p_friend_user_id),
    count(*) filter (where winner_id is null)
  into v_my_wins, v_their_wins, v_ties
  from public.battles
  where status = 'completed'
    and ((challenger_id = v_uid and opponent_id = p_friend_user_id)
      or (challenger_id = p_friend_user_id and opponent_id = v_uid));

  return jsonb_build_object(
    'myWins', coalesce(v_my_wins, 0),
    'theirWins', coalesce(v_their_wins, 0),
    'ties', coalesce(v_ties, 0),
    'totalBattles', coalesce(v_my_wins, 0) + coalesce(v_their_wins, 0) + coalesce(v_ties, 0)
  );
end;
$$;

revoke all on function public.fn_get_head_to_head(uuid) from public;
grant execute on function public.fn_get_head_to_head(uuid) to authenticated;
