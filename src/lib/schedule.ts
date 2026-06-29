import type { ScheduleItem } from '@/types';

export const DAYS_RANGE = 5;

export function sortByDateTime(items: ScheduleItem[]): ScheduleItem[] {
  return [...items].sort((a, b) => {
    const dc = a.date.localeCompare(b.date);
    return dc !== 0 ? dc : a.time.localeCompare(b.time);
  });
}

/** @deprecated use sortByDateTime */
export function sortScheduleByTime(items: ScheduleItem[]): ScheduleItem[] {
  return sortByDateTime(items);
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function getMinutesUntil(time: string): number {
  return parseTimeToMinutes(time) - getCurrentTimeMinutes();
}

export function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function todayString(): string {
  return toLocalDateString(new Date());
}

export function isDateToday(dateString: string): boolean {
  return dateString === todayString();
}

export function offsetDate(baseDate: string, days: number): string {
  const d = new Date(baseDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

export function getWeddingDateRange(weddingDate: string): string[] {
  return Array.from({ length: DAYS_RANGE * 2 + 1 }, (_, i) =>
    offsetDate(weddingDate, i - DAYS_RANGE)
  );
}

export function getDateLabel(date: string, weddingDate: string): string {
  const d = new Date(date + 'T00:00:00');
  const w = new Date(weddingDate + 'T00:00:00');
  const diff = Math.round((d.getTime() - w.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Wedding Day';
  if (diff === -1) return 'Day Before';
  if (diff === 1) return 'Day After';
  if (diff < 0) return `${Math.abs(diff)} Days Before`;
  return `${diff} Days After`;
}

export function formatDateLong(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatWeddingDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export interface DateGroup {
  date: string;
  label: string;
  isWeddingDay: boolean;
  isToday: boolean;
  items: ScheduleItem[];
}

export function groupScheduleByDate(items: ScheduleItem[], weddingDate: string): DateGroup[] {
  const map = new Map<string, ScheduleItem[]>();
  for (const item of items) {
    const date = item.date ?? weddingDate;
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(item);
  }

  const today = todayString();
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, groupItems]) => ({
      date,
      label: getDateLabel(date, weddingDate),
      isWeddingDay: date === weddingDate,
      isToday: date === today,
      items: sortByDateTime(groupItems),
    }));
}
