const features = [
  {
    title: 'Smart Notifications',
    description: 'Receive browser push notifications 5 minutes before each task — works even when the tab is in the background.',
    icon: '🔔',
  },
  {
    title: 'Role-Based Access',
    description: 'Each team member sees only their assigned tasks by default, with an option to view the full schedule.',
    icon: '👥',
  },
  {
    title: 'Beautiful Timeline',
    description: 'A clean, elegant timeline view of the entire wedding day schedule — at a glance.',
    icon: '📋',
  },
  {
    title: 'Easy Admin Panel',
    description: 'The couple manages everything — add tasks, assign roles, set times — all through a simple interface.',
    icon: '⚙️',
  },
  {
    title: 'Secure Access Codes',
    description: 'Each wedding has its own access code. Only invited team members can log in to view the schedule.',
    icon: '🔐',
  },
  {
    title: 'Up to 5 Responsible Persons',
    description: 'Assign up to five different roles per task — ensuring every part of your day has the right people in place.',
    icon: '✨',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6" style={{ backgroundColor: 'white' }}>
      <div className="max-w-6xl mx-auto">
        <p
          className="text-center uppercase tracking-widest text-xs font-semibold mb-4"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.25em' }}
        >
          Everything You Need
        </p>
        <h2 className="section-title">Built for Your Wedding Day</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16" style={{ backgroundColor: 'var(--color-blush)' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--color-blush)' }} />
          <div className="h-px w-16" style={{ backgroundColor: 'var(--color-blush)' }} />
        </div>
        <p className="section-subtitle">
          Every feature is designed to take the stress out of wedding day coordination.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--color-navy)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(27,42,74,0.7)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
