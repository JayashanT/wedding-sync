const pendingNotifications = new Map();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'SCHEDULE_NOTIFICATIONS') return;

  const { weddingId, role, schedule, weddingDate } = event.data;

  pendingNotifications.forEach(id => clearTimeout(id));
  pendingNotifications.clear();

  if (!schedule || !Array.isArray(schedule)) return;

  const now = Date.now();
  const todayStr = new Date().toISOString().slice(0, 10);

  schedule
    .filter(item =>
      Array.isArray(item.responsiblePersons) &&
      item.responsiblePersons.includes(role) &&
      (item.date ?? weddingDate) === todayStr
    )
    .forEach(item => {
      if (!item.time) return;

      const itemDate = item.date ?? weddingDate;
      if (!itemDate) return;

      const [h, m] = item.time.split(':').map(Number);
      const taskDate = new Date(itemDate + 'T00:00:00');
      taskDate.setHours(h, m - 5, 0, 0);
      const delay = taskDate.getTime() - now;

      if (delay > 0 && delay < 48 * 60 * 60 * 1000) {
        const timeoutId = setTimeout(() => {
          self.registration.showNotification(`⏰ Upcoming: ${item.title}`, {
            body: `In 5 minutes — ${item.location}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `${weddingId}__${item.id}`,
            requireInteraction: true,
            data: { weddingId, itemId: item.id, url: `/${weddingId}/dashboard` },
          });
          pendingNotifications.delete(item.id);
        }, delay);

        pendingNotifications.set(item.id, timeoutId);
      }
    });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
