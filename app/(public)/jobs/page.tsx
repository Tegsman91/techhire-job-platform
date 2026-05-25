'use client';

import JobFilters from "@/app/components/jobs/JobFilters";
import JobResults from "@/app/components/jobs/JobResults";
import { Suspense, useEffect, useState } from "react";
import { useSavedJobsStore } from "@/lib/store";

const JobsPage = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      await Promise.all([
        useSavedJobsStore.persist.rehydrate(),
      ]);
      setHydrated(true);
    };

    hydrate();
  }, []);

  if (!hydrated) return null;

  return (
    <div className="max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
      <div className="flex lg:flex-row gap-6">
        <aside className="hidden lg:block lg:w-1/4 pr-6 border-r border-black/20 dark:border-white/5">
          <JobFilters />
        </aside>

        <main className="w-full lg:w-3/4">
          <Suspense fallback={<div className="text-white">Loading jobs...</div>}>
            <JobResults />
          </Suspense>
        </main>

      </div>
    </div>
  );
};

export default JobsPage;