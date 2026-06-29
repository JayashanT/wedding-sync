'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export default function PageHeader({ backHref, backLabel }: PageHeaderProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        backgroundColor: 'rgba(255,255,240,0.97)',
        borderBottom: '1px solid rgba(248,187,217,0.4)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 12px rgba(27,42,74,0.06)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
          >
            WS
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-base font-bold" style={{ color: 'var(--color-navy)' }}>
              Wedding Sync
            </span>
            <span className="text-xs" style={{ color: 'rgba(27,42,74,0.45)' }}>
              by Wedding Invite SL
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {backHref && backLabel && (
            <Link
              href={backHref}
              className="text-sm font-medium hover:underline"
              style={{ color: 'rgba(27,42,74,0.55)' }}
            >
              ← {backLabel}
            </Link>
          )}
          {!isLoginPage && (
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-all"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-navy)',
              }}
            >
              Access Wedding
            </Link>
          )}
          {isLoginPage && (
            <Link
              href="/"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-all"
              style={{
                border: '1.5px solid rgba(27,42,74,0.18)',
                color: 'var(--color-navy)',
              }}
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
