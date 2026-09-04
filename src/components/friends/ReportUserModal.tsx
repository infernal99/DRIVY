import { useState } from 'react';
import { reportUser, type ReportReason } from '../../services/friendsService';
import { Icon } from '../ui/Icon';

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'acoso', label: 'Acoso o comportamiento abusivo' },
  { value: 'suplantacion', label: 'Suplantación de identidad' },
  { value: 'contenido_inapropiado', label: 'Nombre o avatar inapropiado' },
  { value: 'spam', label: 'Spam o solicitudes repetidas' },
  { value: 'otro', label: 'Otro motivo' },
];

/** Denuncia a un usuario (fn_report_user) con la opción de bloquearlo a la vez. Ver el diseño en la migración 20260903090000. */
export function ReportUserModal({ userId, displayName, onClose, onDone }: { userId: string; displayName: string; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit() {
    if (!reason) {
      setError('Elige un motivo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    reportUser(userId, reason, details.trim() || undefined, alsoBlock)
      .then(() => setDone(true))
      .catch(() => setError('No se pudo enviar la denuncia. Inténtalo de nuevo.'))
      .finally(() => setSubmitting(false));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Denunciar a ${displayName}`}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-text-muted-55)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (done) onDone();
        else onClose();
      }}
    >
      <div
        className="anim-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-card)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 28px',
          width: '100%',
          maxWidth: 420,
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {done ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Icon name="check" size={24} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--color-text)', marginBottom: 6 }}>
              Denuncia enviada
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted-60)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Gracias por avisarnos. La revisaremos{alsoBlock ? ' y ya no podrá contactarte' : ''}.
            </p>
            <button
              type="button"
              onClick={onDone}
              style={{
                width: '100%',
                padding: '14px 0',
                border: 'none',
                borderRadius: 12,
                background: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--color-text)', marginBottom: 4 }}>
              Denunciar a {displayName}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Cuéntanos qué ha pasado. Tu identidad no se comparte con la persona denunciada.
            </p>

            {error && (
              <div
                className="anim-shake"
                style={{
                  background: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: reason === r.value ? 'var(--color-info-bg)' : 'var(--color-bg-screen)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{r.label}</span>
                </label>
              ))}
            </div>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Detalles adicionales (opcional)"
              rows={3}
              style={{
                width: '100%',
                resize: 'none',
                borderRadius: 12,
                border: '1px solid var(--color-divider)',
                background: 'var(--color-bg-screen)',
                color: 'var(--color-text)',
                padding: 10,
                fontSize: 13,
                fontFamily: 'inherit',
                marginBottom: 14,
                boxSizing: 'border-box',
              }}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 12.5, color: 'var(--color-text-muted-60)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={alsoBlock}
                onChange={(e) => setAlsoBlock(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
              />
              También bloquear a esta persona
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px 0',
                border: 'none',
                borderRadius: 12,
                background: 'var(--color-error)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 10,
              }}
            >
              {submitting ? 'Enviando…' : 'Enviar denuncia'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{ width: '100%', padding: '12px 0', border: 'none', background: 'none', color: 'var(--color-text-muted-60)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
