'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/layout/PageHeader';
import { setPendingLogin } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [weddingId, setWeddingId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!weddingId.trim() || !accessCode.trim()) {
      setError('Please enter both fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/weddings/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId: weddingId.trim().toLowerCase(), accessCode: accessCode.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Invalid wedding ID or access code.');
        return;
      }
      const data = await res.json();
      setPendingLogin({ weddingId: data.weddingId, weddingDate: data.weddingDate });
      router.push(`/${data.weddingId}/role`);
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
      <PageHeader />
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: 'var(--color-blush)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 -translate-x-1/2 translate-y-1/2"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2" style={{ color: 'var(--color-navy)' }}>
            Wedding Access
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-blush)' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'var(--color-gold)' }} />
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-blush)' }} />
          </div>
          <p className="text-sm" style={{ color: 'rgba(27,42,74,0.6)' }}>
            Enter your wedding details to access the schedule
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Wedding ID"
              value={weddingId}
              onChange={e => setWeddingId(e.target.value)}
              placeholder="e.g. wedding-001"
              autoComplete="off"
            />
            <Input
              label="Access Code"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              placeholder="Enter your access code"
              type="text"
              autoComplete="off"
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
              Access Wedding
            </Button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(248,187,217,0.4)' }}>
            <p className="text-xs" style={{ color: 'rgba(27,42,74,0.5)' }}>
              Are you the couple?{' '}
              <span className="opacity-60">Enter your wedding ID above, then access admin from the role screen.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
