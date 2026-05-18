'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import {
  X,
  Mail,
  Phone,
  Globe,
  FileText,
  Download,
  Star,
  CalendarCheck2,
  BadgeCheck,
  ShieldX,
  StickyNote,
} from 'lucide-react';
import { FaLinkedin, FaLinkedinIn } from 'react-icons/fa';

import Button from '@/app/components/ui/Button';
import {
  ApplicationItem,
  ApplicationStatus,
  useApplicationsStore,
} from '@/lib/store';

type CandidateDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationItem | null;
};

const statusStyles: Record<ApplicationStatus, string> = {
  Applied:
    'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  Screening:
    'border-blue-500/20 bg-blue-500/10 text-blue-300',
  Interview:
    'border-purple-500/20 bg-purple-500/10 text-purple-300',
  Offer:
    'border-green-500/20 bg-green-500/10 text-green-300',
  Rejected:
    'border-red-500/20 bg-red-500/10 text-red-300',
};

const CandidateDetailModal = ({
  open,
  onOpenChange,
  application,
}: CandidateDetailModalProps) => {
  const applications = useApplicationsStore(
    (state) => state.applications
  );

  const setApplications = useApplicationsStore.setState;

  const [notes, setNotes] = useState(
    application?.notes || ''
  );

  const [rating, setRating] = useState(
    (application as ApplicationItem & {
      rating?: number;
    })?.rating || 0
  );

  if (!application) return null;

  const updateApplication = (
    updates: Partial<ApplicationItem>
  ) => {
    setApplications((state) => ({
      applications: state.applications.map((app) =>
        app.id === application.id
          ? {
              ...app,
              ...updates,
            }
          : app
      ),
    }));
  };

  const updateStatus = (
    status: ApplicationStatus
  ) => {
    updateApplication({ status });
  };

  const saveNotes = () => {
    updateApplication({ notes });
  };

  const saveRating = (value: number) => {
    setRating(value);

    updateApplication({
      ...(application as ApplicationItem),
      rating: value,
    });
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[96vw] sm:w-[95vw] max-w-4xl  h-[95vh] sm:max-h-[92vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A0A0F] shadow-[0_0_60px_rgba(34,211,238,0.08)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_40%)] pointer-events-none" />

          <div className="h-full overflow-y-auto px-2 py-4 pb-24 sm:py-6 no-scrollbar">
            {/* HEADER */}
            <div className="relative z-10 flex gap-4 items-start justify-between border-b border-white/10 px-5 py-5 sm:px-8">
              <div>
                <Dialog.Title className="text-2xl sm:text-3xl font-bold">
                  {application.applicant.fullName}
                </Dialog.Title>

                <Dialog.Description className="mt-2 text-sm text-white/50">
                  Candidate Review
                </Dialog.Description>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={clsx(
                      'rounded-full border px-3 py-1 text-xs',
                      statusStyles[
                        application.status
                      ]
                    )}
                  >
                    {application.status}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                    {
                      application.jobTitle
                    }
                  </span>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  className="
                    rounded-full
                    border border-white/10
                    bg-white/[0.04]
                    p-2
                    text-white/60
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            {/* BODY */}
            <div className="relative z-10 px-4 py-5 sm:px-8 sm:py-6">
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] min-w-0">
                {/* LEFT */}
                <div className="space-y-6 min-w-0">
                  {/* INFO */}
                  <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <h2 className="mb-5 text-xl font-semibold">
                      Candidate Information
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoCard
                        icon={<Mail size={18} />}
                        label="Email"
                        value={application.applicant.email}
                      />

                      <InfoCard
                        icon={<Phone size={18} />}
                        label="Phone"
                        value={application.applicant.phone}
                      />

                      <InfoCard
                        icon={
                          <FaLinkedin className="text-[#0A66C2]" size={18} />
                        }
                        label="LinkedIn"
                        value={
                          application.applicant
                            .linkedin ||
                          'Not provided'
                        }
                      />

                      <InfoCard
                        icon={<Globe size={18} />}
                        label="Portfolio"
                        value={
                          application.applicant
                            .portfolio ||
                          'Not provided'
                        }
                      />
                    </div>
                  </section>

                  {/* RESUME */}
                  <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">
                          Resume
                        </h2>

                        <p className="mt-1 text-sm text-white/50">
                          View or download
                          submitted resume.
                        </p>
                      </div>

                      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <a
                          href={
                            application.applicant.resumeUrl ||
                            '/resume.pdf'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          <FileText size={16} />
                          View Resume
                        </a>

                        <a
                          href={
                            application.applicant.resumeUrl ||
                            '/resume.pdf'
                          }
                          download={
                            application.applicant.resumeName ||
                            'resume.pdf'
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500/20 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/30"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    </div>
                  </section>

                  {/* COVER LETTER */}
                  <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <h2 className="mb-4 text-xl font-semibold">
                      Cover Letter
                    </h2>

                    <p className="leading-relaxed text-white/70">
                      {
                        application.applicant
                          .coverLetter
                      }
                    </p>
                  </section>

                  {/* SCREENING ANSWERS */}
                  {application.applicant.screeningAnswers
                    ?.length ? (
                    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                      <h2 className="mb-5 text-xl font-semibold">
                        Screening Answers
                      </h2>

                      <div className="space-y-4">
                        {application.applicant.screeningAnswers.map(
                          (
                            answer,
                            index
                          ) => (
                            <div
                              key={index}
                              className="rounded-2xl border border-white/10 bg-black/20 p-4"
                            >
                              <p className="font-medium text-white">
                                { answer.question}
                              </p>

                              <p className="mt-2 text-white/70">
                                {answer.answer}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  ) : null}

                  {/* NOTES */}
                  <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <div className="mb-4 flex items-center gap-2">
                      <StickyNote
                        size={20}
                      />

                      <h2 className="text-xl font-semibold">
                        Private Notes
                      </h2>
                    </div>

                    <textarea
                      value={notes}
                      onChange={(e) =>
                        setNotes(
                          e.target.value
                        )
                      }
                      placeholder="Add internal hiring notes..."
                      rows={6}
                      className="
                        w-full
                        rounded-3xl
                        border border-white/10
                        bg-black/20
                        p-4
                        text-white
                        placeholder:text-white/40
                        outline-none
                        transition
                        focus:border-cyan-500/30
                        resize-none
                      "
                    />

                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={saveNotes}
                      >
                        Save Notes
                      </Button>
                    </div>
                  </section>
                </div>

                {/* RIGHT */}
                <div className="space-y-6 min-w-0">
                  {/* SKILLS */}
                  <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <h2 className="mb-5 text-xl font-semibold">
                      Skills
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {application.applicant.skills?.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="
                              max-w-full break-words
                              rounded-full
                              border border-cyan-500/20
                              bg-cyan-500/10
                              px-3 py-1
                              text-sm text-cyan-300
                            "
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </section>

                  {/* RATING */}
                  <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <h2 className="mb-5 text-xl font-semibold">
                      Candidate Rating
                    </h2>

                    <div className="flex items-center gap-2">
                      {Array.from({
                        length: 5,
                      }).map((_, index) => {
                        const value =
                          index + 1;

                        return (
                          <button
                            key={value}
                            onClick={() =>
                              saveRating(
                                value
                              )
                            }
                            className="transition hover:scale-110"
                          >
                            <Star
                              size={28}
                              className={clsx(
                                rating >=
                                  value
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-white/20'
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* STATUS ACTIONS */}
                  <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <h2 className="mb-5 text-xl font-semibold">
                      Pipeline Actions
                    </h2>

                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        leftIcon={
                          <CalendarCheck2
                            size={16}
                          />
                        }
                        onClick={() =>
                          updateStatus(
                            'Interview'
                          )
                        }
                      >
                        Schedule Interview
                      </Button>

                      <Button
                        variant="secondary"
                        className="w-full"
                        leftIcon={
                          <BadgeCheck
                            size={16}
                          />
                        }
                        onClick={() =>
                          updateStatus(
                            'Offer'
                          )
                        }
                      >
                        Make Offer
                      </Button>

                      <Button
                        variant="danger"
                        className="w-full"
                        leftIcon={
                          <ShieldX size={16} />
                        }
                        onClick={() =>
                          updateStatus(
                            'Rejected'
                          )
                        }
                      >
                        Reject Candidate
                      </Button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default CandidateDetailModal

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-center gap-2 text-white/50">
        {icon}

        <span className="text-sm">
          {label}
        </span>
      </div>

      <p className="break-all text-sm sm:text-base font-medium text-white">
        {value}
      </p>
    </div>
  );
}