'use client';

import CustomSelect from '@/app/components/ui/Select';
import { jobs, ExperienceLevel, locations } from '@/lib/dummy-data';
import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';


const parseSalary = (salary: string): number => {
  const upper = (salary.split('-')[1]?.trim() || salary).toUpperCase();

  if (upper.includes('M')) {
    const value = parseFloat(upper.replace(/[^\d.]/g, ''));

    return isNaN(value) ? 0 : value * 1_000_000;
  }

  if (upper.includes('K')) {
    return parseFloat(upper.replace(/[^\d.]/g, '')) * 1_000;
  }

  return Number(upper.replace(/[^\d]/g, ''));
};

const SalaryInsightsPage = () => {
  const [roleFilter, setRoleFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceLevel | 'All'>('All');
  
  const [locationFilter, setLocationFilter] = useState('All');

  const [estimateRole, setEstimateRole] = useState('Frontend Engineer');
  const [estimateYears, setEstimateYears] = useState(2);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (roleFilter !== 'All' && job.title !== roleFilter) return false;
      if (experienceFilter !== 'All' && job.experience !== experienceFilter) return false;
      if (locationFilter !== 'All' && job.location !== locationFilter) return false;
      return true;
    });
  }, [roleFilter, experienceFilter, locationFilter]);

  const barData = useMemo(() => {
    const grouped = filteredJobs.reduce((acc, job) => {
      if (!acc[job.title]) {
        acc[job.title] = {
          salaries: [],
          ranges: new Set<string>(),
        };
      }

      acc[job.title].salaries.push(parseSalary(job.salary));
      acc[job.title].ranges.add(job.salary);

      return acc;
    }, {} as Record<string, { salaries: number[]; ranges: Set<string> }>);

    return Object.entries(grouped).map(([role, data]) => ({
      role,
      avgSalary: Math.round(
        data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length
      ),
      range: Array.from(data.ranges)[0],
    }));
  }, [filteredJobs]);

  const lineData = [
    { year: 1, salary: 400000 },
    { year: 2, salary: 650000 },
    { year: 3, salary: 900000 },
    { year: 4, salary: 1300000 },
    { year: 5, salary: 1800000 },
  ];

  const estimatedSalary = useMemo(() => {
    const match = jobs.find((job) => job.title === estimateRole);
    if (!match) return 0;

    const base = parseSalary(match.salary);
    return base + estimateYears * 150000;
  }, [estimateRole, estimateYears]);
  
  return (
    <div
      className="
        min-h-screen overflow-x-hidden bg-gradient-to-br
        from-[#F8FAFC] via-[#EEF2FF] to-[#E2E8F0]
        dark:from-[#050510] dark:via-[#0A0A14] dark:to-[#101826]
        text-zinc-900 dark:text-white
        px-4 sm:px-6 py-8 transition-colors duration-300
      "
    >
      <div className="w-full max-w-7xl mx-auto space-y-10"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Salary Insights
          </h1>
          <p className="text-zinc-600 dark:text-gray-400 mt-2">
            Explore realistic salary trends across roles, locations, and experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <CustomSelect
            value={roleFilter}
            onValueChange={setRoleFilter}
            options={[
              { label: 'All', value: 'All' },
              ...[...new Set(jobs.map((j) => j.title))].map((role) => ({
                label: role,
                value: role,
              })),
            ]}
          />

          <CustomSelect
            value={experienceFilter}
            onValueChange={(value) =>
              setExperienceFilter(value as ExperienceLevel | 'All')
            }
            options={[
              { label: 'All', value: 'All' },
              { label: 'Junior', value: 'Junior' },
              { label: 'Mid', value: 'Mid' },
              { label: 'Senior', value: 'Senior' },
              { label: 'Lead', value: 'Lead' },
            ]}
          />

          <CustomSelect
            value={locationFilter}
            onValueChange={setLocationFilter}
            options={[
              { label: 'All', value: 'All' },
              ...locations.map((loc) => ({
                label: loc,
                value: loc,
              })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div 
            className="
              rounded-3xl border border-zinc-200
              dark:border-cyan-500/20 bg-white/5 
              backdrop-blur-xl p-6 
              shadow-[0_10px_40px_rgba(0,0,0,0.06)]
              dark:shadow-[0_0_30px_rgba(6,182,212,0.12)]
              transition-colors duration-300
              min-w-0 w-full max-w-full overflow-hidden
            "
          >
            <h2 className="text-xl font-semibold mb-4">
              Average Salary by Role   
            </h2>

            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="w-full min-w-0">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} barCategoryGap="25%">
                    <XAxis dataKey="role" hide />
                    <YAxis />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      contentStyle={{
                        backgroundColor:
                          typeof document !== "undefined" &&
                          document.documentElement.classList.contains("dark")
                            ? "#111827"
                            : "#ffffff",

                        border:
                          typeof document !== "undefined" &&
                          document.documentElement.classList.contains("dark")
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(0,0,0,0.08)",

                        borderRadius: "12px",

                        color:
                          typeof document !== "undefined" &&
                          document.documentElement.classList.contains("dark")
                            ? "#fff"
                            : "#18181b",
                      }}
                    />
                    <Bar
                      dataKey="avgSalary"
                      radius={[10, 10, 0, 0]}
                      barSize={50}
                      fill="rgba(34,211,238,0.8)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div 
            className="
              rounded-3xl border border-zinc-200
              dark:border-cyan-500/20 bg-white/5 
              backdrop-blur-xl p-6 
              shadow-[0_10px_40px_rgba(0,0,0,0.06)]
              dark:shadow-[0_0_30px_rgba(6,182,212,0.12)]
              transition-colors duration-300
              min-w-0
            "
          >
            <h2 className="text-xl font-semibold mb-4">
              Salary Growth
            </h2>

            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="w-full min-w-[320px]">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      contentStyle={{
                        backgroundColor:
                          typeof document !== "undefined" &&
                          document.documentElement.classList.contains("dark")
                            ? "#111827"
                            : "#ffffff",

                        border:
                          typeof document !== "undefined" &&
                          document.documentElement.classList.contains("dark")
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(0,0,0,0.08)",

                        borderRadius: "12px",

                        color:
                          typeof document !== "undefined" &&
                          document.documentElement.classList.contains("dark")
                            ? "#fff"
                            : "#18181b",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="salary"
                      stroke="rgba(168,85,247,0.9)"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        
        <div
          className="
            rounded-2xl p-6 overflow-x-auto
            bg-white dark:bg-zinc-900
            border border-zinc-200 dark:border-zinc-800
            shadow-sm dark:shadow-none
            transition-colors duration-300
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            Salary Comparison
          </h2>

          <div className="overflow-x-auto w-full">
            <table className="min-w-[650px] w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="text-zinc-500 dark:text-gray-400 border-b border-zinc-200 dark:border-zinc-700">
                  <th className="pb-3">Role</th>
                  <th>Average</th>
                  <th>Range</th>
                </tr>
              </thead>
              <tbody>
                {barData.map((row) => (
                  <tr 
                    key={row.role} 
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="py-3">{row.role}</td>
                    <td>₦{row.avgSalary.toLocaleString()}</td>
                    <td>{row.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div 
          className="
            rounded-3xl border border-zinc-200
            dark:border-cyan-500/20 bg-white/5 
            backdrop-blur-xl p-6 
            shadow-[0_10px_40px_rgba(0,0,0,0.06)]
            dark:shadow-[0_0_30px_rgba(6,182,212,0.12)]
            transition-colors duration-300
            space-y-4
          "
        >
          <h2 className="text-xl font-semibold">
            Your Estimated Salary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <CustomSelect
              value={estimateRole}
              onValueChange={setEstimateRole}
              options={[
                ...[...new Set(jobs.map((j) => j.title))].map((role) => ({
                  label: role,
                  value: role,
                })),
              ]}
            />

            <input
              type="number"
              min={0}
              aria-label="Years of experience"
              value={estimateYears}
              onChange={(e) => setEstimateYears(Math.max(0, Number(e.target.value) || 0))}
              className="
                rounded-2xl
                border border-zinc-200 dark:border-white/10
                bg-white dark:bg-white/5
                px-4 py-3
                backdrop-blur-md
                text-zinc-900 dark:text-white
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                focus:outline-none
                focus:ring-2 focus:ring-purple-600/50
                transition-colors duration-300
              "
            />
          </div>

          <div className="text-3xl font-bold text-cyan-400">
            ₦{estimatedSalary.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryInsightsPage