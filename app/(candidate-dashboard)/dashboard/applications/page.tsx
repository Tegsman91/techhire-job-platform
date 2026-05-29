'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Clock3,
  Handshake,
  Trash2,
} from 'lucide-react';

import Button from '@/app/components/ui/Button';
import {
  ApplicationItem,
  useApplicationsStore,
} from '@/lib/store';

import clsx from 'clsx';
import CustomSelect from '@/app/components/ui/Select';

type Accent =
  | 'cyan'
  | 'yellow'
  | 'purple'
  | 'green';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: Accent;
};

const statusFlow = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
];

const tabs = [
  'All',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Rejected',
];

const tabStyles: Record<
  string,
  string
> = {
  All: `
    border-zinc-200 bg-zinc-100 text-zinc-700
    dark:border-white/10 dark:bg-white/5 dark:text-white
  `,
  Applied: `
    border-cyan-500/30 bg-cyan-500/10 text-cyan-600
    dark:text-cyan-400
  `,
  Screening: `
    border-blue-500/30 bg-blue-500/10 text-blue-600
    dark:text-blue-400
  `,
  Interview: `
    border-purple-500/30 bg-purple-500/10 text-purple-600
    dark:text-purple-400
  `,
  Offer: `
    border-emerald-500/30 bg-emerald-500/10 text-emerald-600
    dark:text-emerald-400
  `,
  Rejected: `
    border-red-500/30 bg-red-500/10 text-red-600
    dark:text-red-400
  `,
};

