'use client';

import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useApplicationsStore } from '@/lib/store';

const ApplicationsChart = () => {
  const applications = useApplicationsStore(
    (state) => state.applications || []
  );

  const data = [
    {
      name: 'Applied',
      value: applications.filter(
        (a) => a.status === 'Applied'
      ).length,
      fill: '#22d3ee',
    },
    {
      name: 'Interview',
      value: applications.filter(
        (a) => a.status === 'Interview'
      ).length,
      fill: '#a855f7',
    },
    {
      name: 'Offer',
      value: applications.filter(
        (a) => a.status === 'Offer'
      ).length,
      fill: '#10b981',
    },
    {
      name: 'Rejected',
      value: applications.filter(
        (a) => a.status === 'Rejected'
      ).length,
      fill: '#ef4444',
    },
  ];

  return (
    <section className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-bold">
        Application Status
      </h2>

      <div className="min-w-0 overflow-hidden">
        <div className="mt-6 h-[280px] sm:h-[320px] w-full min-w-0">
          <ResponsiveContainer
            width="99%"
            height={320}
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
              />

              <Tooltip
                contentStyle={{
                  background: '#0B1120',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: 'white',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default ApplicationsChart;