-- Fix fn_get_my_battles: the history sub-select had an ORDER BY / LIMIT
-- applied to the aggregated (single-row) query instead of to the raw rows
-- before aggregation, which Postgres rejects at runtime with "column must
-- appear in the GROUP BY clause or be used in an aggregate function" (the
-- auth-rejection path never hit this query, so it wasn't caught until a
-- real authenticated call reached it). Fixed by ordering/limiting in a
-- subquery, then aggregating that.

create or replace function public.fn_get_my_battles()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_incoming jsonb;
  v_outgoing jsonb;
  v_active jsonb;
  v_history jsonb;
  v_stats record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', b.id, 'friendUserId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'questionCount', b.question_count, 'createdAt', b.created_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_incoming
  from public.battles b join public.profiles p on p.user_id = b.challenger_id
  where b.status = 'pending' and b.opponent_id = v_uid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', b.id, 'friendUserId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'questionCount', b.question_count, 'createdAt', b.created_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_outgoing
  from public.battles b join public.profiles p on p.user_id = b.opponent_id
  where b.status = 'pending' and b.challenger_id = v_uid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', b.id, 'friendUserId', p.user_id, 'displayName', p.display_name,
    'avatarUrl', p.avatar_url, 'questionCount', b.question_count, 'questionIds', b.question_ids,
    'amIChallenger', b.challenger_id = v_uid,
    'iHaveFinished', exists(select 1 from public.battle_participants bp where bp.battle_id = b.id and bp.user_id = v_uid and bp.finished_at is not null),
    'opponentHasFinished', exists(select 1 from public.battle_participants bp where bp.battle_id = b.id and bp.user_id <> v_uid and bp.finished_at is not null)
  ) order by b.created_at desc), '[]'::jsonb)
  into v_active
  from public.battles b
  join public.profiles p on p.user_id = case when b.challenger_id = v_uid then b.opponent_id else b.challenger_id end
  where b.status = 'active' and (b.challenger_id = v_uid or b.opponent_id = v_uid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', h.id, 'friendUserId', h.friend_user_id, 'displayName', h.display_name,
    'avatarUrl', h.avatar_url, 'myCorrectCount', h.my_correct_count, 'opponentCorrectCount', h.opponent_correct_count,
    'totalCount', h.question_count, 'won', h.won, 'tied', h.tied, 'completedAt', h.completed_at
  ) order by h.completed_at desc), '[]'::jsonb)
  into v_history
  from (
    select b.id, opp.user_id as friend_user_id, p.display_name, p.avatar_url,
           me.correct_count as my_correct_count, opp.correct_count as opponent_correct_count,
           b.question_count, b.winner_id = v_uid as won, b.winner_id is null as tied, b.completed_at
    from public.battles b
    join public.battle_participants me on me.battle_id = b.id and me.user_id = v_uid
    join public.battle_participants opp on opp.battle_id = b.id and opp.user_id <> v_uid
    join public.profiles p on p.user_id = opp.user_id
    where b.status = 'completed' and (b.challenger_id = v_uid or b.opponent_id = v_uid)
    order by b.completed_at desc
    limit 20
  ) h;

  select battles_played, battles_won, total_questions_answered, total_questions_correct
  into v_stats
  from public.user_battle_stats where user_id = v_uid;

  return jsonb_build_object(
    'incoming', v_incoming,
    'outgoing', v_outgoing,
    'active', v_active,
    'history', v_history,
    'stats', jsonb_build_object(
      'battlesPlayed', coalesce(v_stats.battles_played, 0),
      'battlesWon', coalesce(v_stats.battles_won, 0),
      'winRatePct', case when coalesce(v_stats.battles_played, 0) = 0 then 0 else round(v_stats.battles_won::numeric / v_stats.battles_played * 100) end,
      'accuracyPct', case when coalesce(v_stats.total_questions_answered, 0) = 0 then 0 else round(v_stats.total_questions_correct::numeric / v_stats.total_questions_answered * 100) end
    )
  );
end;
$$;

revoke all on function public.fn_get_my_battles() from public;
grant execute on function public.fn_get_my_battles() to authenticated;
