import type { IconName } from '../../types';

// Icon paths carried over 1:1 from the DRIVY.dc.html prototype's ICONS map,
// plus a handful of new ones drawn in the same stroke-based style for
// screens the prototype didn't cover.
const PATHS: Record<IconName, React.ReactNode> = {
  sign: <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  mail: (
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 6.5l8.2 6.6a1.3 1.3 0 0 0 1.6 0L21 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M10.6 6.1A8.9 8.9 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.2 8.2A17 17 0 0 0 2 12s3.6 6 10 6a9.4 9.4 0 0 0 3.6-.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  arrowRight: <path d="M5 12h13m-5.5-5.5L18.5 12l-6 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  bolt: <path d="M13.5 2L5 13.5h5.5L10 22l8.5-11.5H13L13.5 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  rules: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  road: (
    <>
      <path d="M7 3L4 21M17 3l3 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4v3M12 11v3M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  shield: <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M9 16V8h3.5a2.5 2.5 0 1 1 0 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  flag: <path d="M5 21V4M5 4h14l-3.5 3.5L19 11H5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  crown: (
    <path
      d="M4 18l-1.6-9 5 3.3L12 5l4.6 7.3 5-3.3L20 18H4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  home: <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2V5z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  chart: <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  check: <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />,
  lock: (
    <>
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="10.5" width="14" height="9.5" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="14.3" r="1.35" fill="currentColor" />
      <rect x="11.3" y="15.1" width="1.4" height="2.4" rx="0.6" fill="currentColor" />
    </>
  ),
  flame: <path d="M12 3c1 3-3 4-3 8a3 3 0 1 0 6 0c0-1.5-1-2-1-3 1.5 1 3 3 3 5.5A5 5 0 1 1 7 13.5C7 9 12 7 12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v3M12 19v3M4.2 5.2l2 2M17.8 16.8l2 2M2 12h3M19 12h3M4.2 18.8l2-2M17.8 7.2l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  chevronLeft: <path d="M15 4L7 12l8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  chevronRight: <path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  alcohol: (
    <>
      <path d="M8 3h8l-1 6-1.2 2H10.2L9 9 8 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 11v10M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  car: (
    <>
      <path d="M4 16V12l2-5h12l2 5v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 16h16v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="7.5" cy="16" r="1.4" fill="currentColor" />
      <circle cx="16.5" cy="16" r="1.4" fill="currentColor" />
    </>
  ),
  pedestrian: (
    <>
      <circle cx="12" cy="5" r="2.2" stroke="currentColor" strokeWidth="2" />
      <path d="M12 9v6M12 9l-4 2M12 9l4 2M12 15l-3 6M12 15l3 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  motorcycle: (
    <>
      <circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M6 17l4-7h5l3 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 10l2-3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  truck: (
    <>
      <path d="M2 7h10v9H2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 11h4l3 3v2h-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="6" cy="16" r="1.5" fill="currentColor" />
      <circle cx="17" cy="16" r="1.5" fill="currentColor" />
    </>
  ),
  bus: (
    <>
      <rect x="2" y="6" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="6.5" cy="16" r="1.6" fill="currentColor" />
      <circle cx="16.5" cy="16" r="1.6" fill="currentColor" />
    </>
  ),
  sources: (
    <>
      <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 21c0-3.6 2.7-6 6-6s6 2.4 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 4.8a3 3 0 0 1 0 6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15.5 15.2c2.6.5 4.2 2.3 4.5 5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="18" r="2.6" stroke="currentColor" strokeWidth="2" />
      <path d="M8.3 10.8l6.9-3.6M8.3 13.2l6.9 3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export function Icon({
  name,
  size = 22,
  color = 'currentColor',
  strokeWidth,
  className,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      color={color}
      style={strokeWidth ? ({ ['--icon-sw' as string]: strokeWidth } as React.CSSProperties) : undefined}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
