'use client';

import {
  Briefcase,
  Calendar,
  Bookmark,
  Eye,
} from 'lucide-react';

import { useApplicationsStore } from '@/lib/store';

const StatsCards = () => {
  const applications = useApplicationsStore(
    (state) => state.applications || []
  );

  const stats = [
    {
      title: 'Applications Sent',
      value: applications.length,
      icon: Briefcase,
    },
    {
      title: 'Interviews Scheduled',
      value: applications.filter(
        (a) => a.status === 'Interview'
      ).length,
      icon: Calendar,
    },
    {
      title: 'Saved Jobs',
      value: 12,
      icon: Bookmark,
    },
    {
      title: 'Profile Views',
      value: 48,
      icon: Eye,
    },
  ];

  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              group relative overflow-hidden rounded-[2rem]
              border border-zinc-200 bg-white/90
              p-5 shadow-sm transition-all duration-500
              hover:-translate-y-1 hover:border-cyan-300
              hover:shadow-lg dark:border-white/10
              dark:bg-white/[0.04] dark:backdrop-blur-xl
              dark:hover:border-cyan-400/30
            "
          >
            <div
              className="
                absolute inset-0 opacity-0 transition-opacity duration-500
                group-hover:opacity-100 bg-gradient-to-br
                from-cyan-500/5 to-purple-500/5
                dark:from-cyan-500/10 dark:to-purple-500/10
              "
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <p
                  className="
                    text-lg md:text-xs font-bold uppercase tracking-[0.2em]
                    text-zinc-500 dark:text-white/45
                  "
                >
                  {stat.title}
                </p>

                <div
                  className="
                    rounded-xl border border-zinc-200
                    bg-zinc-50  p-2.5 text-zinc-600
                    dark:border-white/10 dark:bg-white/[0.03]
                    dark:text-white/60
                  "
                >
                  <Icon size={20} />
                </div>
              </div>

              <h2
                className="
                  mt-8 text-5xl font-black tracking-tight
                  text-zinc-900 dark:text-white
                "
              >
                {stat.value}
              </h2>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatsCards;