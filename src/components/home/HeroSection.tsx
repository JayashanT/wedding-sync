import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'var(--color-navy)' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"
          style={{ backgroundColor: 'var(--color-blush)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 -translate-x-1/3 translate-y-1/3"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Floral corner ornament - top left */}
      <div className="absolute top-8 left-8 opacity-20 select-none pointer-events-none" aria-hidden>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path d="M10 60 Q30 10 60 10 Q30 30 30 60 Q30 90 60 110 Q30 90 10 60Z" fill="#F8BBD9"/>
          <path d="M60 10 Q90 10 110 60 Q90 30 60 30 Q30 30 10 60 Q30 10 60 10Z" fill="#D4AF37" opacity="0.5"/>
          <circle cx="60" cy="60" r="6" fill="#F8BBD9"/>
        </svg>
      </div>
      {/* Floral corner ornament - bottom right */}
      <div className="absolute bottom-8 right-8 opacity-20 select-none pointer-events-none rotate-180" aria-hidden>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path d="M10 60 Q30 10 60 10 Q30 30 30 60 Q30 90 60 110 Q30 90 10 60Z" fill="#F8BBD9"/>
          <path d="M60 10 Q90 10 110 60 Q90 30 60 30 Q30 30 10 60 Q30 10 60 10Z" fill="#D4AF37" opacity="0.5"/>
          <circle cx="60" cy="60" r="6" fill="#F8BBD9"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
        <p
          className="uppercase tracking-widest text-xs font-semibold mb-6"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.3em' }}
        >
          Wedding Invite SL Presents
        </p>

        <h1
          className="font-serif mb-6 leading-tight"
          style={{ color: 'var(--color-ivory)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          Your Perfect Day,
          <br />
          <span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>Perfectly Synced</span>
        </h1>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-20" style={{ backgroundColor: 'var(--color-gold)' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--color-gold)' }} />
          <div className="h-px w-20" style={{ backgroundColor: 'var(--color-gold)' }} />
        </div>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'rgba(255,255,240,0.85)' }}
        >
          Seamlessly coordinate every moment of your wedding day. Keep your entire team
          in sync with real-time schedules and smart 5-minute notifications — no missed moments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary">
            Access Your Wedding
          </Link>
          <a href="#how-it-works" className="btn-outline-ivory">
            Learn More
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#how-it-works"
            className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-gold)' }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,240,0.6)' }}>
              Scroll to explore
            </span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
