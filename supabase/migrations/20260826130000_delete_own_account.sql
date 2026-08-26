-- DRIVY: self-service account deletion.
--
-- Deletes the auth.users row for the calling user. Every progress table
-- created in 20260826120000/20260826120100 references auth.users(id) on
-- delete cascade, so this single delete cascades through profiles,
-- user_progress, question_stats, category_stats, completed_lessons,
-- unlocked_categories, user_achievements, exam_attempts, exam_answers and
-- xp_events automatically — no per-table cleanup needed here.
--
-- SECURITY: only ever deletes auth.uid() itself (never a client-supplied
-- id), and the client (src/services/authService.ts#deleteOwnAccount)
-- requires re-entering the current password immediately before calling
-- this, so a hijacked-but-still-open session can't casually wipe the
-- account without proving the password again.
create or replace function public.fn_delete_own_account()
returns void
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

  delete from auth.users where id = v_uid;
end;
$$;

revoke all on function public.fn_delete_own_account() from public;
grant execute on function public.fn_delete_own_account() to authenticated;
