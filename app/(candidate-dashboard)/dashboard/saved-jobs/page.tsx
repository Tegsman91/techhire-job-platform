'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookmarkCheck, Search, SlidersHorizontal } from 'lucide-react';
import {
  useSavedJobsStore,
} from '@/lib/store';
import { jobs } from '@/lib/dummy-data';
import JobCard from '@/app/components/jobs/job-card';
import ApplicationModal from "@/app/components/application/application-modal";
import CustomSelect from '@/app/components/ui/Select';

const SavedJobsPage = () => {
  const savedJobs = useSavedJobsStore(
    (state) => state.savedJobs
  );

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [selectedLocation, setSelectedLocation] =
    useState('All');

  const [sortBy, setSortBy] = useState(
    'recent'
  );

  const extractSalary = (
    salary: string
  ) => {
    const match =
      salary.match(/\d+(\.\d+)?/);

    return match
      ? Number(match[0])
      : 0;
  };

  const savedJobsData = useMemo(() => {
    let filtered = jobs.filter((job) =>
      savedJobs.includes(job.id)
    );

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (job) =>
          job.category === selectedCategory
      );
    }

    if (selectedLocation !== 'All') {
      filtered = filtered.filter(
        (job) =>
          job.location === selectedLocation
      );
    }
    
    if (sortBy === 'salary') {
      filtered = [...filtered].sort(
        (a, b) =>
          extractSalary(b.salary) -
          extractSalary(a.salary)
      );
    }

    if (sortBy === 'recent') {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.postedAt).getTime() -
          new Date(a.postedAt).getTime()
      );
    }

    return filtered;
  }, [
    savedJobs,
    selectedCategory,
    selectedLocation,
    sortBy,
  ]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#070B14] px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <BookmarkCheck className="text-cyan-400" />

                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                  Saved Jobs
                </p>
              </div>

              <h1 className="mt-4 text-2xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Your Saved Opportunities
              </h1>

              <p className="mt-3 max-w-2xl text-white/60">
                Track jobs you want to apply for and revisit opportunities tailored to your career goals.
              </p>
            </div>

            <div className="w-full rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5 text-center backdrop-blur-xl sm:w-fit sm:min-w-[180px]">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
                Total Saved
              </p>

              <h2 className="mt-3 text-5xl font-black text-cyan-300">
                {savedJobs.length}
              </h2>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-cyan-400" />

              <h2 className="text-2xl font-bold">
                Filter & Sort
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CustomSelect
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                options={[
                  {
                    label: 'All Categories',
                    value: 'All',
                  },
                  {
                    label: 'Frontend',
                    value: 'Frontend',
                  },
                  {
                    label: 'Backend',
                    value: 'Backend',
                  },
                  {
                    label: 'Design',
                    value: 'Design',
                  },
                ]}
              />

              <CustomSelect
                value={selectedLocation}
                onValueChange={setSelectedLocation}
                options={[
                  {
                    label: 'All Locations',
                    value: 'All',
                  },
                  {
                    label: 'Remote',
                    value: 'Remote',
                  },
                  {
                    label: 'Lagos',
                    value: 'Lagos',
                  },
                  {
                    label: 'London',
                    value: 'London',
                  },
                ]}
              />

              <CustomSelect
                value={sortBy}
                onValueChange={setSortBy}
                options={[
                  {
                    label: 'Most Recent',
                    value: 'recent',
                  },
                  {
                    label: 'Salary High-Low',
                    value: 'salary',
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* EMPTY STATE */}
        {savedJobsData.length === 0 ? (
          <section className="mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-xl sm:min-h-[420px] sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10">
              <Search
                size={40}
                className="text-cyan-300"
              />
            </div>

            <h2 className="mt-8 text-3xl font-black">
              No saved jobs yet
            </h2>

            <p className="mt-4 max-w-lg text-white/60">
              Start exploring opportunities and save jobs to quickly revisit them later.
            </p>

            <Link
              href="/jobs"
              className="mt-8 rounded-[1.5rem] bg-cyan-400 px-6 py-4 font-bold text-black transition-all duration-300 hover:scale-[1.02]"
            >
              Browse Jobs
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {savedJobsData.map((job) => (
              <div key={job.id}>
                {/* REMOVE BOOKMARK */}
                <JobCard
                  job={job}
                  actionSlot={
                    <ApplicationModal 
                      jobTitle={job.title} 
                      jobId={job.id}
                    />
                  }
                />
              </div>
            ))}
          </section>
           )}
      </div>
    </main>
  );
}

export default SavedJobsPage
