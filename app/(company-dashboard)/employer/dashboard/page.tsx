import Link from 'next/link';
import {
  Briefcase,
  Users,
  CalendarDays,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import {
  jobs,
  createCandidates,
  createApplications,
  createInterviews,
} from '@/lib/dummy-data';
import DashboardChart from '@/app/components/employer/dashboard-chart';


const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'offer':
      return `
        bg-emerald-50
        text-emerald-700
        border border-emerald-200
        dark:bg-emerald-500/12
        dark:text-emerald-300
        dark:border-emerald-500/25
      `;

    case 'rejected':
      return `
        bg-red-50
        text-red-700
        border border-red-200
        dark:bg-red-500/12
        dark:text-red-300
        dark:border-red-500/25
      `;

    case 'interview':
      return `
        bg-purple-50
        text-purple-700
        border border-purple-200
        dark:bg-purple-500/12
        dark:text-purple-300
        dark:border-purple-500/25
      `;

    case 'review':
      return `
        bg-amber-50
        text-amber-700
        border border-amber-200
        dark:bg-amber-500/12
        dark:text-amber-300
        dark:border-amber-500/25
      `;

    case 'screening':
      return `
        bg-cyan-50
        text-cyan-700
        border border-cyan-200
        dark:bg-cyan-500/12
        dark:text-blue-300
        dark:border-blue-500/25
      `;

    default:
      return `
        bg-slate-100
        text-slate-700
        border border-slate-200
        dark:bg-white/8
        dark:text-white/70
        dark:border-white/10
      `;
  }
};

const EmployerDashboardPage = () => {
  const candidates = createCandidates();
  const applications = createApplications(
    jobs, candidates
  );
  const interviews = createInterviews(applications);

  const KPI_DATA = [
    {
      label: 'Active Jobs',
      value: jobs.length,
      icon: Briefcase,
    },
    {
      label: 'Total Applications',
      value: applications.length,
      icon: Users,
    },
    {
      label: 'Interviews Scheduled',
      value: interviews.length,
      icon: CalendarDays,
    },
    {
      label: 'Offers Extended',
      value: applications.filter((a) => a.status === 'Offer').length,
      icon: BadgeCheck,
    },
  ];

  const latestApplicationDate = new Date(
    Math.max(...applications.map((app) => new Date(app.appliedAt).getTime()))
  );

  const trendData = Array.from({ length: 30 }).map((_, i) => {
    const currentDate = new Date(latestApplicationDate);
    currentDate.setDate(currentDate.getDate() - (29 - i));

    const dateKey = currentDate.toISOString().split('T')[0];

    const count = applications.filter((app) => {
      const appliedDate = new Date(app.appliedAt)
        .toISOString()
        .split('T')[0];

      return appliedDate === dateKey;
    }).length;

    return {
      day: currentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      applications: count,
    };
  });

  const recentApplications = applications.slice(0, 8).map((app) => {
    const candidate = candidates.find((c) => c.id === app.candidateId);
    const job = jobs.find((j) => j.id === app.jobId);

    return {
      ...app,
      candidateName: candidate?.name ?? 'Unknown',
      jobTitle: job?.title ?? 'Unknown Role',
    };
  });

  const activeJobs = jobs
  .map((job) => {
    const count = applications.filter((a) => a.jobId === job.id).length;

    return {
      ...job,
      applicationsCount: count,
    };
  })
  .sort((a, b) => b.applicationsCount - a.applicationsCount)
  .slice(0, 5);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 px-3 py-5 sm:px-6 lg:px-8 dark:bg-[#0A0A0F] dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section
          className="
            relative overflow-hidden rounded-[2rem]
            border border-slate-200
            bg-gradient-to-br from-white to-slate-50
            p-6 sm:p-8 backdrop-blur-2xl
            shadow-[0_10px_40px_rgba(15,23,42,0.06)]
            dark:border-cyan-500/20
            dark:bg-[#0A0A0F]
            dark:bg-none
            dark:shadow-[0_0_40px_rgba(6,182,212,0.08)]
          "
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-cyan-300">
            Employer Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600 dark:text-white/60">
            Monitor hiring performance, review candidates, and manage job
            postings in one premium control center.
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {KPI_DATA.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 backdrop-blur-2xl shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] dark:border-cyan-400/20 dark:bg-white/[0.03] dark:shadow-[0_0_20px_rgba(6,182,212,0.08)] dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.14)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-purple-500/6 opacity-0 group-hover:opacity-100 transition" />

                <div className="relative flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-white/45">
                    {item.label}
                  </p>

                  <Icon className="text-cyan-600 dark:text-cyan-300" size={20} />
                </div>

                <h2 className="relative mt-5 text-4xl font-bold text-slate-900 dark:text-cyan-200">
                  {item.value}
                </h2>
              </div>
            );
          })}
        </section>

        {/* Chart + Quick Actions */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <div className="lg:col-span-2 rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
              Application Trends
            </h2>

            <div className="mt-6 h-[320px] w-full min-w-0">
              <DashboardChart trendData={trendData} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
              Quick Actions
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              {[
                {
                  label: 'Post New Job',
                  href: '/employer/jobs/create',
                },
                {
                  label: 'Review Applications',
                  href: '/employer/applications',
                },
                {
                  label: 'Manage Jobs',
                  href: '/employer/jobs',
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 backdrop-blur-xl shadow-[0_8px_24px_rgba(6,182,212,0.06)] hover:bg-cyan-100 transition-all duration-300 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/15 dark:shadow-[0_0_18px_rgba(6,182,212,0.05)] dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.12)]"
                >
                  <span>{action.label}</span>
                  <ArrowRight size={18} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Applications */}
        <section className="rounded-4xl border border-slate-200 bg-white transition-colors duration-300 p-6 backdrop-blur-xl overflow-x-auto no-scrollbar dark:border-white/10 dark:bg-transparent dark:hover:bg-cyan-500/5">
          <h2 className="text-2xl font-bold text-cyan-300">
            Recent Applications
          </h2>

          <table className="mt-6 w-full min-w-[700px] text-left">
            <thead>
              <tr className="text-slate-500 dark:text-white/50 text-sm border-b border-slate-200 dark:border-white/10">
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Job</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {recentApplications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-slate-100 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.02]"
                >
                  <td className="py-4">{app.candidateName}</td>
                  <td>{app.jobTitle}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/employer/applications/${app.id}`}
                      className="dark:text-cyan-400 text-cyan-500 hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Active Jobs */}
        <section className="rounded-[2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03] p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
            Active Jobs
          </h2>

          <div className="mt-6 grid gap-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-cyan-300 transition-all duration-300 dark:border-cyan-500/15 dark:bg-white/[0.03] dark:shadow-[0_0_18px_rgba(6,182,212,0.04)] dark:hover:border-cyan-400/25"
              >
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>

                  <p className="text-sm text-slate-500 dark:text-white/50">
                    {job.applicationsCount} applications • Posted{' '}
                    {new Date(job.postedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/employer/jobs/${job.id}/edit`}
                    className="rounded-xl border border-cyan-500/20 px-4 py-2 dark:text-cyan-300 text-cyan-500"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="rounded-xl bg-cyan-500/20 px-4 py-2 text-cyan-600 dark:text-cyan-200"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default EmployerDashboardPage