/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// Injected at build time by vite-plugin-pwa (injectManifest strategy) with
// the list of app-shell files to precache for offline boot.
precacheAndRoute(self.__WB_MANIFEST);

// registerType: 'autoUpdate' in vite.config.ts only does anything when the
// client also imports vite-plugin-pwa's `virtual:pwa-register` module to
// drive the update — this app never did, so the real registration script
// (dist/registerSW.js) is just a bare `serviceWorker.register()` with no
// update logic at all. Without this, a newly deployed SW sits in "waiting"
// until every open tab is closed, so a shipped fix (like a corrected
// question image) silently doesn't show up for anyone with the app already
// open — confusing to debug from the outside, since the deployment itself
// looks fine. Taking over immediately is the simpler fix: skip the waiting
// phase and claim already-open clients as soon as this version activates.
self.skipWaiting();
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

self.addEventListener('push', (event: PushEvent) => {
  let payload: PushPayload = { title: 'Roady', body: 'Tienes novedades.' };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    // Malformed/non-JSON payload — fall back to the generic message above.
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: payload.url ?? '/' },
    }),
  );
});

// Focuses an already-open Roady tab if there is one, instead of always
// opening a new one.
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const targetUrl = (event.notification.data as { url?: string } | undefined)?.url ?? '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.startsWith(self.location.origin));
      if (existing) {
        existing.focus();
        if ('navigate' in existing) return (existing as WindowClient).navigate(targetUrl);
        return undefined;
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
