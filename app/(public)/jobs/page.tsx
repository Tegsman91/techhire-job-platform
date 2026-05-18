'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SlidersHorizontal } from "lucide-react";
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

      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden mb-6">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-500 text-black">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay 
              className="
              fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
              data-[state=open]:animate-[fadeIn_0.3s]
              data-[state=closed]:animate-[fadeOut_0.3s]"
            />

            <Dialog.Content
              className="
                fixed bottom-0 left-0 right-0 z-50
                bg-[#0A0A0F]
                rounded-t-2xl
                p-5
                max-h-[85vh]
                overflow-y-auto
                data-[state=open]:animate-[slideUp_0.3s_ease-out]
                data-[state=closed]:animate-[slideDown_0.3s_ease-in]"
            >
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title>
                  <VisuallyHidden>Filters</VisuallyHidden>
                </Dialog.Title>

                <Dialog.Close className="text-gray-400">
                  Close
                </Dialog.Close>
              </div>

              <Dialog.Description>
                <VisuallyHidden>
                  Filter job listings by category, salary, and more
                </VisuallyHidden>
              </Dialog.Description>

              <JobFilters />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="flex lg:flex-row gap-6">
        <aside className="hidden lg:block lg:w-1/4 pr-6 border-r border-white/5">
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