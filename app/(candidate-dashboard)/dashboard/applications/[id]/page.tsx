'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  notFound,
  useParams,
  useRouter,
} from 'next/navigation';

import {
  CalendarDays,
  Mail,
  User,
  FileText,
  Download,
  Trash2,
  StickyNote,
} from 'lucide-react';

import clsx from 'clsx';

import Button from '@/app/components/ui/Button';

import {
  useApplicationsStore,
  ApplicationItem,
} from '@/lib/store';

import ShowToast from '@/app/components/ui/Toast';

const timelineSteps = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
];

const statusColors: Record<
  string,
  string
> = {
  Applied: `
    text-cyan-600
    border-cyan-500/30
    bg-cyan-500/10
    dark:text-cyan-400
  `,

  Screening: `
    text-blue-600
    border-blue-500/30
    bg-blue-500/10
    dark:text-blue-400
  `,

  Interview: `
    text-purple-600
    border-purple-500/30
    bg-purple-500/10
    dark:text-purple-400
  `,

  Offer: `
    text-emerald-600
    border-emerald-500/30
    bg-emerald-500/10
    dark:text-emerald-400
  `,

  Rejected: `
    text-red-600
    border-red-500/30
    bg-red-500/10
    dark:text-red-400
  `,
};

const ApplicationDetailPage = () => {
  const params = useParams();

  const router = useRouter();

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

  const updateApplicationNotes =
    useApplicationsStore(
      (state) =>
        state.updateApplicationNotes
    );

  const application =
    applications.find(
      (app) =>
        app.id === params.id
    ) as
      | ApplicationItem
      | undefined;

  const [notes, setNotes] =
    useState('');

  const [isWithdrawing, setIsWithdrawing] =
    useState(false);

  useEffect(() => {
    if (application) {
      setNotes(
        application.notes || ''
      );
    }
  }, [application]);

  if (!application)
    return notFound();

  const handleSaveNotes = () => {
    updateApplicationNotes(
      application.id,
      notes
    );

    ShowToast(
      'Notes saved successfully',
      'success'
    );
  };

  const handleWithdraw =
    () => {
      setIsWithdrawing(true);

      try {
        withdrawApplication(
          application.id
        );

        router.push(
          '/dashboard/applications'
        );
      } catch (error) {
        console.error(
          'Failed to withdraw application:',
          error
        );

        ShowToast(
          'Failed to withdraw application',
          'error'
        );
      } finally {
        setIsWithdrawing(false);
      }
    };

  const isRejected =
    application.status ===
    'Rejected';

  const currentIndex =
    isRejected
      ? Math.max(
          0,
          timelineSteps.indexOf(
            'Screening'
          )
        )
      : timelineSteps.indexOf(
          application.status
        );

  const nextStep =
    application.status ===
    'Interview'
      ? 'Interview on March 15 at 10:00 AM'
      : application.status ===
        'Offer'
      ? 'Review your offer package'
      : application.status ===
        'Rejected'
      ? 'Application closed'
      : 'Waiting for review';

  return (
    <div
      className="
        min-h-screen bg-zinc-50 text-zinc-900
        dark:bg-[#0A0A0F] dark:text-white px-4 py-8 sm:px-6
      "
    >
      {/* DARK BG EFFECTS */}
      <div className="pointer-events-none fixed inset-0 hidden overflow-hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_40%)]" />
      </div>

      <div
        className="
          relative z-10 mx-auto max-w-7xl
          space-y-6 sm:space-y-8 overflow-x-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            relative overflow-hidden
            rounded-[2rem]
            border border-zinc-200
            bg-white/90 p-8 shadow-sm
            backdrop-blur-2xl
            dark:border-cyan-500/20
            dark:bg-white/[0.04]
            dark:shadow-[0_0_40px_rgba(34,211,238,0.08)]
          "
        >
          <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {
                application.jobTitle
              }
            </h1>

            <p className="mt-2 text-zinc-600 dark:text-white/60">
              {
                application.companyName
              }
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span
                className={clsx(
                  `
                    rounded-full border px-4 py-2 text-sm
                  `,
                  statusColors[
                    application.status
                  ]
                )}
              >
                {
                  application.status
                }
              </span>

              <span
                className="
                  flex items-center gap-2 text-sm
                  text-zinc-500 dark:text-white/50
                "
              >
                <CalendarDays
                  size={16}
                />

                Applied on{' '}
                {new Date(
                  application.appliedAt
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          className="
            grid grid-cols-1
            gap-5 sm:gap-8
            lg:grid-cols-[1.5fr_1fr]
          "
        >
          {/* LEFT */}
          <div className="space-y-8">
            {/* TIMELINE */}
            <section
              className="
                rounded-[2rem]
                border border-zinc-200
                bg-white/90
                p-4 sm:p-6 lg:p-8 shadow-sm
                backdrop-blur-2xl
                dark:border-white/10
                dark:bg-white/[0.04]
              "
            >
              <h2 className="mb-6 text-2xl font-semibold">
                Application
                Timeline
              </h2>

              <div className="space-y-6">
                {timelineSteps.map(
                  (
                    step,
                    index
                  ) => {
                    const active =
                      index <=
                      currentIndex;

                    return (
                      <div
                        key={step}
                        className="
                          group flex gap-3 sm:gap-5
                          rounded-2xl
                          border border-zinc-200
                          bg-zinc-50 p-4 transition
                          hover:border-cyan-500/30
                          dark:border-white/5
                          dark:bg-white/[0.02]
                        "
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={clsx(
                              `
                                h-5 w-5 rounded-full
                                ring-4 transition-all
                              `,
                              active
                                ? `
                                  bg-cyan-400
                                  ring-cyan-400/20
                                  shadow-[0_0_18px_rgba(34,211,238,0.5)]
                                `
                                : `
                                  bg-zinc-300 ring-zinc-200
                                  dark:bg-white/10 dark:ring-white/5
                                `
                            )}
                          />

                          {index <
                            timelineSteps.length -
                              1 && (
                            <div
                              className={clsx(
                                `
                                  mt-1 h-12 sm:h-16
                                  w-[3px] rounded-full
                                `,
                                active
                                  ? 'bg-cyan-400/70'
                                  : `
                                    bg-zinc-200
                                    dark:bg-white/10
                                  `
                              )}
                            />
                          )}
                        </div>

                        <div>
                          <h3
                            className={clsx(
                              'font-medium',
                              active
                                ? 'text-zinc-900 dark:text-white'
                                : 'text-zinc-400 dark:text-gray-500'
                            )}
                          >
                            {step}
                          </h3>

                          <p
                            className="
                              text-sm text-zinc-500 dark:text-white/50
                            "
                          >
                            {index ===
                              0 &&
                            active
                              ? new Date(
                                  application.appliedAt
                                ).toLocaleDateString()
                              : active
                              ? 'In progress'
                              : '--'}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {isRejected && (
                <div
                  className="
                    mt-8 rounded-2xl
                    border border-red-500/30 bg-red-500/10 p-4
                  "
                >
                  <h4 className="font-semibold text-red-500 dark:text-red-400">
                    Application
                    Rejected
                  </h4>

                  <p className="mt-1 text-sm text-zinc-600 dark:text-white/70">
                    This application
                    did not move
                    forward after the
                    review stage.
                  </p>
                </div>
              )}
            </section>

            {/* NOTES */}
            <section
              className="
                rounded-[2rem]
                border border-zinc-200
                bg-white/90 p-6
                shadow-sm backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:shadow-[0_0_20px_rgba(255,255,255,0.03)]
              "
            >
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
                <StickyNote
                  size={20}
                />

                Personal Notes
              </h2>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                rows={6}
                placeholder="Write notes about this application..."
                className="
                  w-full resize-none rounded-3xl
                  border border-zinc-200
                  bg-zinc-50 p-5 text-zinc-900
                  placeholder:text-zinc-400
                  outline-none transition
                  focus:border-cyan-400
                  focus:ring-4 focus:ring-cyan-400/10
                  dark:border-white/10 dark:bg-white/[0.03]
                  dark:text-white
                  dark:placeholder:text-white/40
                  dark:focus:shadow-[0_0_12px_rgba(34,211,238,0.15)]
                "
              />

              <div className="mt-5 flex justify-end">
                <Button
                  onClick={
                    handleSaveNotes
                  }
                >
                  Save Notes
                </Button>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* NEXT STEPS */}
            <section
              className="
                rounded-[2rem]
                border border-zinc-200 bg-white/90
                p-4 sm:p-6 shadow-sm
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/[0.04]
              "
            >
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <CalendarDays
                  size={18}
                  className="text-cyan-500 dark:text-cyan-400"
                />

                Next Steps
              </h2>

              <p className="mt-3 text-zinc-600 dark:text-white/70">
                {nextStep}
              </p>
            </section>

            {/* RECRUITER */}
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
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                Recruiter Contact
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <p className="flex items-center gap-2 text-zinc-700 dark:text-white/80">
                  <User size={16} />
                  Sarah Johnson
                </p>

                <p className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                  <Mail size={16} />
                  recruiter@company.com
                </p>
              </div>
            </section>

            {/* DOCUMENTS */}
            <section
              className="
                rounded-[2rem]
                border border-zinc-200
                bg-white/90 p-6 shadow-sm
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/[0.04]
              "
            >
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <FileText
                  size={18}
                  className="text-cyan-500 dark:text-cyan-400"
                />

                Submitted
                Documents
              </h2>

              <div className="space-y-3">
                <DocumentItem label="Resume.pdf" />

                <DocumentItem label="CoverLetter.txt" />
              </div>
            </section>

            {/* WITHDRAW */}
            <Button
              variant="danger"
              leftIcon={
                <Trash2
                  size={16}
                />
              }
              className="w-full sm:w-auto"
              disabled={
                isWithdrawing
              }
              onClick={() => {
                if (
                  confirm(
                    'Withdraw this application?'
                  )
                ) {
                  handleWithdraw();
                }
              }}
            >
              Withdraw
              Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;

function DocumentItem({
  label,
}: {
  label: string;
}) {
  return (
    <div
      className="
        group flex items-center justify-between gap-3
        rounded-3xl
        border border-zinc-200
        bg-zinc-50 p-4
        transition
        hover:border-cyan-500/30
        dark:border-white/10
        dark:bg-white/[0.03]
        dark:hover:bg-white/[0.05]
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            rounded-2xl bg-cyan-500/10 p-3
          "
        >
          <FileText
            className="text-cyan-600 dark:text-cyan-400"
            size={18}
          />
        </div>

        <span className="font-medium text-zinc-800 dark:text-white">
          {label}
        </span>
      </div>

      <button
        className="
          rounded-xl p-2
          text-zinc-500 transition
          hover:bg-zinc-100
          hover:text-zinc-900
          dark:text-white/50
          dark:hover:bg-white/10
          dark:hover:text-white
        "
      >
        <Download size={18} />
      </button>
    </div>
  );
}