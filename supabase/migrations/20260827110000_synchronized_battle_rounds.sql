-- Redesigns 1v1 battles from "answer all 10 at your own pace, compare final
-- scores whenever both finish" to a synchronized, round-by-round duel:
--   - Accepting a battle starts round 0 immediately for both players (no
--     extra "entrar" click — the client navigates straight to /battles/:id
--     the moment accept/send succeeds).
--   - Each round (one question) has a 30s deadline, tracked server-side via
--     battles.question_started_at so both clients count down from the same
--     instant regardless of when each of them loaded the page.
--   - A round only advances once BOTH players have an answer row for it —
--     either a real answer, or a forced "no answer" row inserted for
--     whoever hasn't answered once the 30s deadline has passed (see
--     fn_submit_battle_answer). This is what makes "answer or timeout, then
--     both reveal together" work without any realtime infra: any client
--     hitting its own local 30s timer just resubmits (idempotently, if it
--     already answered) and that resubmission forces the opponent's timeout
--     and advances the round.
--   - fn_get_battle_round is the poll target while a duel is in progress; it
--     also carries `lastRound` (both players' answers for the round that
--     just concluded) so the client can show the "did you get it right"
--     reveal for both without a second round-trip.

alter table public.battles
  add column current_question_index integer not null default 0,
  add column question_started_at timestamptz;

alter table public.battle_answers
  add column question_index integer;

-- Partial (question_index is null for any pre-existing rows from the old
-- batch-submit flow, which never populated it — NULLs never collide in a
-- unique index, so this is safe to add without touching that history).
create unique index battle_answers_round_idx
  on public.battle_answers (battle_id, user_id, question_index)
  where question_index is not null;

drop function if exists public.fn_submit_battle_answers(bigint, jsonb);

-- ---------------------------------------------------------------------------
-- fn_respond_battle_request — now also arms round 0 on accept, so both
-- players can start polling fn_get_battle_round immediately.
-- ---------------------------------------------------------------------------
create or replace function public.fn_respond_battle_request(p_battle_id bigint, p_accept boolean, p_question_ids text[] default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_battle record;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_battle from public.battles where id = p_battle_id and opponent_id = v_uid and status = 'pending';
  if not found then
    raise exception 'battle not found or not actionable';
  end if;

  if not p_accept then
    update public.battles set status = 'declined', responded_at = now() where id = p_battle_id;
    return jsonb_build_object('status', 'declined');
  end if;

  if p_question_ids is null or array_length(p_question_ids, 1) <> v_battle.question_count then
    raise exception 'question_ids must match question_count';
  end if;

  update public.battles
  set status = 'active', responded_at = now(), question_ids = p_question_ids,
      current_question_index = 0, question_started_at = now()
  where id = p_battle_id;

  insert into public.battle_participants (battle_id, user_id)
  values (p_battle_id, v_battle.challenger_id), (p_battle_id, v_battle.opponent_id);

  return jsonb_build_object('status', 'active');
end;
$$;

-- ---------------------------------------------------------------------------
-- fn_get_battle_round — poll target while a duel is active: the current
-- round's deadline plus whether each side has answered it yet (never the
-- content of either answer — that would let a client peek before both are
-- locked in), and the previous round's full reveal once it has concluded.
-- ---------------------------------------------------------------------------
create or replace function public.fn_get_battle_round(p_battle_id bigint)
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
  v_me_answered boolean;
  v_other_answered boolean;
  v_last_index integer;
  v_last_round jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_battle from public.battles where id = p_battle_id;
  if not found or v_uid not in (v_battle.challenger_id, v_battle.opponent_id) then
    raise exception 'battle not found';
  end if;

  v_other_id := case when v_uid = v_battle.challenger_id then v_battle.opponent_id else v_battle.challenger_id end;

  select exists(
    select 1 from public.battle_answers
    where battle_id = p_battle_id and user_id = v_uid and question_index = v_battle.current_question_index
  ) into v_me_answered;

  select exists(
    select 1 from public.battle_answers
    where battle_id = p_battle_id and user_id = v_other_id and question_index = v_battle.current_question_index
  ) into v_other_answered;

  v_last_index := v_battle.current_question_index - 1;
  v_last_round := null;
  if v_last_index >= 0 then
    select jsonb_build_object(
      'index', v_last_index,
      'myAnswer', jsonb_build_object('selectedOptionId', me.selected_option_id, 'correct', me.correct),
      'opponentAnswer', jsonb_build_object('selectedOptionId', opp.selected_option_id, 'correct', opp.correct)
    )
    into v_last_round
    from public.battle_answers me
    join public.battle_answers opp
      on opp.battle_id = p_battle_id and opp.user_id = v_other_id and opp.question_index = v_last_index
    where me.battle_id = p_battle_id and me.user_id = v_uid and me.question_index = v_last_index;
  end if;

  return jsonb_build_object(
    'status', v_battle.status,
    'currentQuestionIndex', v_battle.current_question_index,
    'questionStartedAt', v_battle.question_started_at,
    'questionCount', v_battle.question_count,
    'myAnsweredThisRound', v_me_answered,
    'opponentAnsweredThisRound', v_other_answered,
    'lastRound', v_last_round,
    'winnerId', v_battle.winner_id
  );
