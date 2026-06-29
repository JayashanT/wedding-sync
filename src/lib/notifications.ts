import type { ScheduleItem, SentNotifications, NotificationAlert } from '@/types';
import { getMinutesUntil, todayString } from './schedule';

const NOTIFICATION_STORAGE_KEY = 'weddingday_sent_notifications';
const CHECK_INTERVAL_MS = 30_000;
const NOTIFY_WINDOW_MINUTES = 5;

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return await Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;
  return Notification.permission;
}

function getSentNotifications(): SentNotifications {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function markNotificationSent(weddingId: string, itemId: string): void {
  const key = `${weddingId}__${itemId}`;
  const sent = getSentNotifications();
  sent[key] = true;
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(sent));
}

function isNotificationSent(weddingId: string, itemId: string): boolean {
  return getSentNotifications()[`${weddingId}__${itemId}`] === true;
}

function fireNotification(item: ScheduleItem, minutesUntil: number): void {
  if (Notification.permission !== 'granted') return;
  const body = minutesUntil <= 0
    ? `Starting now — ${item.location}`
    : `In ${minutesUntil} minute${minutesUntil === 1 ? '' : 's'} — ${item.location}`;
  new Notification(`⏰ Upcoming: ${item.title}`, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `wedding-task-${item.id}`,
    requireInteraction: true,
  });
}

export function startNotificationInterval(
  weddingId: string,
  role: string,
  schedule: ScheduleItem[],
  weddingDate: string,
  onAlert: (alert: NotificationAlert) => void
): () => void {
  const check = () => {
    if (typeof window === 'undefined' || Notification.permission !== 'granted') return;
    const today = todayString();

    const relevantItems = schedule.filter(item =>
      item.responsiblePersons.includes(role) &&
      (item.date ?? weddingDate) === today
    );

    for (const item of relevantItems) {
      if (isNotificationSent(weddingId, item.id)) continue;
      const minutesUntil = getMinutesUntil(item.time);
      if (minutesUntil >= 0 && minutesUntil <= NOTIFY_WINDOW_MINUTES) {
        fireNotification(item, minutesUntil);
        markNotificationSent(weddingId, item.id);
        onAlert({ itemId: item.id, title: item.title, time: item.time, location: item.location, minutesUntil });
      }
    }
  };

  check();
  const intervalId = setInterval(check, CHECK_INTERVAL_MS);
  return () => clearInterval(intervalId);
}

export function sendScheduleToServiceWorker(
  weddingId: string,
  role: string,
  schedule: ScheduleItem[],
  weddingDate: string
): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(registration => {
    if (registration.active) {
      registration.active.postMessage({
        type: 'SCHEDULE_NOTIFICATIONS',
        weddingId,
        role,
        weddingDate,
        schedule,
      });
    }
  });
}
