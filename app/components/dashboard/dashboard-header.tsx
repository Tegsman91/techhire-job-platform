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
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] px-8 py-10 sm:px-10 sm:py-12 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

      <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
        Hi, {resume.personal.name || 'Candidate'}
      </h1>

      <p className="mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
        You currently have{' '}
        <span className="font-semibold text-cyan-300">
          {applications.length} active applications
        </span>{' '}
        across multiple companies.
      </p>
    </section>
  );
};

export default DashboardHeader;