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
            rounded-[2rem]
            border border-zinc-200
            bg-white/90 p-6
            shadow-sm
            backdrop-blur-xl
            dark:border-white/10
            dark:bg-white/[0.04]
          "
        >
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            My Applications
          </h1>

          <p className="mt-3 text-zinc-600 dark:text-white/60">
            Track your job applications in one place.
          </p>
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
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab)
              }
              className={clsx(
                `
                  rounded-2xl border
                  px-4 py-2
                  text-sm font-medium
                  transition-all
                  whitespace-nowrap
                `,
                tabStyles[tab],
                activeTab === tab &&
                  `
                    scale-[1.02]
                    shadow-sm
                  `
              )}
            >
              {tab}
            </button>
          ))}
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
          <p className="text-sm font-semibold text-zinc-500 dark:text-white/45">
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