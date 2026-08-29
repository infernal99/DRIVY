import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Roady: missing Supabase environment variables. ' +
      'Define VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local ' +
      '(restart `npm run dev` after creating/editing it — Vite only reads env files at startup).',
  );
}

/**
 * Single Supabase client for the whole app. Uses the publishable key only —
 * never the secret/service_role key, which must never reach frontend code.
 * Session persistence (localStorage) and token refresh are handled by the
 * client itself; see src/store/authStore.ts for the single onAuthStateChange
 * listener that reacts to it.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
