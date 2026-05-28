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
    <section
      className="
        rounded-[2rem] self-start
        border border-zinc-200
        bg-white/90 p-6 shadow-sm
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-white/[0.03]
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="
              text-2xl font-bold
              text-zinc-900
              dark:text-white
            "
          >
            Quick Actions
          </h2>

          <p
            className="
              mt-1 text-sm
              text-zinc-500
              dark:text-white/50
            "
          >
            Jump into important tasks faster
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="
              group relative flex items-center justify-between overflow-hidden
              rounded-[1.5rem]
              border border-zinc-200
              bg-zinc-50/80 p-5
              transition-all duration-300
              hover:-translate-y-1
              hover:border-cyan-300
              hover:bg-cyan-50
              dark:border-white/10
              dark:bg-white/[0.04]
              dark:hover:border-cyan-400/30
              dark:hover:bg-white/[0.06]
            "
          >
            {/* glow */}
            <div
              className="
                pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300
                group-hover:opacity-100
                bg-gradient-to-r from-cyan-500/5 to-purple-500/5
              "
            />

            <span
              className="
                relative z-10
                text-sm font-semibold uppercase tracking-[0.18em]
                text-zinc-700
                dark:text-white/75
              "
            >
              {action.label}
            </span>

            <span
              className="
                relative z-10
                text-zinc-500 transition-transform duration-300
                group-hover:translate-x-1
                dark:text-white/60
              "
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;