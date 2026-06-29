'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthSession } from '@/types';
import { getSession, setSession, clearSession } from '@/lib/auth';

interface AuthContextValue {
  session: AuthSession;
  setSessionState: (session: AuthSession) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  setSessionState: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionLocal] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSessionLocal(getSession());
    setIsLoading(false);
  }, []);

  function setSessionState(s: AuthSession) {
    setSession(s);
    setSessionLocal(s);
  }

  function logout() {
    clearSession();
    setSessionLocal(null);
  }

  return (
    <AuthContext.Provider value={{ session, setSessionState, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
