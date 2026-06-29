import type { WeddingData, ScheduleItem } from '@/types';

export async function loginWithAccessCode(
  weddingId: string,
  accessCode: string
): Promise<{ weddingDate: string; brideName: string; groomName: string } | null> {
  const res = await fetch('/api/weddings/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weddingId, accessCode }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function loginAsCouple(
  weddingId: string,
  username: string,
  password: string
): Promise<boolean> {
  const res = await fetch(`/api/weddings/${weddingId}/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.ok;
}

export async function fetchWeddingData(weddingId: string): Promise<WeddingData | null> {
  const res = await fetch(`/api/weddings/${weddingId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function updateRoles(weddingId: string, roles: string[]): Promise<boolean> {
  const res = await fetch(`/api/weddings/${weddingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roles }),
  });
  return res.ok;
}

export async function createScheduleItem(
  weddingId: string,
  item: Omit<ScheduleItem, 'id'>
): Promise<ScheduleItem | null> {
  const res = await fetch(`/api/weddings/${weddingId}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function updateScheduleItem(
  weddingId: string,
  itemId: string,
  item: Partial<ScheduleItem>
): Promise<ScheduleItem | null> {
  const res = await fetch(`/api/weddings/${weddingId}/schedule/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function deleteScheduleItem(weddingId: string, itemId: string): Promise<boolean> {
  const res = await fetch(`/api/weddings/${weddingId}/schedule/${itemId}`, {
    method: 'DELETE',
  });
  return res.ok;
}
