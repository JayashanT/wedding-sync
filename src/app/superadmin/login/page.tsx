'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/superadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Invalid credentials.');
        return;
      }
      localStorage.setItem('weddingday_superadmin', JSON.stringify({ type: 'superadmin' }));
      router.push('/superadmin');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'var(--color-navy)' }}
    >
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 -translate-x-1/2 translate-y-1/2"
          style={{ backgroundColor: 'var(--color-blush)' }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
          >
            WS
          </div>
          <h1 className="font-serif text-2xl mb-1" style={{ color: 'var(--color-ivory)' }}>
            Admin Portal
          </h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,240,0.45)' }}>
            Wedding Sync — Super Admin
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'rgba(255,255,240,0.06)', border: '1px solid rgba(255,255,240,0.1)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,240,0.6)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,240,0.08)',
                  border: '1px solid rgba(255,255,240,0.15)',
                  color: 'var(--color-ivory)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,240,0.6)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,240,0.08)',
                  border: '1px solid rgba(255,255,240,0.15)',
                  color: 'var(--color-ivory)',
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-2.5 text-sm"
                style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.3)' }}
              >
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(255,255,240,0.25)' }}>
          <Link href="/" className="hover:opacity-60 transition-opacity">← Back to Wedding Sync</Link>
        </p>
      </div>
    </div>
  );
}
