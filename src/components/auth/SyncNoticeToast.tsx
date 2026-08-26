import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

/** Mounted once in App.tsx — surfaces the guest→account migration outcome (success or failure). */
export function SyncNoticeToast() {
  const notice = useAuthStore((s) => s.syncNotice);
  const clearSyncNotice = useAuthStore((s) => s.clearSyncNotice);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(clearSyncNotice, 4000);
    return () => clearTimeout(timer);
  }, [notice, clearSyncNotice]);

  if (!notice) return null;

  const isError = notice.kind === 'error';
  return (
    <div
      className="anim-pop-in"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        maxWidth: 320,
        textAlign: 'center',
        background: isError ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
        color: isError ? 'var(--color-error)' : 'var(--color-success)',
        padding: '10px 16px',
        borderRadius: 14,
        fontSize: 12.5,
        fontWeight: 700,
        boxShadow: 'var(--shadow-elevated)',
      }}
    >
      {notice.message}
    </div>
  );
}
