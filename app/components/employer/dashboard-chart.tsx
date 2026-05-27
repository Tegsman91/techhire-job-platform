'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type TrendDataItem = {
  day: string;
  applications: number;
};

type DashboardChartProps = {
  trendData: TrendDataItem[];
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="
        rounded-2xl
        border border-zinc-200
        bg-white/95
        px-4 py-3
        shadow-xl
        backdrop-blur-xl
        dark:border-cyan-400/20
        dark:bg-[#0F1117]/95
        dark:shadow-[0_0_25px_rgba(6,182,212,0.12)]
      "
    >
      <p
        className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300"
      >
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
        {payload[0].value} applications
      </p>
    </div>
  );
};

const DashboardChart = ({ trendData }: DashboardChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={320} minWidth={0}>
      <LineChart data={trendData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(161,161,170,0.2)"
          className="dark:stroke-[rgba(255,255,255,0.08)]"
        />

        <XAxis
          dataKey="day"
          stroke="rgba(82,82,91,0.8)"
          className="dark:stroke-[rgba(255,255,255,0.4)]"
        />

        <YAxis
          stroke="rgba(82,82,91,0.8)"
          className="dark:stroke-[rgba(255,255,255,0.4)]"
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: '#06b6d4',
            strokeOpacity: 0.15,
          }}
        />

        <Line
          type="monotone"
          dataKey="applications"
          stroke="#06b6d4"
          strokeWidth={3}
          dot={{
            r: 3,
            strokeWidth: 2,
            fill: '#ffffff',
          }}
          activeDot={{
            r: 7,
            stroke: '#06b6d4',
            strokeWidth: 3,
            fill: '#ffffff',
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;