'use client';

import { useState, useEffect } from 'react';
import { getMinutesUntil } from '@/lib/schedule';

interface CountdownBadgeProps {
  time: string;
}

export default function CountdownBadge({ time }: CountdownBadgeProps) {
  const [mins, setMins] = useState(() => getMinutesUntil(time));

  useEffect(() => {
    const id = setInterval(() => setMins(getMinutesUntil(time)), 60_000);
    return () => clearInterval(id);
  }, [time]);

  if (mins < 0) {
    return (
      <span
        className="badge text-xs"
        style={{ backgroundColor: 'rgba(27,42,74,0.08)', color: 'rgba(27,42,74,0.5)', border: '1px solid rgba(27,42,74,0.1)' }}
      >
        Done
      </span>
    );
  }
  if (mins === 0) {
    return (
      <span
        className="badge text-xs animate-pulse"
        style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}
      >
        Now!
      </span>
    );
  }
  if (mins <= 5) {
    return (
      <span
        className="badge text-xs"
        style={{ backgroundColor: 'rgba(234,88,12,0.1)', color: '#ea580c', border: '1px solid rgba(234,88,12,0.3)' }}
      >
        {mins}m
      </span>
    );
  }
  if (mins <= 60) {
    return (
      <span
        className="badge text-xs"
        style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#b8960f', border: '1px solid rgba(212,175,55,0.3)' }}
      >
        {mins}m
      </span>
    );
  }
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return (
    <span className="badge badge-navy text-xs">
      {hours}h {remainMins > 0 ? `${remainMins}m` : ''}
    </span>
  );
}
