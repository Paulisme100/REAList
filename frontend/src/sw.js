import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', function (event) {

  console.log('[Service Worker] Push received');
  const data = event.data.json()
  console.log('[Service Worker] Push data:', data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: {url: "http://localhost:4173/#/agency-main"},
      requireInteraction: true 
    }).then(() => console.log('[SW] Notification shown'))
    .catch(err => console.error('[SW] Notification error:', err))
  )

})

self.addEventListener('notificationClick', function (event) {

  console.log("notification clicked!")
  const targetUrl = 'http://localhost:4173';

  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
        console.log('[SW] Matching client:', client.url);
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );

})


