'use client';

import Link from 'next/link';

const actions = [
  {
    label: 'Complete Your Profile',
    href: '/dashboard/profile',
  },
  {
    label: 'Build Resume',
    href: '/dashboard/resume',
  },
  {
    label: 'Browse Jobs',
    href: '/jobs',
  },
];

const QuickActions = () => {
  return (
    <section className="rounded-[2rem] self-start border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-6 space-y-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="
              group relative flex items-center justify-between overflow-hidden
              rounded-[2rem] 
              border border-white/10
              bg-white/[0.04]
              p-5
              transition-all duration-500
              hover:-translate-y-1
              hover:border-cyan-400/30
            "
          >
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
              {action.label}
            </span>

            <span>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;