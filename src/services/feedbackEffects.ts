import { useFeedbackSettingsStore } from '../store/feedbackSettingsStore';

// Short synthesized tones (Web Audio oscillators) + a haptic buzz
// (navigator.vibrate) on every answer — no audio asset files needed.
// Deliberately NOT wired into ExamPage: a real exam gives no instant
// right/wrong feedback per question (that's the whole point of the
// simulation), so playing a sound there would give away the answer before
// the final result screen. Lessons/practice/mistake review/duels all
// reveal correctness immediately anyway, so sound there is just
// reinforcing what's already on screen.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function playTones(freqs: number[], noteDuration: number, type: OscillatorType) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  freqs.forEach((freq, i) => {
    const start = now + i * noteDuration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + noteDuration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteDuration + 0.02);
  });
}

/** Call the moment an answer's correctness becomes visible to the player. */
export function playAnswerFeedback(correct: boolean) {
  if (!useFeedbackSettingsStore.getState().enabled) return;

  try {
    if (correct) {
      playTones([523.25, 659.25], 0.11, 'sine'); // C5 → E5, a quick cheerful "ding"
    } else {
      playTones([196], 0.2, 'triangle'); // low, short buzz
    }
  } catch {
    // Some browsers/contexts (e.g. autoplay-restricted) can throw here —
    // never let a missing sound break the actual answer flow.
  }

  if (navigator.vibrate) {
    navigator.vibrate(correct ? 15 : [40, 30, 40]);
  }
}
