import type { AuthSession, ResponsiblePersonSession, CoupleSession, PendingWeddingLogin } from '@/types';

const SESSION_KEY = 'weddingday_session';
const PENDING_LOGIN_KEY = 'weddingday_pending_login';

export function getSession(): AuthSession {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PENDING_LOGIN_KEY);
}

export function loginAsResponsible(weddingId: string, role: string, weddingDate: string): void {
  const session: ResponsiblePersonSession = { type: 'responsible', weddingId, role, weddingDate };
  setSession(session);
  clearPendingLogin();
}

export function loginAsCouple(weddingId: string, coupleUsername: string): void {
  const session: CoupleSession = { type: 'couple', weddingId, coupleUsername };
  setSession(session);
}

export function getPendingLogin(): PendingWeddingLogin | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PENDING_LOGIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPendingLogin(data: PendingWeddingLogin): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PENDING_LOGIN_KEY, JSON.stringify(data));
}

export function clearPendingLogin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PENDING_LOGIN_KEY);
}

export function isResponsibleSession(session: AuthSession, weddingId: string): session is ResponsiblePersonSession {
  return session !== null && session.type === 'responsible' && session.weddingId === weddingId;
}

export function isCoupleSession(session: AuthSession, weddingId: string): session is CoupleSession {
  return session !== null && session.type === 'couple' && session.weddingId === weddingId;
}
