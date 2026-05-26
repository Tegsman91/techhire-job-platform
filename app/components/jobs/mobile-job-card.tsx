'use client';

import { companies, Job } from '@/lib/dummy-data';
import { useSavedJobsStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Bookmark, BriefcaseBusiness, Clock3, MapPin, } from 'lucide-react';

interface JobCardProps {
  job: Job & {
    featured?: boolean;
    urgent?: boolean;
  };
  layout?: "grid" | "list";
  showBookmark?: boolean;
  actionSlot?: React.ReactNode;
  priority?: boolean;
}

const MobileJobCard = ({ 
  job, 
  showBookmark = true,
  priority = false,
}: JobCardProps) => {
  const { savedJobs, toggleSavedJob } = useSavedJobsStore();

  const company =
    companies.find((c) => c.id === job.companyId) ?? {
      id: 'unknown',
      name: 'Unknown Company',
      logo: '',
    };
  const isSaved = savedJobs.includes(job.id);

  const postedDaysAgo = useMemo(() => {
    return Math.floor(
      (new Date().getTime() - new Date(job.postedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }, [job.postedAt]);

  return (
    <Link href={`/jobs/${job.id}`}>
      <div
        className="
          relative overflow-hidden
          rounded-2xl
          border border-black/10 dark:border-white/5
          bg-white dark:bg-[#101522]
          px-4 py-4
          min-h-[185px]
          flex flex-col
          justify-between
          transition-all duration-200
          active:scale-[0.99]
          shadow-sm dark:shadow-none
        "
      >
        {/* TOP */}
        <div className="flex items-start gap-3">
          
          {/* LOGO */}
          <div
            className="
              shrink-0
              rounded-xl
              border border-black/10 dark:border-white/5
              bg-black/[0.1] dark:bg-[#161B26]
              p-2
            "
          >
            <Image
              src={company.logo}
              alt={company.name}
              width={32}
              height={32}
              priority={priority}
              className="rounded-lg"
              unoptimized
            />
          </div>

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            
            {/* TITLE */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="overflow-hidden text-[15px] font-semibold leading-tight text-[var(--text-primary)] line-clamp-2"
                >
                  {job.title}
                </h3>

                <p className="mt-2 text-sm text-cyan-600 dark:text-cyan-400">
                  {company.name}
                </p>
              </div>

              {/* BOOKMARK */}
              {showBookmark && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSavedJob(job.id);
                  }}
                  className="
                    shrink-0 rounded-full p-1.5
                    text-[var(--text-secondary)]
                    hover:bg-black/[0.05]
                    dark:hover:bg-white/[0.05]
                    transition active:scale-95
                  "
                >
                  <Bookmark
                    size={18}
                    fill={
                      isSaved
                        ? 'currentColor'
                        : 'none'
                    }
                    className={
                      isSaved
                        ? 'text-cyan-400'
                        : ''
                    }
                  />
                </button>
              )}
            </div>

            {/* META */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-secondary)]"
            >
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {job.location}
              </span>

              <span className="flex items-center gap-1">
                <Clock3 size={12} />

                {postedDaysAgo === 0
                  ? 'Today'
                  : `${postedDaysAgo}d ago`}
              </span>

              <span className="flex items-center gap-1">
                <BriefcaseBusiness size={12} />
                20 applicants
              </span>
            </div>

            {/* BADGES */}
            <div className="mt-3 flex flex-wrap gap-2">

              {job.skills
                .slice(0, 3)
                .map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-md
                      bg-black/[0.05] dark:bg-white/[0.06]
                      px-2 py-1
                      text-[10px]
                      font-medium
                      text-[var(--text-secondary)]
                    "
                  >
                    {skill}
                  </span>
                ))}
            </div>

            {/* SALARY */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {job.salary}
              </p>

              <span className="text-[11px] text-cyan-500 dark:text-cyan-600">
                Easy Apply
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MobileJobCard