const ApplicationDashboardPage = () => {
  const [hydrated, setHydrated] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const applications =
    useApplicationsStore(
      (state) =>
        state.applications
    );

  const withdrawApplication =
    useApplicationsStore(
      (state) =>
        state.withdrawApplication
    );

  const [activeTab, setActiveTab] =
    useState('All');

  const [sortBy, setSortBy] =
    useState('Most Recent');

  const filteredApplications =
    useMemo(() => {
      let data = [...applications];

      if (activeTab !== 'All') {
        data = data.filter(
          (app) =>
            app.status === activeTab
        );
      }

      if (sortBy === 'Oldest') {
        data.sort(
          (a, b) =>
            new Date(
              a.appliedAt
            ).getTime() -
            new Date(
              b.appliedAt
            ).getTime()
        );
      } else if (
        sortBy === 'Status'
      ) {
        data.sort((a, b) =>
          a.status.localeCompare(
            b.status
          )
        );
      } else {
        data.sort(
          (a, b) =>
            new Date(
              b.appliedAt
            ).getTime() -
            new Date(
              a.appliedAt
            ).getTime()
        );
      }

      return data;
    }, [
      applications,
      activeTab,
      sortBy,
    ]);

  const stats = {
    total: applications.length,

    pending:
      applications.filter((a) =>
        [
          'Applied',
          'Screening',
        ].includes(a.status)
      ).length,

    interviews:
      applications.filter(
        (a) =>
          a.status === 'Interview'
      ).length,

    offers:
      applications.filter(
        (a) =>
          a.status === 'Offer'
      ).length,
  };

  useEffect(() => {
    const hydrate =
      async () => {
        try {
          await Promise.all([
            useApplicationsStore.persist.rehydrate(),
          ]);
        } catch (err) {
          console.error(
            'Error rehydrating applications store:',
            err
          );

          setError(
            'Failed to load applications. Please refresh the page.'
          );
        } finally {
          setHydrated(true);
        }
      };

    hydrate();
  }, []);

  if (!hydrated)
    return (
      <div
        className="
          min-h-screen
          bg-zinc-50 text-zinc-900
          dark:bg-[#0A0A0F] dark:text-white
          px-3 py-6 sm:px-6 sm:py-8
          flex items-center justify-center
        "
      >
        <p className="text-zinc-600 dark:text-white/70">
          Loading applications...
        </p>
      </div>
    );

  if (error)
    return (
      <div
        className="
          min-h-screen
          bg-zinc-50 text-zinc-900
          dark:bg-[#0A0A0F] dark:text-white
          px-3 py-6 sm:px-6 sm:py-8
          flex items-center justify-center
        "
      >
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );

  return (
    <div
      className="
        min-h-screen
        bg-zinc-50 text-zinc-900
        dark:bg-[#0A0A0F] dark:text-white
        px-3 py-6 sm:px-6 sm:py-8
      "
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden dark:block hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_40%)]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* HERO */}
        <section
          className="
            relative overflow-hidden
            rounded-[2.5rem]
            border border-zinc-200/70
            bg-gradient-to-br
            from-white
            via-slate-50
            to-cyan-50/50
            p-6 sm:p-8 lg:p-8
            shadow-[0_10px_50px_rgba(15,23,42,0.06)]
            backdrop-blur-2xl
            dark:border-white/10
            dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
            dark:from-transparent
            dark:via-transparent
            dark:to-transparent
          "
        >
          {/* LIGHT MODE GLOW */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_35%)]
              dark:hidden
            "
          />

          {/* DARK MODE GLOW */}
          <div
            className="
              pointer-events-none absolute inset-0 hidden dark:block
              bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_35%)]
            "
          />

          {/* FLOATING BLURS */}
          <div
            className="
              absolute -top-20 right-0
              h-64 w-64 rounded-full
              bg-cyan-400/20 blur-3xl
              dark:bg-cyan-500/10
            "
          />

          <div
            className="
              absolute -bottom-20 left-0
              h-64 w-64 rounded-full
              bg-purple-400/20 blur-3xl
              dark:bg-purple-500/10
            "
          />

          <div className="relative z-10">
            {/* TOP BADGE */}
            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-cyan-200
                bg-cyan-50
                px-4 py-1.5
                text-xs font-semibold
                uppercase tracking-[0.2em]
                text-cyan-700

                dark:border-cyan-500/20
                dark:bg-cyan-500/10
                dark:text-cyan-300
              "
            >
              Career Tracker
            </div>

            {/* MAIN CONTENT */}
            <div
              className="
                mt-6 flex flex-col gap-8
                lg:flex-row lg:items-end lg:justify-between
              "
            >
              <div className="max-w-3xl">
                <h1
                  className="
                    text-4xl font-black tracking-tight
                    text-zinc-900
                    sm:text-5xl lg:text-6xl
                    dark:text-white
                  "
                >
                  Manage Your
                  <span
                    className="
                      block bg-gradient-to-r
                      from-cyan-500 via-sky-500 to-purple-500
                      bg-clip-text text-transparent
                    "
                  >
                    Job Applications
                  </span>
                </h1>

                <p
                  className="
                    mt-5 max-w-2xl
                    text-base leading-relaxed
                    text-zinc-600
                    sm:text-lg
                    dark:text-white/60
                  "
                >
                  Track application progress, monitor interviews,
                  and stay organized throughout your hiring journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div
          className="
            grid grid-cols-1 gap-3
            sm:grid-cols-2 sm:gap-4
            xl:grid-cols-4
          "
        >
          <StatCard
            icon={<Briefcase />}
            label="Total Applications"
            value={stats.total}
            accent="cyan"
          />

          <StatCard
            icon={<Clock3 />}
            label="Pending"
            value={stats.pending}
            accent="yellow"
          />

          <StatCard
            icon={<Handshake />}
            label="Interviews"
            value={stats.interviews}
            accent="purple"
          />

          <StatCard
            icon={<Briefcase />}
            label="Offers"
            value={stats.offers}
            accent="green"
          />
        </div>

        {/* TABS */}     
        <div
          className="
            flex gap-2 overflow-x-auto pb-2
            no-scrollbar
          "
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  `
                    relative shrink-0
                    rounded-xl border
                    px-4 sm:px-5
                    py-2 sm:py-2.5
                    text-xs sm:text-sm
                    font-semibold
                    whitespace-nowrap
                    transition-all duration-200
                  `,
                  tabStyles[tab],

                  // inactive
                  !isActive &&
                    `
                      opacity-80
                      hover:opacity-100
                    `,

                  // active
                  isActive &&
                    `
                      shadow-lg
                      border-transparent
                      ring-1 ring-white/10
                    `
                )}
              >
                {/* active glow */}
                {isActive && (
                  <span
                    className="
                      absolute inset-0 rounded-xl
                      bg-white/[0.06]
                      pointer-events-none
                    "
                  />
                )}

                <span className="relative z-10">
                  {tab}
                </span>
              </button>
            );
          })}
        </div>

        {/* SORT */}
        <div className="flex justify-start sm:justify-end">
          <CustomSelect
            label="Sort by"
            value={sortBy}
            onValueChange={setSortBy}
            options={[
              {
                label:
                  'Most Recent',
                value:
                  'Most Recent',
              },
              {
                label: 'Oldest',
                value: 'Oldest',
              },
              {
                label: 'Status',
                value: 'Status',
              },
            ]}
          />
        </div>

        {/* EMPTY */}
        {filteredApplications.length ===
        0 ? (
          <div
            className="
              rounded-3xl
              border border-zinc-200
              bg-white/90
              p-6 sm:p-12
              text-center
              shadow-sm
              dark:border-white/10
              dark:bg-white/[0.04]
            "
          >
            <h2 className="text-2xl font-semibold">
              No applications yet
            </h2>

            <p className="mt-2 text-zinc-600 dark:text-white/60">
              Start exploring
              roles that match
              your skills.
            </p>

            <Link
              href="/jobs"
              className="inline-block mt-6"
            >
              <Button size="lg">
                Browse Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map(
              (
                app: ApplicationItem
              ) => (
                <div
                  key={app.id}
                  className="
                    rounded-3xl
                    border border-zinc-200
                    bg-white/90 p-6
                    shadow-sm
                    backdrop-blur-xl
                    dark:border-white/10
                    dark:bg-white/[0.04]
                  "
                >
                  <div
                    className="
                      flex flex-col gap-4
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                    "
                  >
                    <div>
                      <h3 className="text-2xl font-semibold">
                        {
                          app.jobTitle
                        }
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500 dark:text-white/45">
                        {
                          app.companyName
                        }
                      </p>

                      <p className="mt-1 text-zinc-600 dark:text-white/60">
                        Applied on{' '}
                        {new Date(
                          app.appliedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={clsx(
                        `
                          px-3 py-1 rounded-full
                          border text-sm w-fit
                        `,
                        tabStyles[
                          app.status
                        ]
                      )}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* PROGRESS */}
                  <div className="flex items-center gap-2 mt-5">
                    {statusFlow.map(
                      (
                        step,
                        idx
                      ) => {
                        const reached =
                          statusFlow.indexOf(
                            app.status
                          ) >= idx;

                        return (
                          <div
                            key={step}
                            className="flex items-center gap-2 flex-1"
                          >
                            <div
                              className={clsx(
                                `
                                  h-2 flex-1 rounded-full
                                `,
                                reached
                                  ? 'bg-cyan-400'
                                  : 'bg-zinc-200 dark:bg-white/10'
                              )}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-3 mt-6 sm:flex-row"
                  >
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                    >
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        View Job
                      </Button>
                    </Link>

                    <Button
                      variant="danger"
                      leftIcon={
                        <Trash2
                          size={16}
                        />
                      }
                      onClick={() => {
                        if (
                          confirm(
                            'Withdraw this application?'
                          )
                        ) {
                          withdrawApplication(
                            app.id
                          );
                        }
                      }}
                      className="w-full sm:w-auto"
                    >
                      Withdraw
                      Application
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDashboardPage;

function StatCard({
  icon,
  label,
  value,
  accent,
}: StatCardProps) {
  const accentMap: Record<
    Accent,
    string
  > = {
    cyan: `
      text-cyan-600
      dark:text-cyan-400
    `,
    yellow: `
      text-yellow-600
      dark:text-yellow-400
    `,
    purple: `
      text-purple-600
      dark:text-purple-400
    `,
    green: `
      text-emerald-600
      dark:text-emerald-400
    `,
  };

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        border border-zinc-200 bg-white/90
        p-4 sm:p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.05]
      "
    >
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] font-semibold text-zinc-500 dark:text-white/45">
            {label}
          </p>

          <h3
            className={clsx(
              `
                mt-2 text-2xl sm:text-3xl font-black
              `,
              accentMap[accent]
            )}
          >
            {value}
          </h3>
        </div>

        <div
          className={clsx(
            `
              rounded-2xl
              border border-zinc-200
              bg-zinc-100 p-3
              dark:border-white/10
              dark:bg-white/10
            `,
            accentMap[accent]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}