-- Lets either player abandon an active duel outright: it ends immediately,
-- counts toward neither player's win rate/accuracy/XP (no writes to
-- user_battle_stats, xp_events, user_progress or achievements at all — this
-- is the whole point, an abandoned duel must be invisible to those numbers),
-- but the questions answered so far remain reviewable via
-- fn_get_battle_review, same as a normally completed duel.

alter table public.battles drop constraint battles_status_check;
alter table public.battles add constraint battles_status_check
  check (status in ('pending', 'declined', 'cancelled', 'active', 'completed', 'abandoned'));

-- ---------------------------------------------------------------------------
-- fn_abandon_battle — either participant can end their own active duel this
-- way. Deliberately does not touch battle_participants tallies,
-- user_battle_stats, xp_events, user_progress, or achievements.
-- ---------------------------------------------------------------------------
create or replace function public.fn_abandon_battle(p_battle_id bigint)
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

  update public.battles
  set status = 'abandoned', completed_at = now()
  where id = p_battle_id and status = 'active' and v_uid in (challenger_id, opponent_id);

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'battle not found or not active';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.fn_abandon_battle(bigint) from public;
grant execute on function public.fn_abandon_battle(bigint) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_battle_review — now also allowed for an abandoned duel (whatever
-- was answered before it ended is still reviewable; anything past that just
-- shows as unanswered for both, via the existing coalesce(..., false)).
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_battle_review(p_battle_id bigint)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_battle record;
  v_other_id uuid;
  v_result jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_battle from public.battles where id = p_battle_id and status in ('completed', 'abandoned');
  if not found or v_uid not in (v_battle.challenger_id, v_battle.opponent_id) then
    raise exception 'battle not found or not finished';
  end if;

  v_other_id := case when v_uid = v_battle.challenger_id then v_battle.opponent_id else v_battle.challenger_id end;

  select coalesce(jsonb_agg(jsonb_build_object(
    'questionId', q.question_id,
    'mySelectedOptionId', me.selected_option_id, 'myCorrect', coalesce(me.correct, false),
    'opponentSelectedOptionId', opp.selected_option_id, 'opponentCorrect', coalesce(opp.correct, false)
  ) order by q.ord), '[]'::jsonb)
  into v_result
  from unnest(v_battle.question_ids) with ordinality as q(question_id, ord)
  left join public.battle_answers me on me.battle_id = p_battle_id and me.user_id = v_uid and me.question_id = q.question_id
  left join public.battle_answers opp on opp.battle_id = p_battle_id and opp.user_id = v_other_id and opp.question_id = q.question_id;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- fn_get_my_battles — history now also includes abandoned duels (tagged
-- with `status` so the client shows "Abandonado" instead of a win/loss,
-- and never reads `won`/`tied` for one — winner_id is always null on an
-- abandoned row, which would otherwise misread as a tie).
-- ---------------------------------------------------------------------------
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
    'currentQuestionIndex', b.current_question_index,
    'questionStartedAt', b.question_started_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_active
  from public.battles b
  join public.profiles p on p.user_id = case when b.challenger_id = v_uid then b.opponent_id else b.challenger_id end
  where b.status = 'active' and (b.challenger_id = v_uid or b.opponent_id = v_uid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'battleId', h.id, 'friendUserId', h.friend_user_id, 'displayName', h.display_name,
    'avatarUrl', h.avatar_url, 'myCorrectCount', h.my_correct_count, 'opponentCorrectCount', h.opponent_correct_count,
    'totalCount', h.question_count, 'won', h.won, 'tied', h.tied, 'status', h.status, 'completedAt', h.completed_at
  ) order by h.completed_at desc), '[]'::jsonb)
  into v_history
  from (
    select b.id, opp.user_id as friend_user_id, p.display_name, p.avatar_url,
           me.correct_count as my_correct_count, opp.correct_count as opponent_correct_count,
           b.question_count, b.winner_id = v_uid as won, b.winner_id is null as tied, b.status, b.completed_at
    from public.battles b
    join public.battle_participants me on me.battle_id = b.id and me.user_id = v_uid
    join public.battle_participants opp on opp.battle_id = b.id and opp.user_id <> v_uid
    join public.profiles p on p.user_id = opp.user_id
    where b.status in ('completed', 'abandoned') and (b.challenger_id = v_uid or b.opponent_id = v_uid)
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
