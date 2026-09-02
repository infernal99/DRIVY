import { useEffect, useState } from 'react';
import { preloadShareCardFonts, shareResultCard, type ResultCardData } from '../../services/shareCardService';
import { Button } from './Button';

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

/**
 * Core "share this result" logic (image generation + share/download +
 * status note), split out of <ShareResultButton> so screens that need a
 * differently-styled trigger (e.g. BattlePage's result screen) can reuse it
 * without forking the sharing behavior itself.
 */
export function useShareResult(data: ResultCardData) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  // Starts font loading the moment this screen appears rather than lazily
  // on tap — see shareCardService's comment on preloadShareCardFonts for
  // why (Safari's share() needs to fire promptly after the user gesture).
  useEffect(() => {
    preloadShareCardFonts();
  }, []);

  async function handleClick() {
    setBusy(true);
    setNote(null);
    const outcome = await shareResultCard(data);
    setBusy(false);
    if (outcome === 'downloaded') setNote(isIOS ? 'Mantén pulsada la imagen para guardarla.' : 'Imagen descargada.');
    if (outcome === 'failed') setNote('No se pudo generar la imagen. Inténtalo de nuevo.');
  }

  return { busy, note, handleClick };
}

export function ShareResultButton({ data }: { data: ResultCardData }) {
  const { busy, note, handleClick } = useShareResult(data);

  return (
    <>
      <Button variant="secondary" onClick={handleClick} disabled={busy}>
        {busy ? 'Generando…' : 'Compartir resultado'}
      </Button>
      {note && <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)', textAlign: 'center', margin: '8px 0 0' }}>{note}</p>}
    </>
  );
}
