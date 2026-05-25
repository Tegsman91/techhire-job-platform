'use client';

import { companies, Job } from '@/lib/dummy-data';
import { useSavedJobsStore } from '@/lib/store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import Badge from '../ui/Badge';
import { Bookmark, MapPin, } from 'lucide-react';

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

const DesktopJobCard = ({ 
  job, 
  layout = "grid", 
  showBookmark = true,
  actionSlot,
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

  const isRemote = (job.location || "").toLowerCase() === "remote";

  const postedDaysAgo = useMemo(() => {
    return Math.floor(
      (new Date().getTime() - new Date(job.postedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }, [job.postedAt]);
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group h-full"
    >
       <Link href={`/jobs/${job.id}`}>
        <div
          className="
            relative rounded-2xl p-[1.5px] overflow-hidden
            bg-[length:200%_200%]
            bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500
            group-hover:animate-[gradientShift_3s_ease_infinite]
            transition-all duration-500
          "
        >
          <div
            className={`
              bg-[var(--surface-primary)] dark:bg-[#0A0A0F] rounded-2xl backdrop-blur-xl
              group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]
              transition-all duration-300 relative
              ${
                layout === "list"
                  ? "flex flex-row items-start gap-4 p-4 sm:p-5 h-full"
                  : "flex flex-col gap-4 p-5 sm:p-6 h-full"
              }
            `}
          >
            {/* LEFT / LOGO + BADGES */}
            <div className="flex items-start gap-2 shrink-0">
              <Image
                src={company.logo}
                alt={company.name}
                width={56}
                height={56}
                sizes="56px"
                priority={priority}
                placeholder="blur"
                blurDataURL="/placeholders/company-blur.jpg"
                className="rounded-xl bg-black/30 dark:bg-zinc-800 p-2"
                unoptimized
              />

              {(job.featured || job.urgent) && (
                <div className="flex flex-wrap gap-2">
                  {job.featured && (
                    <Badge variant="featured" size="sm">
                      Featured
                    </Badge>
                  )}

                  {job.urgent && (
                    <Badge variant="urgent" size="sm">
                      Urgent
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* CENTER / CONTENT */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-base sm:text-lg truncate">
                  {job.title}
                </h3>

                <p className="text-[var(--text-secondary)] text-sm">
                  {company.name}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {job.location}
                </span>

                {isRemote && (
                  <Badge variant="remote" size="sm">
                    Remote
                  </Badge>
                )}
              </div>

              <div className="mt-auto space-y-3">
                <p className="text-cyan-700 dark:text-cyan-400 font-medium text-sm">
                  {job.salary}
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="skill" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <p className="text-xs text-[var(--text-secondary)]">
                  {postedDaysAgo === 0
                    ? "Posted today"
                    : `${postedDaysAgo} day${postedDaysAgo > 1 ? "s" : ""} ago`}
                </p>

                {actionSlot && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="pt-2"
                  >
                    {actionSlot}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT / ACTIONS */}
            {showBookmark && (
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSavedJob(job.id);
                  }}
                  className={`
                    p-2 rounded-full transition
                    ${
                      isSaved
                        ? "bg-gray-500/30 text-gray-600 dark:bg-cyan-500/20 dark:text-cyan-400"
                        : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }
                  `}
                >
                  <Bookmark
                    size={18}
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default DesktopJobCard