import { create } from 'zustand';

// Whether answering plays a short sound + haptic buzz. On by default; a
// single boolean, not per-context — lessons/practice/duels all use it,
// exams deliberately never do (see feedbackEffects.ts's header comment).
const STORAGE_KEY = 'drivy.feedbackFx.v1';

function loadEnabled(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

interface FeedbackSettingsState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const useFeedbackSettingsStore = create<FeedbackSettingsState>((set) => ({
  enabled: loadEnabled(),
  setEnabled: (enabled) => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch {
      // Best-effort — worst case the choice doesn't survive a reload.
    }
    set({ enabled });
  },
}));
