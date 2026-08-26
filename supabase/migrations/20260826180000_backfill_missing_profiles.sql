-- DRIVY: backfill profiles/user_progress/unlocked_categories for any
-- auth.users row that predates fn_handle_new_user's trigger — e.g. an
-- account created while the schema was still being deployed, before the
-- `on_auth_user_created` trigger existed, so nothing ever provisioned it.
--
-- Idempotent: the `left join ... where p.user_id is null` guard means this
-- only inserts for a user with no existing profiles row — running it again
-- (or on a project where everyone is already provisioned) is a no-op.
do $$
declare
  v_user record;
begin
  for v_user in
    select u.id, u.email, u.raw_user_meta_data
    from auth.users u
    left join public.profiles p on p.user_id = u.id
    where p.user_id is null
  loop
    insert into public.profiles (user_id, display_name, friend_code)
    values (
      v_user.id,
      coalesce(nullif(trim(v_user.raw_user_meta_data ->> 'full_name'), ''), split_part(v_user.email, '@', 1)),
      public.fn_generate_friend_code()
    );

    insert into public.user_progress (user_id, unlocked_category_ids)
    values (v_user.id, array['senales'])
    on conflict (user_id) do nothing;

    insert into public.unlocked_categories (user_id, category_id)
    values (v_user.id, 'senales')
    on conflict (user_id, category_id) do nothing;
  end loop;
end $$;
