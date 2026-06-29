'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BellIcon, BellSlashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import ScheduleTimeline from '@/components/schedule/ScheduleTimeline';
import NotificationBanner from '@/components/ui/NotificationBanner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { isResponsibleSession } from '@/lib/auth';
import { fetchWeddingData } from '@/lib/api';
import {
  requestNotificationPermission,
  getNotificationPermission,
  startNotificationInterval,
  sendScheduleToServiceWorker,
} from '@/lib/notifications';
import { formatWeddingDate } from '@/lib/schedule';
import type { WeddingData, NotificationAlert, ScheduleItem } from '@/types';

export default function DashboardPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = use(params);
  const router = useRouter();
  const { session, logout, isLoading } = useAuth();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (isLoading) return;
    if (!isResponsibleSession(session, weddingId)) {
      router.replace('/login');
    }
  }, [session, isLoading, weddingId, router]);

  // Load wedding data
  useEffect(() => {
    fetchWeddingData(weddingId).then(data => {
      setWeddingData(data);
      setDataLoading(false);
    });
  }, [weddingId]);

  // Notification setup
  useEffect(() => {
    setNotifPermission(getNotificationPermission());
  }, []);

  useEffect(() => {
    if (!weddingData || !session || !isResponsibleSession(session, weddingId)) return;
    if (notifPermission !== 'granted') return;

    const schedule: ScheduleItem[] = weddingData.schedule;
    const wDate = weddingData.weddingDate;
    sendScheduleToServiceWorker(weddingId, session.role, schedule, wDate);
    const cleanup = startNotificationInterval(
      weddingId,
      session.role,
      schedule,
      wDate,
      alert => setAlerts(prev => [...prev, alert])
    );
    return cleanup;
  }, [weddingData, session, weddingId, notifPermission]);

  async function handleEnableNotifications() {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'rgba(27,42,74,0.6)' }}>Loading schedule…</p>
        </div>
      </div>
    );
  }

  if (!session || !isResponsibleSession(session, weddingId)) return null;

  const mySchedule = weddingData?.schedule.filter(item =>
    item.responsiblePersons.includes(session.role)
  ) ?? [];

  const displaySchedule = showAll ? (weddingData?.schedule ?? []) : mySchedule;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: 'rgba(255,255,240,0.95)',
          borderColor: 'rgba(248,187,217,0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
            >
              WS
            </div>
            <span className="font-serif text-base hidden sm:block" style={{ color: 'var(--color-navy)' }}>
              Wedding Sync
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant="gold">{session.role}</Badge>

            {notifPermission !== 'granted' && (
              <button
                onClick={handleEnableNotifications}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  backgroundColor: 'rgba(212,175,55,0.15)',
                  color: 'var(--color-navy)',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
                title="Enable notifications"
              >
                <BellSlashIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Enable Alerts</span>
              </button>
            )}
            {notifPermission === 'granted' && (
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'rgba(34,197,94,0.1)',
                  color: '#16a34a',
                  border: '1px solid rgba(34,197,94,0.3)',
                }}
                title="Notifications active"
              >
                <BellIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts On</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-blush/20 transition-colors"
              style={{ color: 'rgba(27,42,74,0.6)' }}
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Wedding info */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-gold)', letterSpacing: '0.2em' }}>
            Wedding Schedule
          </p>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-navy)' }}>
            {weddingData ? `${weddingData.weddingId.replace('wedding-', 'Wedding #').replace('-', '')}` : 'Your Wedding'}
          </h1>
          {session.weddingDate && (
            <p className="text-sm" style={{ color: 'rgba(27,42,74,0.6)' }}>
              {formatWeddingDate(session.weddingDate)}
            </p>
          )}
        </div>

        {/* Schedule toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowAll(false)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: !showAll ? 'var(--color-gold)' : 'transparent',
              color: !showAll ? 'var(--color-navy)' : 'rgba(27,42,74,0.6)',
              border: '2px solid',
              borderColor: !showAll ? 'var(--color-gold)' : 'rgba(27,42,74,0.2)',
            }}
          >
            My Tasks ({mySchedule.length})
          </button>
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: showAll ? 'var(--color-navy)' : 'transparent',
              color: showAll ? 'var(--color-ivory)' : 'rgba(27,42,74,0.6)',
              border: '2px solid',
              borderColor: showAll ? 'var(--color-navy)' : 'rgba(27,42,74,0.2)',
            }}
          >
            Full Schedule ({weddingData?.schedule.length ?? 0})
          </button>
        </div>

        {/* Notification prompt banner */}
        {notifPermission === 'default' && (
          <div
            className="rounded-xl p-4 mb-6 flex items-center gap-4"
            style={{
              backgroundColor: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
          >
            <BellIcon className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--color-gold)' }} />
            <div className="flex-1">
              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-navy)' }}>
                Enable task notifications
              </p>
              <p className="text-xs" style={{ color: 'rgba(27,42,74,0.6)' }}>
                You&apos;ll be notified 5 minutes before each of your tasks.
              </p>
            </div>
            <Button onClick={handleEnableNotifications} size="sm">Enable</Button>
          </div>
        )}

        {/* Schedule */}
        <ScheduleTimeline
          schedule={displaySchedule}
          weddingDate={weddingData?.weddingDate ?? session.weddingDate}
          userRole={session.role}
          showAll={showAll}
        />
      </div>

      {/* Notification banner */}
      <NotificationBanner
        alerts={alerts}
        onDismiss={itemId => setAlerts(prev => prev.filter(a => a.itemId !== itemId))}
      />
    </div>
  );
}
