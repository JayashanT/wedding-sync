'use client';

import { useState } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { NotificationAlert } from '@/types';
import { formatTime12h } from '@/lib/schedule';

interface NotificationBannerProps {
  alerts: NotificationAlert[];
  onDismiss: (itemId: string) => void;
}

export default function NotificationBanner({ alerts, onDismiss }: NotificationBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
      {alerts.map(alert => (
        <div
          key={alert.itemId}
          className="pointer-events-auto mx-auto max-w-lg rounded-xl shadow-2xl border-2 p-4 flex items-start gap-3"
          style={{
            backgroundColor: 'var(--color-ivory)',
            borderColor: 'var(--color-gold)',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-gold)' }}
          >
            <BellIcon className="w-5 h-5" style={{ color: 'var(--color-navy)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-navy)' }}>
              {alert.minutesUntil <= 0 ? 'Starting now!' : `In ${alert.minutesUntil} minute${alert.minutesUntil === 1 ? '' : 's'}`}
            </p>
            <p className="font-bold" style={{ color: 'var(--color-navy)' }}>{alert.title}</p>
            <p className="text-sm opacity-70" style={{ color: 'var(--color-navy)' }}>
              {formatTime12h(alert.time)} · {alert.location}
            </p>
          </div>
          <button
            onClick={() => onDismiss(alert.itemId)}
            className="flex-shrink-0 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-navy)' }}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
