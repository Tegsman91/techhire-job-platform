'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Clock3, Handshake, Trash2 } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { ApplicationItem, useApplicationsStore } from '@/lib/store';
import clsx from 'clsx';
import CustomSelect from '@/app/components/ui/Select';

type Accent = 'cyan' | 'yellow' | 'purple' | 'green';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: Accent;
};

const statusFlow = ['Applied', 'Screening', 'Interview', 'Offer'];
const tabs = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const tabStyles: Record<string, string> = {
  All: 'bg-white/5 text-white border-white/10',
  Applied: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  Screening: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Interview: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Offer: 'bg-green-500/15 text-green-400 border-green-500/30',
  Rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const ApplicationDashboardPage = () => {
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const applications = useApplicationsStore((state) => state.applications);
  const withdrawApplication = useApplicationsStore((state) => state.withdrawApplication);

  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('Most Recent');

  const filteredApplications = useMemo(() => {
    let data = [...applications];

    if (activeTab !== 'All') {
      data = data.filter((app) => app.status === activeTab);
    }

    if (sortBy === 'Oldest') {
      data.sort(
        (a, b) =>
          new Date(a.appliedAt).getTime() -
          new Date(b.appliedAt).getTime()
      );
    } else if (sortBy === 'Status') {
      data.sort((a, b) => a.status.localeCompare(b.status));
    } else {
      data.sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() -
          new Date(a.appliedAt).getTime()
      );
    }

    return data;
  }, [applications, activeTab, sortBy]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => ['Applied', 'Screening'].includes(a.status)).length,
    interviews: applications.filter((a) => a.status === 'Interview').length,
    offers: applications.filter((a) => a.status === 'Offer').length,
  };

  useEffect(() => {
    const hydrate = async () => {
      try {
        await Promise.all([
          useApplicationsStore.persist.rehydrate(),
        ]);
      } catch (err) {
        console.error('Error rehydrating applications store:', err);
        setError('Failed to load applications. Please refresh the page.');
      } finally {
        setHydrated(true);
      }
    };

    hydrate();
  }, []);
  
  if (!hydrated) return <div className="min-h-screen bg-[#0A0A0F] text-white px-3 sm:px-6 py-6 sm:py-8 flex items-center justify-center">
    <p>Loading applications...</p>
  </div>;

  if (error) return <div className="min-h-screen bg-[#0A0A0F] text-white px-3 sm:px-6 py-6 sm:py-8 flex items-center justify-center">
    <p className="text-red-400">{error}</p>
  </div>;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-3 sm:px-6 py-6 sm:py-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            My Applications
          </h1>
          <p className="text-gray-400 mt-2">
            Track your job applications in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:grid-cols-4 sm:gap-4"
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

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "rounded-2xl border px-4 py-2 text-sm font-medium transition-all",
                tabStyles[tab],
                activeTab === tab &&
                  "scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.12)]"   
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex justify-start sm:justify-end">
          <CustomSelect
            label="Sort by"
            value={sortBy}
            onValueChange={setSortBy}
            options={[
              {
                label: "Most Recent",
                value: "Most Recent",
              },
              {
                label: "Oldest",
                value: "Oldest",
              },
              {
                label: "Status",
                value: "Status",
              },
            ]}
          />
        </div>

        {filteredApplications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-12 text-center"
          >
            <h2 className="text-2xl font-semibold">
              No applications yet
            </h2>
            <p className="text-gray-400 mt-2">
              Start exploring roles that match your skills.
            </p>
            <Link href="/jobs" className="inline-block mt-6">
              <Button size="lg">Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map((app: ApplicationItem) => (
              <div key={app.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {app.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {app.companyName}
                    </p>
                    <p className="text-gray-400">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full border text-sm ${tabStyles[app.status]}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-5">
                  {statusFlow.map((step, idx) => {
                    const reached = statusFlow.indexOf(app.status) >= idx;
                    return (
                      <div key={step} className="flex items-center gap-2 flex-1">
                        <div className={`h-2 flex-1 rounded-full ${reached ? 'bg-cyan-400' : 'bg-white/10'}`} />
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6"
                >
                  <Link href={`/dashboard/applications/${app.id}`}>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                    >
                      View Job
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => {
                      if (confirm('Withdraw this application?')) {
                        withdrawApplication(app.id);
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    Withdraw Application
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationDashboardPage

function StatCard({ icon, label, value, accent }: StatCardProps) {
  const accentMap: Record<Accent, string> = {
    cyan: "text-cyan-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    green: "text-green-400",
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl bg-white/10 p-4 sm:p-5",
        "shadow-[0_0_20px_rgba(255,255,255,0.04)]",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-semibold">
            {label}
          </p>

          <h3 className={clsx("mt-2 text-2xl sm:text-3xl font-bold", accentMap[accent])}
          >
            {value}
          </h3>
        </div>

        <div className={clsx("rounded-2xl bg-white/10 p-3", accentMap[accent])}>
          {icon}
        </div>
      </div>
    </div>
  );
}