'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployerJobsStore, EmployerJobItem } from '@/lib/store';
import clsx from 'clsx';
import Checkbox from '@/app/components/ui/Checkbox';
import Button from '@/app/components/ui/Button';
import { Eye, Pencil, X, Zap } from 'lucide-react';
import CustomSelect from '@/app/components/ui/Select';

const tabs = ['All', 'Active', 'Draft', 'Closed'] as const;
type SortOption = 'recent' | 'applications' | 'oldest';

const EmployerJobPage = () => {
  const router = useRouter();
  const employerJobs = useEmployerJobsStore((s) => s.employerJobs);
  const updateEmployerJob = useEmployerJobsStore((s) => s.updateEmployerJob);

  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('recent');
  const [selected, setSelected] = useState<string[]>([]);

  // FILTER + SEARCH + SORT
  const filteredJobs = useMemo(() => {
    let jobs = [...employerJobs];

    // Filter tab
    if (activeTab === 'Active') {
      jobs = jobs.filter((j) => j.status === 'published');
    } else if (activeTab === 'Draft') {
      jobs = jobs.filter((j) => j.status === 'draft');
    } else if (activeTab === 'Closed') {
      jobs = jobs.filter((j) => j.status === 'closed');
    }

    // Search
    jobs = jobs.filter((j) =>
      j.title.toLowerCase().includes(search.toLowerCase())
    );

    // Sort
    if (sort === 'recent') {
      jobs.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    } else if (sort === 'oldest') {
      jobs.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
    } else if (sort === 'applications') {
        jobs.sort((a, b) => 
          b.applicationsCount - a.applicationsCount
      );
    }

    return jobs;
  }, [employerJobs, activeTab, search, sort]);

  // 🔁 BULK ACTIONS
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const closeSelected = () => {
    selected.forEach((id) =>
      updateEmployerJob(id, { status: 'closed' })
    );
    setSelected([]);
  };

  const deleteSelected = () => {
    // simple remove (since no delete in store, simulate)
    selected.forEach((id) =>
      updateEmployerJob(id, { title: '[Deleted Job]' })
    );
    setSelected([]);
  };

  return (
    <main className="relative min-h-screen bg-[#0A0A0F] text-white p-4 md:p-6 overflow-hidden">

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-[500px] w-[500px] bg-cyan-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Manage Jobs
            </h1>
            <p className="text-white/50 mt-1">
              Track, edit, and optimize your job listings
            </p>
          </div>

          <input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-500/20 outline-none transition"
          />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm border transition",
                activeTab === tab
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  : "border-white/10 text-white/60 hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SORT + BULK */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <CustomSelect
            value={sort}
            onValueChange={(value) =>
              setSort(value as SortOption)
            }
            options={[
              {
                label: 'Recent',
                value: 'recent',
              },
              {
                label: 'Oldest',
                value: 'oldest',
              },
              {
                label: 'Applications',
                value: 'applications',
              },
            ]}
          />

          {selected.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={closeSelected}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300"
              >
                Close Selected
              </button>
              <button
                onClick={deleteSelected}
                className="px-4 py-2 rounded-xl bg-white/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* JOB LIST */}
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selected={selected.includes(job.id)}
              onSelect={() => toggleSelect(job.id)}
              onEdit={() => router.push(`/employer/jobs/new?edit=${job.id}`)}
              onView={() => router.push(`/jobs/${job.id}`)}
              onClose={() =>
                updateEmployerJob(job.id, { status: 'closed' })
              }
            />
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-16 text-white/40">
              <p className="text-lg">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting filters or create a new job</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default EmployerJobPage

function JobCard({
  job,
  selected,
  onSelect,
  onEdit,
  onView,
  onClose,
}: {
  job: EmployerJobItem;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onView: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="
        group relative rounded-2xl border border-white/10
        bg-white/[0.03] p-4 sm:p-5
        flex flex-col md:flex-row
        md:items-center md:justify-between
        gap-5 overflow-hidden
      "
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.15),transparent_60%)]" />

      {/* LEFT */}
      <div className="flex items-start md:items-center gap-3">
        <div className="mt-1.5 mr-1">
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold break-words">
            {job.title}
          </h3>

          <span
            className={clsx(
              "px-3 py-1 mt-1 rounded-full text-xs font-medium capitalize",
              job.status === "published" && "bg-green-500/20 text-green-300",
              job.status === "draft" && "bg-yellow-500/20 text-yellow-300",
              job.status === "closed" && "bg-red-500/30 text-red-300"
            )}
          >
            {job.status}
          </span>

          <p className="text-sm text-white/50 mt-2">
            Posted {new Date(job.createdAt).toDateString()}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/50">
            <span>👁 {job.viewsCount} views</span>
            <span>📄 {job.applicationsCount} applications</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onEdit} 
          leftIcon={<Pencil size={14} />}
        >
          Edit
        </Button>

        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onView} 
          leftIcon={<Eye size={14} />}
        >
          View
        </Button>

        <Button 
          size="sm" 
          variant="danger" 
          onClick={onClose} 
          leftIcon={<X size={14} />}
        >
          Close
        </Button>

        <Button 
          size="sm" 
          variant="secondary" 
          leftIcon={<Zap size={14} />}
        >
          Boost
        </Button>
      </div>
    </div>
  );
}