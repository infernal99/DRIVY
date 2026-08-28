import { useState } from 'react';
import { shareResultCard, type ResultCardData } from '../../services/shareCardService';
import { Button } from './Button';

export function ShareResultButton({ data }: { data: ResultCardData }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setNote(null);
    const outcome = await shareResultCard(data);
    setBusy(false);
    if (outcome === 'downloaded') setNote('Imagen descargada.');
    if (outcome === 'failed') setNote('No se pudo generar la imagen. Inténtalo de nuevo.');
  }

  return (
    <>
      <Button variant="secondary" onClick={handleClick} disabled={busy}>
        {busy ? 'Generando…' : 'Compartir resultado'}
      </Button>
      {note && <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', textAlign: 'center', margin: '8px 0 0' }}>{note}</p>}
    </>
  );
}
