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
    <section
      className="
        min-w-0 rounded-[2rem]
        border border-zinc-200
        bg-white/90
        p-6
        shadow-sm
        backdrop-blur-xl

        dark:border-white/10
        dark:bg-white/[0.04]
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="
              text-2xl font-bold
              text-zinc-900
              dark:text-white
            "
          >
            Application Status
          </h2>

          <p
            className="
              mt-1 text-sm
              text-zinc-500
              dark:text-white/50
            "
          >
            Track hiring pipeline performance
          </p>
        </div>
      </div>

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
                stroke="none"
              />

              <Tooltip
                contentStyle={{
                  background:
                    'rgba(255,255,255,0.96)',
                  border:
                    '1px solid rgba(228,228,231,1)',
                  borderRadius: '16px',
                  color: '#18181b',
                  boxShadow:
                    '0 10px 30px rgba(0,0,0,0.08)',
                }}
                labelStyle={{
                  color: '#71717a',
                }}
                itemStyle={{
                  color: '#18181b',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="
              flex items-center gap-2
              rounded-full
              border border-zinc-200
              bg-zinc-50
              px-3 py-1.5
              text-sm text-zinc-700

              dark:border-white/10
              dark:bg-white/[0.04]
              dark:text-white/70
            "
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />

            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ApplicationsChart;