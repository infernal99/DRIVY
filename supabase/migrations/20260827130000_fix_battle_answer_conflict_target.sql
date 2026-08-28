-- Fix fn_submit_battle_answer: the insert's ON CONFLICT (battle_id, user_id,
-- question_index) targeted battle_answers_round_idx, which is a PARTIAL
-- unique index (where question_index is not null). Postgres only infers a
-- partial index as an ON CONFLICT target when the conflict clause repeats
-- that same WHERE predicate — without it, every insert raised "there is no
-- unique or exclusion constraint matching the ON CONFLICT specification",
-- silently swallowed by the client, which is why no round ever advanced for
-- either player once the 30s timer (or a real answer) tried to record it.

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
    perform public.fn_check_achievements(v_other_id);
  else
    update public.battles set current_question_index = p_question_index + 1, question_started_at = now() where id = p_battle_id;
  end if;

  return public.fn_get_battle_round(p_battle_id);
end;
$$;
