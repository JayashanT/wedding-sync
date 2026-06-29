'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/layout/PageHeader';
import { getPendingLogin, loginAsResponsible } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { fetchWeddingData } from '@/lib/api';
import type { WeddingData } from '@/types';

export default function RolePage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = use(params);
  const router = useRouter();
  const { setSessionState } = useAuth();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pendingWeddingDate, setPendingWeddingDate] = useState('');

  useEffect(() => {
    const pending = getPendingLogin();
    if (!pending || pending.weddingId !== weddingId) {
      router.replace('/login');
      return;
    }
    setPendingWeddingDate(pending.weddingDate);
    fetchWeddingData(weddingId).then(data => {
      if (!data) { router.replace('/login'); return; }
      setWeddingData(data);
      setPageLoading(false);
    });
  }, [weddingId, router]);

  function handleContinue() {
    if (!selectedRole) { setError('Please select your role.'); return; }
    setLoading(true);
    loginAsResponsible(weddingId, selectedRole, pendingWeddingDate);
    setSessionState({ type: 'responsible', weddingId, role: selectedRole, weddingDate: pendingWeddingDate });
    router.push(`/${weddingId}/dashboard`);
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'rgba(27,42,74,0.6)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 pt-28"
      style={{ backgroundColor: 'var(--color-ivory)' }}
    >
      <PageHeader backHref="/login" backLabel="Change Wedding" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2" style={{ color: 'var(--color-navy)' }}>
            Select Your Role
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-blush)' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'var(--color-gold)' }} />
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-blush)' }} />
          </div>
          <p className="text-sm" style={{ color: 'rgba(27,42,74,0.6)' }}>
            What is your role for this wedding?
          </p>
        </div>

        <div className="card">
          <div className="space-y-2 mb-6">
            {weddingData?.roles.map(role => (
              <button
                key={role}
                onClick={() => { setSelectedRole(role); setError(''); }}
                className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium"
                style={{
                  borderColor: selectedRole === role ? 'var(--color-gold)' : 'rgba(248,187,217,0.4)',
                  backgroundColor: selectedRole === role ? 'rgba(212,175,55,0.1)' : 'white',
                  color: 'var(--color-navy)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: selectedRole === role ? 'var(--color-gold)' : 'rgba(27,42,74,0.2)',
                    }}
                  >
                    {selectedRole === role && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-gold)' }} />
                    )}
                  </div>
                  {role}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          <Button onClick={handleContinue} loading={loading} className="w-full">
            Continue to Schedule
          </Button>

          <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid rgba(248,187,217,0.4)' }}>
            <Link
              href={`/${weddingId}/admin/login`}
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--color-gold)' }}
            >
              I&apos;m the couple → Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
