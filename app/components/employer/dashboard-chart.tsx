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
    <div className="rounded-2xl border border-cyan-400/20 bg-[#0F1117]/95 px-4 py-3 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.12)]">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-white">
        {payload[0].value} applications
      </p>
    </div>
  );
};

const DashboardChart = ({ trendData }: DashboardChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={320} minWidth={0}>
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" />
        <YAxis stroke="rgba(255,255,255,0.4)" />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#06b6d4', strokeOpacity: 0.2 }}
        />
        <Line
          type="monotone"
          dataKey="applications"
          stroke="#22d3ee"
          strokeWidth={4}
          dot={{ r: 3, strokeWidth: 2 }}
          activeDot={{
            r: 8,
            stroke: '#22d3ee',
            strokeWidth: 3,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DashboardChart