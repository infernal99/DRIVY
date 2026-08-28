import { isAvatarId } from '../../data/avatars';
import { AvatarIcon } from './AvatarIcon';

/**
 * Same circle used everywhere a person is shown (Home, Profile, Friends).
 * Renders their chosen catalog avatar (see src/data/avatars.ts) when
 * `avatarId` is a real catalog id — profiles.avatar_url stores one of
 * those ids once a user picks one — falling back to the original
 * initial-letter circle otherwise (nobody's picked one yet, or the value
 * isn't a recognized id).
 */
export function Avatar({ name, size = 44, avatarId }: { name: string; size?: number; avatarId?: string | null }) {
  if (isAvatarId(avatarId)) {
    return <AvatarIcon avatarId={avatarId} size={size} />;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2.8,
        background: 'linear-gradient(135deg,#2F6FED,#5B8CF5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        color: '#fff',
        fontSize: size * 0.4,
        flex: 'none',
      }}
    >
      {name.charAt(0).toUpperCase() || '?'}
    </div>
  );
}
