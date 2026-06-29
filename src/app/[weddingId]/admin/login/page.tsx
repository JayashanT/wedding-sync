'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/layout/PageHeader';
import { loginAsCouple as loginAsCoupleLocal } from '@/lib/auth';
import { loginAsCouple as loginAsCoupleApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = use(params);
  const router = useRouter();
  const { setSessionState } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const ok = await loginAsCoupleApi(weddingId, username.trim(), password);
      if (!ok) {
        setError('Invalid username or password.');
        return;
      }
      loginAsCoupleLocal(weddingId, username.trim());
      setSessionState({ type: 'couple', weddingId, coupleUsername: username.trim() });
      router.push(`/${weddingId}/admin`);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 pt-28"
      style={{ backgroundColor: 'var(--color-ivory)' }}
    >
      <PageHeader backHref={`/${weddingId}/role`} backLabel="Role Selection" />
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: 'var(--color-navy)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2" style={{ color: 'var(--color-navy)' }}>
            Couple Admin Login
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-blush)' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'var(--color-gold)' }} />
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-blush)' }} />
          </div>
          <p className="text-sm" style={{ color: 'rgba(27,42,74,0.6)' }}>
            Access the admin panel to manage your wedding schedule
          </p>
          <div
            className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs"
            style={{ backgroundColor: 'rgba(27,42,74,0.08)', color: 'rgba(27,42,74,0.6)' }}
          >
            Wedding: <span className="ml-1 font-semibold">{weddingId}</span>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Your couple username"
              autoComplete="username"
            />
            <Input
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your couple password"
              type="password"
              autoComplete="current-password"
            />

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
              >
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Login to Admin Panel
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
