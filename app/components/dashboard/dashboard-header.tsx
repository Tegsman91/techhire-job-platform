'use client';

import { useApplicationsStore, useResumeStore } from '@/lib/store';

const DashboardHeader = () => {
  const applications = useApplicationsStore(
    (state) => state.applications || []
  );

  const resume = useResumeStore(
    (state) => state.resume
  );

  return (
    <section
      className="
        relative overflow-hidden
        rounded-[2.5rem]
        border border-zinc-200
        bg-gradient-to-br from-white via-cyan-50/40
        to-purple-50/30 px-8 py-10 sm:px-10 sm:py-12
        shadow-[0_10px_40px_rgba(15,23,42,0.06)]
        backdrop-blur-2xl dark:border-white/10
        dark:from-white/[0.05]
        dark:via-cyan-500/[0.04]
        dark:to-purple-500/[0.04]
        dark:bg-white/[0.04]
      "
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />

      <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/10" />

      <div className="relative z-10">
        <div
          className="
            inline-flex items-center gap-2
            rounded-full
            border border-cyan-200
            bg-cyan-50
            px-4 py-1.5
            text-xs font-semibold
            uppercase tracking-[0.18em]
            text-cyan-700
            dark:border-cyan-500/20
            dark:bg-cyan-500/10
            dark:text-cyan-300
          "
        >
          Candidate Dashboard
        </div>

        <h1
          className="
            mt-5 text-4xl font-black tracking-tight
            text-zinc-900 lg:text-5xl dark:text-white
          "
        >
          Hi, {resume.personal.name || 'Candidate'}
        </h1>

        <p
          className="
            mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-white/60
          "
        >
          You currently have{' '}
          <span
            className="
              font-semibold
              text-cyan-700
              dark:text-cyan-300
            "
          >
            {applications.length} active applications
          </span>{' '}
          across multiple companies.
        </p>
      </div>
    </section>
  );
};

export default DashboardHeader;