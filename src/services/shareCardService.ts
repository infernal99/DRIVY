// Draws a branded result card straight onto an offscreen <canvas> — no
// external image-generation library, no server round-trip. Used for both
// exam results and duel results (see ShareResultButton), so the shape is
// generic rather than tied to either one specifically.

export interface ResultCardData {
  /** Big headline, e.g. "¡Apto!" / "No apto" / "¡Has ganado el duelo!" / "Has perdido este duelo". */
  title: string;
  /** The big number(s), e.g. "27 / 30" or "7 - 3". */
  scoreLine: string;
  /** Small line under the score, e.g. "Simulacro de examen" or "Duelo vs Uri". */
  subtitle: string;
  userName: string;
  /** Picks the gradient — success (blue/brand) vs a muted red for a loss. */
  positive: boolean;
}

const WIDTH = 1080;
const HEIGHT = 1350;

async function ensureFontsLoaded() {
  try {
    await Promise.all([
      document.fonts.load('700 100px Fredoka'),
      document.fonts.load('600 40px "Plus Jakarta Sans"'),
      document.fonts.load('500 32px "Plus Jakarta Sans"'),
    ]);
    await document.fonts.ready;
  } catch {
    // Falls back to the canvas default font — still legible, just not on-brand.
  }
}

export async function generateResultCardImage(data: ResultCardData): Promise<Blob> {
  await ensureFontsLoaded();

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  if (data.positive) {
    gradient.addColorStop(0, '#122B57');
    gradient.addColorStop(0.6, '#1E4694');
    gradient.addColorStop(1, '#2F6FED');
  } else {
    gradient.addColorStop(0, '#3d1216');
    gradient.addColorStop(1, '#5b1f22');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.arc(WIDTH - 60, 140, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(60, HEIGHT - 120, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = '700 52px Fredoka, sans-serif';
  ctx.fillText('DRIVY', 70, 130);

  ctx.textAlign = 'center';
  ctx.font = '600 44px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, data.title, WIDTH / 2, 340, WIDTH - 140, 54);

  ctx.font = '700 180px Fredoka, sans-serif';
  ctx.fillText(data.scoreLine, WIDTH / 2, HEIGHT / 2 + 60);

  ctx.font = '500 38px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(data.subtitle, WIDTH / 2, HEIGHT / 2 + 150);

  ctx.font = '600 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(data.userName, WIDTH / 2, HEIGHT - 90);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let lineY = y;
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = candidate;
    }
  }
  ctx.fillText(line, x, lineY);
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled' | 'failed';

/** Generates the card and either opens the native share sheet (with the image attached) or falls back to downloading it. */
export async function shareResultCard(data: ResultCardData): Promise<ShareOutcome> {
  try {
    const blob = await generateResultCardImage(data);
    const file = new File([blob], 'drivy-resultado.png', { type: 'image/png' });

    const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'DRIVY', text: data.title });
        return 'shared';
      } catch (err) {
        if ((err as Error).name === 'AbortError') return 'cancelled';
        throw err;
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drivy-resultado.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return 'downloaded';
  } catch {
    return 'failed';
  }
}
