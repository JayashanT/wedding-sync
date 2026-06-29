'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 240, 0.97)' : 'transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(27,42,74,0.08)' : 'none',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
          >
            WS
          </div>
          <span
            className="font-serif text-lg font-bold transition-colors"
            style={{ color: scrolled ? 'var(--color-navy)' : 'var(--color-ivory)' }}
          >
            Wedding Sync
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '#how-it-works', label: 'How It Works' },
            { href: '#features', label: 'Features' },
            { href: '#contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: scrolled ? 'var(--color-navy)' : 'rgba(255,255,240,0.9)' }}
            >
              {label}
            </a>
          ))}
          <Link
            href="/login"
            className="text-sm font-semibold px-5 py-2 rounded-full transition-all"
            style={{
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-navy)',
            }}
          >
            Access Wedding
          </Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: scrolled ? 'var(--color-navy)' : 'var(--color-ivory)' }}
        >
          {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden" style={{ backgroundColor: 'var(--color-ivory)', borderTop: '1px solid var(--color-blush)' }}>
          <div className="px-6 py-4 flex flex-col gap-4">
            {[
              { href: '#how-it-works', label: 'How It Works' },
              { href: '#features', label: 'Features' },
              { href: '#contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-semibold"
                style={{ color: 'var(--color-navy)' }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link href="/login" className="btn-primary text-center text-sm" onClick={() => setMenuOpen(false)}>
              Access Wedding
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
