import { supabase } from '../lib/supabase';

/** profiles.avatar_url stores a catalog id (see src/data/avatars.ts) once chosen — null until then. */
export async function getMyAvatarId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('avatar_url').eq('user_id', user.id).single();
  return data?.avatar_url ?? null;
}

/** Re-validated server-side against the caller's real XP — see fn_set_my_avatar. */
export async function setMyAvatar(avatarId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_set_my_avatar', { p_avatar_id: avatarId });
  if (error) throw error;
}
