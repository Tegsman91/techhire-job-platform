'use client';

import DashboardHeader from '@/app/components/dashboard/dashboard-header';
import StatsCards from '@/app/components/dashboard/stats-cards';
import ApplicationsChart from '@/app/components/dashboard/applications-chart';
import RecommendedJobs from '@/app/components/dashboard/recommended-jobs';
import RecentActivity from '@/app/components/dashboard/recent-activity';
import QuickActions from '@/app/components/dashboard/quick-actions';

const DashboardPage = () => {
  return (
    <main className="relative min-h-screen bg-[#070B14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 xl:py-10 space-y-7">
        <DashboardHeader />

        <StatsCards />

        <div className="grid min-w-0 gap-4 sm:gap-6 xl:gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="min-w-0">
            <ApplicationsChart />
            
          </div>

          <div className="min-w-0">
            <QuickActions />
          </div>
        </div>

        <RecommendedJobs />

        <RecentActivity />
      </div>
    </main>
  );
};

export default DashboardPage;