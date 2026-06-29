const steps = [
  {
    number: '01',
    title: 'Couple Sets Up',
    description:
      'The couple logs into the admin panel and creates the full wedding day schedule — adding time slots, descriptions, and locations for every event.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Assign Responsibilities',
    description:
      'The couple assigns up to 5 named roles per task — photographer, florist, MC, catering lead and more. Each responsible person gets their own role for the day.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Team Logs In',
    description:
      'On the wedding day, each team member logs in using the wedding access code and selects their role. They instantly see their personalised schedule for the day.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Stay Notified',
    description:
      'Exactly 5 minutes before each task, every responsible team member receives a browser notification — even when the tab is in the background.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6" style={{ backgroundColor: 'var(--color-ivory)' }}>
      <div className="max-w-6xl mx-auto">
        <p
          className="text-center uppercase tracking-widest text-xs font-semibold mb-4"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.25em' }}
        >
          Simple Process
        </p>
        <h2 className="section-title">How Wedding Sync Works</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16" style={{ backgroundColor: 'var(--color-blush)' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--color-blush)' }} />
          <div className="h-px w-16" style={{ backgroundColor: 'var(--color-blush)' }} />
        </div>
        <p className="section-subtitle">
          Four simple steps to make your wedding day run flawlessly — from setup to celebration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="card relative group hover:shadow-xl transition-shadow duration-300">
              <div
                className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-serif"
                style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
              >
                {step.number}
              </div>
              <div
                className="mt-4 mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(248,187,217,0.2)', color: 'var(--color-navy)' }}
              >
                {step.icon}
              </div>
              <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--color-navy)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(27,42,74,0.7)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
