'use client';

import { useMemo, useState } from 'react';
import {
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  differenceInHours,
  differenceInDays,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Video,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  jobs,
  createCandidates,
  createApplications,
  createInterviews,
  companies,
} from '@/lib/dummy-data';

type EnrichedInterview = {
  id: string;
  applicationId: string;
  date: string;
  type: "Technical" | "HR" | "System Design";
  company: string;
  logo: string;
  position: string;
  mode: "Video" | "Phone" | "In-Person";
};

type InterviewCardProps = {
  interview: EnrichedInterview;
};

const candidates = createCandidates();
const applications = createApplications(jobs, candidates);
const interviews = createInterviews(applications);

const enrichedInterviews: EnrichedInterview[] = interviews.map((interview) => {
  const application = applications.find(
    (app) => app.id === interview.applicationId
  );

  const job = jobs.find((j) => j.id === application?.jobId);

  const company = companies.find((c) => c.id === job?.companyId);

  const mode: EnrichedInterview["mode"] =
    interview.type === 'Technical'
      ? 'Video'
      : interview.type === 'HR'
      ? 'Phone'
      : 'In-Person';

  return {
    ...interview,
    company: company?.name ?? 'Unknown Company',
    logo: company?.logo ?? '',
    position: job?.title ?? 'Unknown Position',
    mode,
  };
});

const InterviewsPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date("2026-04-01T00:00:00.000Z"));
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [reminder, setReminder] = useState({
    email: true,
    sms: false,
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  const referenceTime = useMemo(
    () => new Date("2026-04-01T00:00:00.000Z").getTime(),
    []
  );

  const upcomingInterviews = useMemo(() => {
    return enrichedInterviews
      .filter((i) => new Date(i.date).getTime() > referenceTime)
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [referenceTime]);

  const nextInterview = upcomingInterviews[0];

  const countdown = nextInterview
    ? {
        days: differenceInDays(new Date(nextInterview.date), new Date(referenceTime)),
        hours: differenceInHours(
          new Date(nextInterview.date),
          new Date(referenceTime)
        ) % 24,
      }
    : null;

  const hasInterviewOnDate = (date: Date) =>
  upcomingInterviews.some((i) =>
    isSameDay(new Date(i.date), date)
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="rounded-[2rem] border border-cyan-500/20 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Upcoming Interviews
              </h1>
              <p className="mt-2 text-gray-400">
                Track schedules, prepare ahead, and never miss a step.
              </p>
            </div>

            {countdown && (
              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-4">
                <p className="text-sm text-cyan-300">
                  Next interview in
                </p>
                <h3 className="text-2xl font-bold">
                  {countdown.days} days {countdown.hours} hours
                </h3>
              </div>
            )}
          </div>
        </section>

        {/* Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="relative grid w-[180px] grid-cols-2 rounded-2xl bg-white/5 p-1">
            {/* Sliding background */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-cyan-500 transition-transform duration-300 ease-in-out ${
                view === 'calendar'
                  ? 'translate-x-0'
                  : 'translate-x-full'
              }`}
            />

            {/* Calendar */}
            <button
              onClick={() => setView('calendar')}
              className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                view === 'calendar'
                  ? 'text-black'
                  : 'text-gray-400'
              }`}
            >
              Calendar
            </button>

            {/* List */}
            <button
              onClick={() => setView('list')}
              className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                view === 'list'
                  ? 'text-black'
                  : 'text-gray-400'
              }`}
            >
              List
            </button>
          </div>

          <div className="flex w-fit flex-wrap gap-3">
            <ToggleCard
              label="Email"
              active={reminder.email}
              onClick={() =>
                setReminder((prev) => ({
                  ...prev,
                  email: !prev.email,
                }))
              }
            />
            <ToggleCard
              label="SMS"
              active={reminder.sms}
              onClick={() =>
                setReminder((prev) => ({
                  ...prev,
                  sms: !prev.sms,
                }))
              }
            />
          </div>
        </div>

        {/* Main Content */}
        {view === 'calendar' ? (
        <section className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <ChevronLeft />
            </button>

            <h2 className="text-xl font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[200px]">
              <div className="w-full">
                {/* Weekdays */}
                <div className="grid grid-cols-7 w-full gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-center rounded-xl py-3 text-sm font-semibold text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 w-full gap-2">
                  {calendarDays.map((day) => {
                    const active = hasInterviewOnDate(day);

                    return (
                      <div
                        key={day.toISOString()}
                        className={`
                          flex h-10 sm:h-20 md:h-24 flex-col justify-between items-center sm:items-start rounded-xl border p-3
                          ${
                            active
                              ? 'border-cyan-400/40 bg-cyan-500/10'
                              : 'border-white/10 bg-white/[0.02]'
                          }
                          ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}
                        `}
                      >
                        <span className="text-xs sm:text-sm font-semibold">
                          {format(day, 'd')}
                        </span>

                        {active && (
                          <span className="hidden sm:block text-[9px] sm:text-[11px] text-cyan-300">
                            Interview
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        ) : (
          <div className="grid gap-5">
            {upcomingInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewsPage

function ToggleCard({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl px-4 py-3 ${
        active
          ? 'bg-cyan-500 text-black'
          : 'bg-white/5 text-gray-300'
      }`}
    >
      <Bell size={16} />
      {label}
    </button>
  );
}

function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Content */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold sm:text-2xl">
            {interview.position}
          </h3>

          <p className="mt-1 text-sm text-gray-400 sm:text-base">
            {interview.company}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 sm:text-sm">
              {interview.type}
            </span>

            <span className="rounded-full bg-white/5 px-3 py-1 text-xs sm:text-sm">
              {interview.mode}
            </span>

            <span className="rounded-full bg-white/5 px-3 py-1 text-xs sm:text-sm">
              {format(new Date(interview.date), "PPP p")}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <button className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black sm:w-auto">
            {interview.mode === "Video" ? (
              <Video className="mr-2 inline" size={16} />
            ) : interview.mode === "Phone" ? (
              <Phone className="mr-2 inline" size={16} />
            ) : (
              <MapPin className="mr-2 inline" size={16} />
            )}
            Join Interview
          </button>

          <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm sm:w-auto">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}