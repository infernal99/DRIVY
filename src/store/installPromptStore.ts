import { create } from 'zustand';

// The browser only fires `beforeinstallprompt` once, whenever it decides the
// PWA install criteria are met — often before any React component has
// mounted. This module attaches its listener at import time (module-level
// side effect, not inside a component) and is imported first thing in
// main.tsx specifically so it's never missed. iOS Safari never fires this
// event at all (Apple has no programmatic install API), so `isIOS` is a
// separate signal the UI uses to show manual "Compartir → Añadir a
// pantalla de inicio" instructions instead of a real install button there.

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptState {
  deferredEvent: BeforeInstallPromptEvent | null;
  installed: boolean;
  isIOS: boolean;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
}

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export const useInstallPromptStore = create<InstallPromptState>(() => ({
  deferredEvent: null,
  installed: detectStandalone(),
  isIOS: detectIOS(),
}));

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    useInstallPromptStore.setState({ deferredEvent: e as BeforeInstallPromptEvent });
  });

  window.addEventListener('appinstalled', () => {
    useInstallPromptStore.setState({ installed: true, deferredEvent: null });
  });
}

/** Triggers the native install prompt (Android/desktop only — see isIOS). Resolves to whether the user accepted. */
export async function promptInstall(): Promise<boolean> {
  const { deferredEvent } = useInstallPromptStore.getState();
  if (!deferredEvent) return false;
  await deferredEvent.prompt();
  const { outcome } = await deferredEvent.userChoice;
  useInstallPromptStore.setState({ deferredEvent: null });
  return outcome === 'accepted';
}
