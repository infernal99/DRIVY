import { supabase } from '../lib/supabase';

// Scaffolding for Phase G — see the storage-buckets migration. No content
// references these buckets yet: question/sign artwork today is either
// hand-drawn SVG (components/ui/TrafficSign.tsx) or a plain external URL
// (QuestionImage#url). This exists so switching a QuestionImage over to a
// real uploaded asset, or adding an avatar-upload UI, is a call to the
// functions below, not a new subsystem.

export type ImageBucket = 'question-images' | 'sign-images' | 'illustrations' | 'avatars';

/** Public CDN URL for an object already in one of Roady's (all-public-read) image buckets. */
export function getPublicImageUrl(bucket: ImageBucket, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/**
 * Uploads (or overwrites) the signed-in user's own avatar. The path is
 * always `{userId}/...` because the `avatars` bucket's write RLS policy
 * only authorizes a user to write inside their own folder — see the
 * storage-buckets migration.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  if (error) throw error;
  return getPublicImageUrl('avatars', path);
}
