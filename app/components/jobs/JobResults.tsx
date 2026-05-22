'use client';

import { jobs } from "@/lib/dummy-data";
import { useJobFilters } from "@/lib/store";
import { useMemo, useEffect, useState, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import JobCard from "./job-card";
import CustomSelect from "../ui/Select";
import JobFilters from "./JobFilters";


const PAGE_SIZE = 10;

const parseSalary = (salary: string): number => {
  const upper = (salary.split("-")[1]?.trim() || salary).toUpperCase();

  if (upper.includes("M")) {
    return parseFloat(upper.replace(/[^\d.]/g, "")) * 1_000_000;
  }

  if (upper.includes("K")) {
    return parseFloat(upper.replace(/[^\d.]/g, "")) * 1_000;
  }

  return parseFloat(upper.replace(/[^\d.]/g, "")) || 0;
};

const JobResults = () => {
  const { filters, setFilter } = useJobFilters();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.toString();
  const searchQuery = searchParams.get("q") || "";

  const [page, setPage] = useState(1);
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(searchQuery);

  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;

    const qLoc = searchParams.get("loc") || "";
    const qSort = searchParams.get("sort") || "recent";

    if (qLoc && qLoc !== filters.location) {
      setFilter("location", qLoc);
    }

    if (qSort && qSort !== filters.sort) {
      setFilter("sort", qSort);
    }

    hydratedRef.current = true;
  }, [searchParams, filters.location, filters.sort, setFilter]);

  // ---------------- FILTERING ----------------
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Job Type
      if (filters.jobType.length && !filters.jobType.includes(job.jobType)) {
        return false;
      }

      // Search Query
      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false;
      }

      // Skills
      if (
        filters.skills.length &&
        !filters.skills.some((s) => job.skills.includes(s))
      ) {
        return false;
      }

      // Location
      if (
        filters.location &&
        !job.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Employment
      if (
        filters.employment.length &&
        !filters.employment.includes(job.employment)
      ) {
        return false;
      }

      // Experience
      if (
        filters.experience.length &&
        !filters.experience.includes(job.experience)
      ) {
        return false;
      }

      // Salary
      const maxSalary = parseSalary(job.salary);

      if (
        maxSalary < filters.salary[0] ||
        maxSalary > filters.salary[1]
      ) {
        return false;
      }

      // Posted filter
      if (filters.posted) {
        const MOCK_NOW = new Date("2026-04-01T00:00:00.000Z");
        const postedDate = new Date(job.postedAt);
        const diff =
          (MOCK_NOW.getTime() - postedDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (filters.posted === "24h" && diff > 1) return false;
        if (filters.posted === "week" && diff > 7) return false;
        if (filters.posted === "month" && diff > 30) return false;
      }

      return true;
    });
  }, [filters, searchQuery]);
  
  // ---------------- SORT ----------------
  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs];

    if (filters.sort === "recent") {
      return sorted.sort(
        (a, b) =>
          new Date(b.postedAt).getTime() -
          new Date(a.postedAt).getTime()
      );
    }

    if (filters.sort === "salary") {
      return sorted.sort((a, b) => {
        const getMax = (salary: string) => parseSalary(salary);

        return getMax(b.salary) - getMax(a.salary);
      });
    }

    return sorted;
  }, [filteredJobs, filters.sort]);

  // ---------------- PAGINATION ---------------
  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const paginatedJobs = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedJobs.slice(start, start + PAGE_SIZE);
  }, [sortedJobs, safePage]);

  // ---------------- DEBOUNCE LOCATION ----------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedLocation(filters.location);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters.location]);

   // ---------------- URL SYNC ----------------
  useEffect(() => {
    const params = new URLSearchParams(currentQuery);

    params.delete("skills");
    params.delete("type");
    params.delete("employment");
    params.delete("experience");
    params.delete("posted");
    params.delete("salaryMin");
    params.delete("salaryMax");
    params.delete("sort");

    filters.skills.forEach((s) => params.append("skills", s));
    filters.jobType.forEach((j) => params.append("type", j));
    filters.employment.forEach((e) => params.append("employment", e));
    filters.experience.forEach((ex) => params.append("experience", ex));

    if (debouncedLocation) {
      params.set("loc", debouncedLocation);
    } else {
      params.delete("loc");
    }

    if (filters.posted) {
      params.set("posted", filters.posted);
    }

    if (filters.sort) {
      params.set("sort", filters.sort);
    }

    if (filters.salary[0] > 0 || filters.salary[1] < 50000000) {
      params.set("salaryMin", filters.salary[0].toString());
      params.set("salaryMax", filters.salary[1].toString());
    }

    const nextQuery = params.toString();

    if (nextQuery !== currentQuery) {
      router.replace(`/jobs?${nextQuery}`);
    }
  }, [filters, debouncedLocation, currentQuery, router]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-4">
        {/* MOBILE SEARCH */}
        <div className="flex lg:hidden items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const params = new URLSearchParams(searchParams.toString());

                  if (mobileSearch.trim()) {
                    params.set("q", mobileSearch);
                  } else {
                    params.delete("q");
                  }

                  router.push(`/jobs?${params.toString()}`);
                }
              }}
              placeholder="Search jobs"
              className="
                w-full rounded-xl
                border border-white/10
                bg-[#101522]
                py-3 pl-11 pr-14
                text-sm text-white
                placeholder:text-gray-500
                outline-none
              "
            />

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="
                absolute right-2 top-1/2
                -translate-y-1/2
                rounded-lg
                bg-cyan-500
                p-2
                text-black
              "
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <p className="text-gray-300 mt-3 xl:mt-0 text-sm sm:text-base">
            {sortedJobs.length}+ jobs found
          </p>

          {/* DESKTOP CONTROLS */}
          <div className="hidden lg:flex flex-wrap gap-3">
            <CustomSelect
              value={filters.sort}
              onValueChange={(value) =>
                setFilter('sort', value)
              }
              options={[
                {
                  label: 'Most Recent',
                  value: 'recent',
                },
                {
                  label: 'Highest Salary',
                  value: 'salary',
                },
              ]}
            />

            <button
              onClick={() => setFilter("view", "grid")}
              className={`px-3 py-1 rounded-md text-sm transition
                ${filters.view === "grid"
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"}
              `}
            >
              Grid
            </button>

            <button
              onClick={() => setFilter("view", "list")}
              className={`px-3 py-1 rounded-md text-sm transition
                ${filters.view === "list"
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"}
              `}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      <Dialog.Root
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            className="
              fixed inset-0 z-40
              bg-black/60 backdrop-blur-sm
              data-[state=open]:animate-[fadeIn_200ms_ease-out]
              data-[state=closed]:animate-[fadeOut_200ms_ease-in]
            "
          />

          <Dialog.Content
            className="
              mobile-filter-scroll
              fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0A0A0F] p-5
              data-[state=open]:animate-[slideUp_300ms_ease-out]
              data-[state=closed]:animate-[slideDown_250ms_ease-in]
            "
          >
            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-white">
                Filters
              </Dialog.Title>

              <Dialog.Close className="text-sm text-gray-400">
                Close
              </Dialog.Close>
            </div>

            <Dialog.Description>
              <VisuallyHidden>
                Job filters modal
              </VisuallyHidden>
            </Dialog.Description>

            {/* SORT */}
            <div className="mb-5">
              <CustomSelect
                value={filters.sort}
                onValueChange={(value) =>
                  setFilter("sort", value)
                }
                options={[
                  {
                    label: "Most Recent",
                    value: "recent",
                  },
                  {
                    label: "Highest Salary",
                    value: "salary",
                  },
                ]}
              />
            </div>

            {/* VIEW TOGGLE */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setFilter("view", "grid")}
                className={`
                  flex-1 rounded-lg py-2 text-sm
                  ${
                    filters.view === "grid"
                      ? "bg-cyan-500 text-black"
                      : "bg-zinc-800 text-gray-400"
                  }
                `}
              >
                Grid
              </button>

              <button
                onClick={() => setFilter("view", "list")}
                className={`
                  flex-1 rounded-lg py-2 text-sm
                  ${
                    filters.view === "list"
                      ? "bg-cyan-500 text-black"
                      : "bg-zinc-800 text-gray-400"
                  }
                `}
              >
                List
              </button>
            </div>

            {/* FILTERS */}
            <JobFilters />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* JOB LIST */}
      {paginatedJobs.length === 0 ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-center text-gray-400 text-sm sm:text-base">
            No jobs found for selected filters.
          </p>
        </div>
      ) : (
        <div
          className={
            filters.view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr"
              : "flex flex-col gap-5 sm:gap-6"
          }
        >
          {paginatedJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                layout={filters.view}
                priority={index < 4}
              />
          ))}
        </div> 
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={safePage === 1}
          className="
            px-3 py-1 rounded-md text-sm
            bg-zinc-800 text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-zinc-700 transition
          "
        >
          Prev
        </button>

        {Array.from({ length: totalPages })
          .slice(Math.max(page - 2, 0), Math.min(page + 1, totalPages))
          .map((_, i) => {
            const pageNumber = Math.max(page - 2, 0) + i + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`
                  px-3 py-1 rounded-md text-sm transition
                  ${
                    safePage === pageNumber
                      ? "bg-cyan-500 text-black"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }
                `}
              >
                {pageNumber}
              </button>
            );
          })}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages || totalPages === 0}
          className="
            px-3 py-1 rounded-md text-sm
            bg-zinc-800 text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-zinc-700 transition
          "
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default JobResults