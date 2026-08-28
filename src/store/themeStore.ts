import { create } from 'zustand';

// "system" always resolves through window.matchMedia in JS and sets an
// explicit data-theme="light"/"dark" attribute — it deliberately does NOT
// rely on an @media (prefers-color-scheme) block in theme.css. That
// combination (the media block alongside the data-theme="dark" attribute
// selector) made Vite's CSS minifier (lightningcss) emit broken internal
// bookkeeping custom properties that silently left `body`'s background on
// the light value regardless of the resolved theme — see theme.css's
// comment on the dark block. index.html's inline script applies the same
// resolution synchronously before first paint, so there's no flash either way.

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'drivy.theme.v1';

function loadPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'light' || raw === 'dark' ? raw : 'system';
  } catch {
    return 'system';
  }
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyPreference(pref: ThemePreference) {
  if (typeof document === 'undefined') return;
  const resolved = pref === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : pref;
  document.documentElement.setAttribute('data-theme', resolved);
}

interface ThemeState {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: loadPreference(),
  setPreference: (pref) => {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // Best-effort — worst case the choice doesn't survive a reload.
    }
    applyPreference(pref);
    set({ preference: pref });
  },
}));

// index.html's inline script already applied the resolved theme before
// paint; this just keeps the DOM attribute in sync in case it didn't run
// for some reason (e.g. localStorage blocked there but not here), and wires
// up live updates for "system" users who change their OS theme mid-session.
applyPreference(useThemeStore.getState().preference);

if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().preference === 'system') {
      applyPreference('system');
    }
  });
}
