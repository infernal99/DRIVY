import { AVATAR_CATALOG, type AvatarId } from '../../data/avatars';

// Each catalog avatar is a colored badge (own gradient, not the theme's
// brand blue) with a simple glyph — meant to read as a distinct collectible
// rather than themed UI chrome, unlike the monochrome nav Icon set.
const AVATAR_STYLE: Partial<Record<AvatarId, { gradient: string; glyph: React.ReactNode }>> = {
  volante: {
    gradient: 'linear-gradient(135deg,#64748b,#94a3b8)',
    glyph: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="#fff" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.4" fill="#fff" />
        <path d="M12 5v4.6M12 14.4V19M5 12h4.6M14.4 12H19" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  semaforo: {
    gradient: 'linear-gradient(135deg,#334155,#1e293b)',
    glyph: (
      <>
        <rect x="8" y="3" width="8" height="18" rx="3" stroke="#fff" strokeWidth="1.6" />
        <circle cx="12" cy="7.2" r="1.7" fill="#ef4444" />
        <circle cx="12" cy="12" r="1.7" fill="#facc15" />
        <circle cx="12" cy="16.8" r="1.7" fill="#4ade80" />
      </>
    ),
  },
  stop: {
    gradient: 'linear-gradient(135deg,#dc2626,#b91c1c)',
    glyph: (
      <>
        <path
          d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M7.5 12h9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
  },
  casco: {
    gradient: 'linear-gradient(135deg,#f97316,#ea580c)',
    glyph: (
      <>
        <path d="M4 14a8 8 0 0 1 16 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 15.5v-4a4 4 0 0 1 8 0v4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M4.5 15h15" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  coche: {
    gradient: 'linear-gradient(135deg,#0d9488,#0f766e)',
    glyph: (
      <>
        <path d="M4 16v-4l2-5h12l2 5v4" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 16h16v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="7.5" cy="16" r="1.3" fill="#fff" />
        <circle cx="16.5" cy="16" r="1.3" fill="#fff" />
      </>
    ),
  },
  rayo: {
    gradient: 'linear-gradient(135deg,#facc15,#f59e0b)',
    glyph: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="#fff" stroke="#fff" strokeWidth="0.5" strokeLinejoin="round" />,
  },
  trofeo: {
    gradient: 'linear-gradient(135deg,#eab308,#ca8a04)',
    glyph: (
      <>
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 5H4.5a1 1 0 0 0-1 1.2c.4 2 1.8 3.4 3.7 3.7M17 5h2.5a1 1 0 0 1 1 1.2c-.4 2-1.8 3.4-3.7 3.7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 14v3M9 20h6M9.5 20c0-1.8.7-2.6 2.5-3 1.8.4 2.5 1.2 2.5 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  corona: {
    gradient: 'linear-gradient(135deg,#a855f7,#7e22ce)',
    glyph: (
      <>
        <path d="M4 17l-1.4-8 4.9 3.5L12 6l4.5 6.5 4.9-3.5-1.4 8H4z" fill="#facc15" stroke="#facc15" strokeWidth="0.6" strokeLinejoin="round" />
        <rect x="4" y="17" width="16" height="2.4" rx="1" fill="#facc15" />
      </>
    ),
  },
  diamante: {
    gradient: 'linear-gradient(135deg,#22d3ee,#a855f7)',
    glyph: (
      <>
        <path d="M4 9l4-5h8l4 5-10 11L4 9z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M4 9h16M8 4l2 5-2 11M16 4l-2 5 2 11" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      </>
    ),
  },
  vip: {
    gradient: 'linear-gradient(135deg,#18181b,#3f3f46)',
    glyph: (
      <path
        d="M12 3.5l2.47 5.01 5.53.8-4 3.9.94 5.5L12 15.98l-4.94 2.73.94-5.5-4-3.9 5.53-.8L12 3.5z"
        fill="#facc15"
        stroke="#facc15"
        strokeWidth="0.4"
        strokeLinejoin="round"
      />
    ),
  },
  cometa: {
    gradient: 'linear-gradient(135deg,#0ea5e9,#312e81)',
    glyph: (
      <>
        <circle cx="15" cy="9" r="3" fill="#fff" />
        <path d="M13 11 5 19M11 9 3 13M13 7 7 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
};

export function AvatarIcon({ avatarId, size = 44 }: { avatarId: AvatarId; size?: number }) {
  const imageUrl = AVATAR_CATALOG.find((a) => a.id === avatarId)?.imageUrl;
  if (imageUrl) {
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

  const style = AVATAR_STYLE[avatarId];
  if (!style) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2.8,
        background: style.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill="none">
        {style.glyph}
      </svg>
    </div>
  );
}
