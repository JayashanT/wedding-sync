import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-navy)', color: 'rgba(255,255,240,0.8)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
              >
                WS
              </div>
              <span className="font-serif text-lg font-bold" style={{ color: 'var(--color-ivory)' }}>
                Wedding Sync
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Day-of coordination made simple. Keep your wedding team perfectly in sync.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-gold)' }}>Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#how-it-works" className="hover:opacity-100 transition-opacity">How It Works</a></li>
              <li><a href="#features" className="hover:opacity-100 transition-opacity">Features</a></li>
              <li><Link href="/login" className="hover:opacity-100 transition-opacity">Wedding Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-gold)' }}>Part of</h3>
            <p className="text-sm opacity-80">
              <span className="font-semibold" style={{ color: 'var(--color-ivory)' }}>Wedding Invite SL</span>
              <br />
              Sri Lanka&apos;s premier wedding services platform.
            </p>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm opacity-60" style={{ borderColor: 'rgba(255,255,240,0.1)' }}>
          <span>© {new Date().getFullYear()} Wedding Sync by Wedding Invite SL. All rights reserved.</span>
          <Link
            href="/superadmin/login"
            className="text-xs hover:opacity-80 transition-opacity"
            style={{ color: 'rgba(255,255,240,0.35)' }}
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
