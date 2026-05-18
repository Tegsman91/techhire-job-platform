'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
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
import { useApplicationsStore, ApplicationItem } from '@/lib/store';
import ShowToast from '@/app/components/ui/Toast';

const timelineSteps = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
];

const statusColors: Record<string, string> = {
  Applied: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  Screening: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Interview: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  Offer: 'text-green-400 border-green-500/30 bg-green-500/10',
  Rejected: 'text-red-400 border-red-500/30 bg-red-500/10',
};

const ApplicationDetailPage = () => {
  const params = useParams();
  const router = useRouter();

  const applications = useApplicationsStore((state) => state.applications);
  const withdrawApplication = useApplicationsStore(
    (state) => state.withdrawApplication
  );
  const updateApplicationNotes = useApplicationsStore(
    (state) => state.updateApplicationNotes
  );

  const application = applications.find(
    (app) => app.id === params.id
  ) as ApplicationItem | undefined;

  const [notes, setNotes] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '');
    }
  }, [application]);

  if (!application) return notFound();

  const handleSaveNotes = () => {
    updateApplicationNotes(application.id, notes);
    ShowToast('Notes saved successfully', 'success');
  };

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    try {
      withdrawApplication(application.id);
      router.push('/dashboard/applications');
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      ShowToast('Failed to withdraw application', 'error');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const isRejected = application.status === 'Rejected';

  const currentIndex = isRejected
    ? Math.max(0, timelineSteps.indexOf('Screening'))
    : timelineSteps.indexOf(application.status);

  const nextStep =
    application.status === 'Interview'
      ? 'Interview on March 15 at 10:00 AM'
      : application.status === 'Offer'
      ? 'Review your offer package'
      : application.status === 'Rejected'
      ? 'Application closed'
      : 'Waiting for review';

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 overflow-x-hidden"
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-white/[0.04] p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,211,238,0.08)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {application.jobTitle}
            </h1>
            <p className="text-gray-400 mt-2">
              {application.companyName}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <span
                className={clsx(
                  'px-4 py-2 rounded-full border text-sm',
                  statusColors[application.status]
                )}
              >
                {application.status}
              </span>

              <span className="flex items-center gap-2 text-sm text-gray-400">
                <CalendarDays size={16} />
                Applied on{' '}
                {new Date(application.appliedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 sm:gap-8">
          {/* Left */}
          <div className="space-y-8">
            {/* Timeline */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-6 lg:p-8 backdrop-blur-2xl"
            >
              <h2 className="text-2xl font-semibold mb-6">
                Application Timeline
              </h2>

              <div className="space-y-6">
                {timelineSteps.map((step, index) => {
                  const active = index <= currentIndex;
                  return (
                    <div 
                      key={step} 
                      className="group flex gap-3 sm:gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-cyan-500/20"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={clsx(
                            "w-5 h-5 rounded-full ring-4 transition-all",
                            active
                              ? "bg-cyan-400 ring-cyan-400/20 shadow-[0_0_18px_rgba(34,211,238,0.5)]"
                              : "bg-white/10 ring-white/5"
                          )}
                        />
                        {index < timelineSteps.length - 1 && (
                          <div
                            className={clsx(
                              "w-[3px] h-12 sm:h-16 rounded-full",
                              active ? "bg-cyan-400/70" : "bg-white/10"
                            )}
                          />
                        )}
                      </div>

                      <div>
                        <h3
                          className={clsx(
                            'font-medium',
                            active ? 'text-white' : 'text-gray-500'
                          )}
                        >
                          {step}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {index === 0 && active
                           ? new Date(application.appliedAt).toLocaleDateString()
                           : active
                           ? 'In progress'
                           : '--'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {isRejected && (
                <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                  <h4 className="font-semibold text-red-400">
                    Application Rejected
                  </h4>
                  <p className="mt-1 text-sm text-gray-300">
                    This application did not move forward after the review stage.
                  </p>
                </div>
              )}
            </section>

            {/* Notes */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.03)]">
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4">
                <StickyNote size={20} />
                Personal Notes
              </h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Write notes about this application..."
                className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-white resize-none placeholder:text-white/40 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
              />

              <div className="mt-5 flex justify-end w-full sm:w-auto">
                <Button onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-8">
            {/* Next Steps */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            >
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <CalendarDays size={18} className="text-cyan-400" />
                Next Steps
              </h2>
              <p className="text-gray-300">{nextStep}</p>
            </section>

            {/* Recruiter */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            >
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                Recruiter Contact
              </h2>

              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2 mt-2">
                  <User size={16} /> Sarah Johnson
                </p>
                <p className="flex items-center gap-2 text-cyan-400">
                  <Mail size={16} /> recruiter@company.com
                </p>
              </div>
            </section>

            {/* Documents */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            >
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <FileText size={18} className="text-cyan-400" />
                Submitted Documents
              </h2>

              <div className="space-y-3">
                <DocumentItem label="Resume.pdf" />
                <DocumentItem label="CoverLetter.txt" />
              </div>
            </section>

            {/* Withdraw */}
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              className="w-full sm:w-auto"
              disabled={isWithdrawing}
              onClick={() => {
                if (confirm('Withdraw this application?')) {
                  handleWithdraw();
                }
              }}
            >
              Withdraw Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailPage

function DocumentItem({ label }: { label: string }) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-500/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-cyan-500/10 p-3">
          <FileText className="text-cyan-400" size={18} />
        </div>
        <span className="font-medium">{label}</span>
      </div>

      <button className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white">
        <Download size={18} />
      </button>
    </div>
  );
}