end;
$$;

revoke all on function public.fn_get_battle_round(bigint) from public;
grant execute on function public.fn_get_battle_round(bigint) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_submit_battle_answer — records this participant's answer for exactly
-- one round (the caller's own answer, or a null/incorrect one if their local
-- 30s timer already elapsed with nothing selected). If the round's deadline
-- has passed and the OTHER participant still has no answer for it, this also
-- forces a null/incorrect row for them — that's what lets a round resolve
-- even if the opponent's client has gone away, and it's safe to run from
-- either side since it only ever inserts a missing row, never overwrites one.
-- Once both rows exist the round's tallies are applied and the battle either
-- advances to the next question or completes (winner + XP + stats, same
-- rules as before).
-- ---------------------------------------------------------------------------
create or replace function public.fn_submit_battle_answer(
  p_battle_id bigint,
  p_question_index integer,
  p_question_id text,
  p_selected_option_id text,
  p_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_battle record;
  v_other_id uuid;
  v_deadline timestamptz;
  v_me_row public.battle_answers;
  v_other_row public.battle_answers;
  v_me_participant public.battle_participants;
  v_other_participant public.battle_participants;
  v_winner uuid;
  v_my_xp integer;
  v_other_xp integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_battle from public.battles where id = p_battle_id and status = 'active';
  if not found or v_uid not in (v_battle.challenger_id, v_battle.opponent_id) then
    raise exception 'battle not found or not active';
  end if;

  if p_question_index <> v_battle.current_question_index then
    -- Stale submission for a round that already advanced elsewhere — just
    -- hand back the current state instead of erroring the client out.
    return public.fn_get_battle_round(p_battle_id);
  end if;

  v_other_id := case when v_uid = v_battle.challenger_id then v_battle.opponent_id else v_battle.challenger_id end;
  v_deadline := v_battle.question_started_at + interval '30 seconds';

  insert into public.battle_answers (battle_id, user_id, question_index, question_id, selected_option_id, correct)
  values (p_battle_id, v_uid, p_question_index, p_question_id, p_selected_option_id, coalesce(p_correct, false))
  on conflict (battle_id, user_id, question_index) where question_index is not null do nothing;

  if now() >= v_deadline then
    insert into public.battle_answers (battle_id, user_id, question_index, question_id, selected_option_id, correct)
    select p_battle_id, v_other_id, p_question_index, p_question_id, null, false
    where not exists (
      select 1 from public.battle_answers
      where battle_id = p_battle_id and user_id = v_other_id and question_index = p_question_index
    );
  end if;

  select * into v_me_row from public.battle_answers where battle_id = p_battle_id and user_id = v_uid and question_index = p_question_index;
  select * into v_other_row from public.battle_answers where battle_id = p_battle_id and user_id = v_other_id and question_index = p_question_index;

  if v_me_row.id is null or v_other_row.id is null then
    -- Still waiting on the opponent and the deadline hasn't passed yet.
    return public.fn_get_battle_round(p_battle_id);
  end if;

  update public.battle_participants
  set correct_count = correct_count + case when v_me_row.correct then 1 else 0 end, total_answered = total_answered + 1
  where battle_id = p_battle_id and user_id = v_uid;

  update public.battle_participants
  set correct_count = correct_count + case when v_other_row.correct then 1 else 0 end, total_answered = total_answered + 1
  where battle_id = p_battle_id and user_id = v_other_id;

  if p_question_index + 1 >= v_battle.question_count then
    select * into v_me_participant from public.battle_participants where battle_id = p_battle_id and user_id = v_uid;
    select * into v_other_participant from public.battle_participants where battle_id = p_battle_id and user_id = v_other_id;

    if v_me_participant.correct_count > v_other_participant.correct_count then
      v_winner := v_uid;
    elsif v_other_participant.correct_count > v_me_participant.correct_count then
      v_winner := v_other_id;
    else
      v_winner := null;
    end if;

    update public.battles
    set status = 'completed', completed_at = now(), winner_id = v_winner, current_question_index = p_question_index + 1
    where id = p_battle_id;

    v_my_xp := case when v_winner = v_uid then 50 when v_winner is null then 15 else 5 end;
    v_other_xp := case when v_winner = v_other_id then 50 when v_winner is null then 15 else 5 end;

    insert into public.user_battle_stats (user_id, battles_played, battles_won, total_questions_answered, total_questions_correct)
    values (v_uid, 1, case when v_winner = v_uid then 1 else 0 end, v_me_participant.total_answered, v_me_participant.correct_count)
    on conflict (user_id) do update set
      battles_played = user_battle_stats.battles_played + 1,
      battles_won = user_battle_stats.battles_won + case when v_winner = v_uid then 1 else 0 end,
      total_questions_answered = user_battle_stats.total_questions_answered + v_me_participant.total_answered,
      total_questions_correct = user_battle_stats.total_questions_correct + v_me_participant.correct_count,
      updated_at = now();

    insert into public.user_battle_stats (user_id, battles_played, battles_won, total_questions_answered, total_questions_correct)
    values (v_other_id, 1, case when v_winner = v_other_id then 1 else 0 end, v_other_participant.total_answered, v_other_participant.correct_count)
    on conflict (user_id) do update set
      battles_played = user_battle_stats.battles_played + 1,
      battles_won = user_battle_stats.battles_won + case when v_winner = v_other_id then 1 else 0 end,
      total_questions_answered = user_battle_stats.total_questions_answered + v_other_participant.total_answered,
      total_questions_correct = user_battle_stats.total_questions_correct + v_other_participant.correct_count,
      updated_at = now();

    update public.user_progress set xp = xp + v_my_xp, updated_at = now() where user_id = v_uid;
    update public.user_progress set xp = xp + v_other_xp, updated_at = now() where user_id = v_other_id;

    insert into public.xp_events (user_id, amount, reason) values (v_uid, v_my_xp, case when v_winner = v_uid then 'exam_passed' else 'exam_failed' end);
    insert into public.xp_events (user_id, amount, reason) values (v_other_id, v_other_xp, case when v_winner = v_other_id then 'exam_passed' else 'exam_failed' end);

    perform public.fn_check_achievements(v_uid);
  else
    update public.battles set current_question_index = p_question_index + 1, question_started_at = now() where id = p_battle_id;
  end if;

  return public.fn_get_battle_round(p_battle_id);
end;
$$;

revoke all on function public.fn_submit_battle_answer(bigint, integer, text, text, boolean) from public;
grant execute on function public.fn_submit_battle_answer(bigint, integer, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_battle_review — full question-by-question breakdown of a completed
-- battle (both players' picks + correctness, in question order) so the
-- client can show a post-duel review using its own local question bank for
-- the question text, options and explanation.
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

  select * into v_battle from public.battles where id = p_battle_id and status = 'completed';
  if not found or v_uid not in (v_battle.challenger_id, v_battle.opponent_id) then
    raise exception 'battle not found or not completed';
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

revoke all on function public.fn_get_battle_review(bigint) from public;
grant execute on function public.fn_get_battle_review(bigint) to authenticated;

-- ---------------------------------------------------------------------------
-- fn_get_my_battles — active-battle entries now carry the round state
-- (currentQuestionIndex/questionStartedAt) instead of the old finished_at-
-- based flags, since nobody "finishes early" in the synchronized model.
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
