'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  CalendarDays,
  Eye,
  FileText,
  LayoutGrid,
  List,
} from 'lucide-react';

import {
  ApplicationItem,
  ApplicationStatus,
  useApplicationsStore,
} from '@/lib/store';
import Button from '@/app/components/ui/Button';
import CandidateDetailModal from '@/app/components/employer/candidate-detail-modal';
import CustomSelect from '@/app/components/ui/Select';

const columns = [
  {
    label: 'New',
    value: 'Applied',
  },
  {
    label: 'Reviewing',
    value: 'Screening',
  },
  {
    label: 'Interview',
    value: 'Interview',
  },
  {
    label: 'Offer',
    value: 'Offer',
  },
  {
    label: 'Rejected',
    value: 'Rejected',
  },
] as const;

type ViewMode = 'kanban' | 'list';

const statusStyles: Record<ApplicationStatus, string> = {
  Applied:
    `
      border-cyan-200 dark:border-cyan-500/20
      bg-cyan-50 dark:bg-cyan-500/10
      text-cyan-700 dark:text-cyan-300
    `,

  Screening:
    `
      border-blue-200 dark:border-blue-500/20
      bg-blue-50 dark:bg-blue-500/10
      text-blue-700 dark:text-blue-300
    `,

  Interview:
    `
      border-purple-200 dark:border-purple-500/20
      bg-purple-50 dark:bg-purple-500/10
      text-purple-700 dark:text-purple-300
    `,

  Offer:
    `
      border-green-200 dark:border-green-500/20
      bg-green-50 dark:bg-green-500/10
      text-green-700 dark:text-green-300
    `,

  Rejected:
    `
      border-red-200 dark:border-red-500/20
      bg-red-50 dark:bg-red-500/10
      text-red-700 dark:text-red-300
    `,
};

