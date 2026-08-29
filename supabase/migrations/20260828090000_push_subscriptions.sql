-- Web Push subscriptions, one row per (user, browser/device). Actually
-- SENDING a push requires the VAPID private key, which must never reach the
-- client — that only happens from the Vercel serverless function
-- (api/send-push.ts), authenticated with the Supabase service role key
-- (bypasses RLS entirely, since it has to read another user's subscription
-- rows to notify them). This table only needs client-facing RLS for the
-- subscribe/unsubscribe path — a user manages their own rows directly, no
-- RPC needed.

create table public.push_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions_select_own"
  on public.push_subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "push_subscriptions_insert_own"
  on public.push_subscriptions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "push_subscriptions_delete_own"
  on public.push_subscriptions for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);
