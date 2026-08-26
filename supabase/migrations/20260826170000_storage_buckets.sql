-- DRIVY Phase G: Storage bucket scaffolding for images.
--
-- Scaffolding only — no content is migrated into these buckets by this
-- migration. Question/sign artwork today is either hand-drawn SVG in code
-- (components/ui/TrafficSign.tsx) or a plain external URL in QuestionImage
-- (see src/types/index.ts, extended by this phase with an optional
-- `storagePath`) — nothing currently reads from these buckets. This exists
-- so pointing a QuestionImage (or an avatar) at a real uploaded asset later
-- is a one-field change, not a new infra project.
--
-- storage.objects already has RLS enabled by default in a Supabase project,
-- so this only adds policies, not `enable row level security` itself.

insert into storage.buckets (id, name, public) values
  ('question-images', 'question-images', true),
  ('sign-images', 'sign-images', true),
  ('illustrations', 'illustrations', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Content buckets (question/sign/illustration artwork): public read, no
-- client write at all. These are populated out-of-band as part of the
-- content pipeline (Supabase dashboard/CLI/service role) — never by an end
-- user's browser — same trust boundary as the static question bank itself.
create policy "question_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'question-images');

create policy "sign_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'sign-images');

create policy "illustrations_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'illustrations');

-- avatars: public read (an avatar is shown to friends already, same as
-- display_name is — see fn_get_friend_profile), but write is restricted to
-- the object's own `{user_id}/...` folder, so a user can only manage their
-- own avatar files.
create policy "avatars_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "avatars_owner_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "avatars_owner_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "avatars_owner_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