const EmployerApplicationsPage = () => {
  const applications = useApplicationsStore(
    (state) => state.applications
  );

  const [view, setView] = useState<ViewMode>('kanban');

  const [selectedJob, setSelectedJob] = useState('All');

  const [selectedStatus, setSelectedStatus] = useState('All');

  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [reviewing, setReviewing] = useState<ApplicationItem | null>(null);

  const uniqueJobs = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(
          applications.map((app) => app.jobTitle)
        )
      ),
    ];
  }, [applications]);

  const filteredApplications = useMemo(() => {
    let data = [...applications];

    if (selectedJob !== 'All') {
      data = data.filter(
        (app) => app.jobTitle === selectedJob
      );
    }

    if (selectedStatus !== 'All') {
      data = data.filter(
        (app) => app.status === selectedStatus
      );
    }

    if (sortBy === 'recent') {
      data.sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() -
          new Date(a.appliedAt).getTime()
      );
    } else {
      data.sort((a, b) =>
        a.applicant.fullName.localeCompare(
          b.applicant.fullName
        )
      );
    }

    return data;
  }, [
    applications,
    selectedJob,
    selectedStatus,
    sortBy,
  ]);

  const moveApplication = (
    id: string,
    status: ApplicationStatus
  ) => {
    useApplicationsStore.setState((state) => ({
      applications: state.applications.map((app) =>
        app.id === id
          ? { ...app, status }
          : app
      ),
    }));
  };

  return (
    <main
      className="
        min-h-screen overflow-x-hidden
        bg-[#F8FAFC] text-zinc-900
        dark:bg-[#0A0A0F] dark:text-white
        px-4 py-6 sm:px-6 lg:px-8
        transition-colors duration-300
      "
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <section
          className="
            relative overflow-hidden rounded-[2rem]
            border border-zinc-200 dark:border-cyan-500/20
            bg-white dark:bg-white/[0.04] p-5 sm:p-8
            backdrop-blur-2xl shadow-sm dark:shadow-[0_0_40px_rgba(34,211,238,0.08)] transition-colors duration-300
          "
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Candidate Applications
              </h1>

              <p className="mt-2 text-zinc-600 dark:text-white/60">
                Review and manage incoming
                candidates.
              </p>
            </div>

            <div
              className="
                flex w-full sm:w-fit items-center gap-2
                rounded-2xl border border-zinc-200 dark:border-white/10
                bg-zinc-100 dark:bg-white/[0.03] p-2
              "
            >
              <button
                onClick={() => setView('kanban')}
                aria-pressed={view === 'kanban'}
                className={clsx(
                  'flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 transition',
                  view === 'kanban'
                    ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                    : 'text-zinc-600 hover:bg-zinc-200 dark:text-white/60 dark:hover:bg-white/5'
                )}
              >
                <LayoutGrid size={18} />
                Kanban
              </button>

              <button
                onClick={() => setView('list')}
                className={clsx(
                  'flex flex-1 sm:flex-none items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 transition',
                  view === 'list'
                    ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                    : 'text-zinc-600 hover:bg-zinc-200 dark:text-white/60 dark:hover:bg-white/5'
                )}
              >
                <List size={18} />
                List
              </button>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <CustomSelect
              value={selectedJob}
              onValueChange={setSelectedJob}
              options={uniqueJobs.map((job) => ({
                label: job,
                value: job,
              }))}
            />

            <CustomSelect
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              options={[
                {
                  label: 'All Statuses',
                  value: 'All',
                },
                ...columns.map((status) => ({
                  label: status.label,
                  value: status.value,
                })),
              ]}
            />

            <CustomSelect
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as 'recent' | 'name')
              }
              options={[
                {
                  label: 'Most Recent',
                  value: 'recent',
                },
                {
                  label: 'Candidate Name',
                  value: 'name',
                },
              ]}
            />
          </div>
        </section>

        {/* KANBAN */}
        {view === 'kanban' && (
          <div className="w-full overflow-x-auto pb-2 no-scrollbar">
            <div className="flex gap-5 xl:grid xl:grid-cols-5 min-w-max xl:min-w-0">
              {columns.map((column) => {
                const apps =
                  filteredApplications.filter(
                    (app) =>
                      app.status === column.value
                  );

                return (
                  <div
                    key={column.value}
                    onDragOver={(e) =>
                      e.preventDefault()
                    }
                    onDrop={() => {
                      if (draggingId) {
                        moveApplication(
                          draggingId,
                          column.value as ApplicationStatus
                        );

                        setDraggingId(null);
                      }
                    }}
                    className="
                      w-[280px] sm:w-[320px] xl:w-auto flex-shrink-0
                      rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-4 backdrop-blur-xl min-h-[420px] sm:min-h-[500px]
                    "
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold">
                          {column.label}
                        </h2>

                        <p className="text-sm text-zinc-500 dark:text-white/40">
                          {apps.length} {apps.length === 1 
                            ? 'candidate' 
                            : 'candidates'
                          }
                        </p>
                      </div>

                      <div
                        className={clsx(
                          'rounded-full px-3 py-1 text-xs border',
                          statusStyles[
                            column.value as ApplicationStatus
                          ]
                        )}
                      >
                        {apps.length}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {apps.map((app) => (
                        <motion.div
                          key={app.id}
                          layout
                          draggable
                          onDragStart={() =>
                            setDraggingId(app.id)
                          }
                          onDragEnd={() =>
                            setDraggingId(null)
                          }
                          whileHover={{ y: -2 }}
                          className="
                            cursor-grab rounded-3xl
                            border border-zinc-200 dark:border-white/10
                            bg-white shadow-xl dark:shadow-none dark:bg-black/30 p-4 sm:p-5
                            transition hover:border-cyan-500/20
                            active:cursor-grabbing
                          "
                        >
                          <div className="flex items-start justify-between gap-3 min-w-0">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold truncate">
                                {app.applicant.fullName}
                              </h3>

                              <p className="mt-1 text-sm text-zinc-500 dark:text-white/50 truncate">
                                {app.jobTitle}
                              </p>
                            </div>

                            <span
                              className={clsx(
                                'shrink-0 rounded-full border px-2 py-1 text-xs',
                                statusStyles[
                                  app.status
                                ]
                              )}
                            >
                              {column.label}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-white/60">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={14} />
                              {new Date(
                                app.appliedAt
                              ).toLocaleDateString()}
                            </div>

                            <div className="flex items-center gap-2">
                              <FileText size={14} />
                              Resume.pdf
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={
                              <Eye size={14} />
                            }
                            className="mt-5 w-full"
                            onClick={() =>
                              setReviewing(app)
                            }
                          >
                            Review
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <section
            className="
              overflow-hidden rounded-[2rem]
              border border-zinc-200 dark:border-white/10
              bg-white dark:bg-white/[0.03]
              backdrop-blur-xl
              transition-colors duration-300
            "
          >
            <div className="overflow-x-auto pb-2 no-scrollbar">
              <table className="w-full min-w-[780px] lg:min-w-[900px]">
                <thead
                  className="
                    border-b border-zinc-200 dark:border-white/10
                    bg-zinc-100/80 dark:bg-white/[0.03]
                  "
                >
                  <tr>
                    <th
                      className="
                        px-6 py-4 text-left text-sm font-medium
                        text-zinc-500 dark:text-white/60
                      "
                    >
                      Candidate
                    </th>

                    <th
                      className="
                        px-6 py-4 text-left text-sm font-medium
                        text-zinc-500 dark:text-white/60
                      "
                    >
                      Job
                    </th>

                    <th
                      className="
                        px-6 py-4 text-left text-sm font-medium
                        text-zinc-500 dark:text-white/60
                      "
                    >
                      Applied Date
                    </th>

                    <th
                      className="
                        px-6 py-4 text-left text-sm font-medium
                        text-zinc-500 dark:text-white/60
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        px-6 py-4 text-left text-sm font-medium
                        text-zinc-500 dark:text-white/60
                      "
                    >
                      Resume
                    </th>

                    <th
                      className="
                        px-6 py-4 text-right text-sm font-medium
                        text-zinc-500 dark:text-white/60
                      "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="
                        border-b border-zinc-100 dark:border-white/5
                        transition
                        hover:bg-zinc-50 dark:hover:bg-white/[0.03]
                      "
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {app.applicant.fullName}
                          </p>

                          <p
                            className="
                              text-sm
                              text-zinc-500 dark:text-white/40
                            "
                          >
                            {app.applicant.email}
                          </p>
                        </div>
                      </td>

                      <td
                        className="
                          px-6 py-5
                          text-zinc-700 dark:text-white/70
                        "
                      >
                        {app.jobTitle}
                      </td>

                      <td
                        className="
                          px-6 py-5
                          text-zinc-600 dark:text-white/60
                        "
                      >
                        {new Date(
                          app.appliedAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={clsx(
                            'rounded-full border px-3 py-1 text-xs',
                            statusStyles[app.status]
                          )}
                        >
                          {
                            columns.find(
                              (c) =>
                                c.value === app.status
                            )?.label
                          }
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          className="
                            text-cyan-700 hover:text-cyan-800
                            dark:text-cyan-300 dark:hover:text-cyan-200
                            transition
                          "
                        >
                          Resume.pdf
                        </button>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye size={14} />}
                          onClick={() =>
                            setReviewing(app)
                          }
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* REVIEW MODAL */}
      {reviewing && (
        <CandidateDetailModal
          application={reviewing}
          open={!!reviewing}
          onOpenChange={(open) => {
            if (!open) setReviewing(null);
          }}
        />
      )}
    </main>
  )
}

export default EmployerApplicationsPage
