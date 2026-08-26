import { useState } from 'react';
import type { AiTutorResponse } from '../../services/aiTutorService';
import { Icon } from './Icon';

/**
 * A small "ask the tutor" trigger + response panel, backed by whatever
 * services/aiTutorService.ts function the caller passes in — today that's
 * always the mock (see that file's header comment). Kept generic/reusable
 * rather than hardcoded to one call site, so a future exam-review screen
 * could use it too without duplicating this UI.
 */
export function AiTutorPanel({ fetchResponse }: { fetchResponse: () => Promise<AiTutorResponse> }) {
  const [response, setResponse] = useState<AiTutorResponse | null>(null);
  const [loading, setLoading] = useState(false);

  if (response) {
    return (
      <div
        style={{
          textAlign: 'left',
          background: 'var(--color-info-bg)',
          borderRadius: 14,
          padding: 14,
          marginTop: 4,
          marginBottom: 18,
          maxWidth: 280,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Icon name="help" size={14} color="var(--color-primary)" />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
            Tutor IA {response.isPlaceholder && '(beta)'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.5, whiteSpace: 'pre-line', margin: 0 }}>{response.text}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        fetchResponse()
          .then(setResponse)
          .finally(() => setLoading(false));
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: '1px dashed var(--color-primary)',
        borderRadius: 999,
        padding: '7px 14px',
        marginBottom: 18,
        color: 'var(--color-primary)',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: loading ? 'default' : 'pointer',
      }}
    >
      <Icon name="help" size={13} color="var(--color-primary)" />
      {loading ? 'Pensando…' : 'Preguntar al tutor IA'}
    </button>
  );
}
