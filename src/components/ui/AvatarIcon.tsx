import { AVATAR_CATALOG, type AvatarId } from '../../data/avatars';

/** Renders a catalog avatar's real artwork (public/avatars/*.png) in a circular frame. */
export function AvatarIcon({ avatarId, size = 44 }: { avatarId: AvatarId; size?: number }) {
  const imageUrl = AVATAR_CATALOG.find((a) => a.id === avatarId)?.imageUrl;
  if (!imageUrl) return null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flex: 'none',
        background: 'var(--color-primary-navy)',
      }}
    >
      <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}
