'use client';

import { Job } from '@/lib/dummy-data';
import DesktopJobCard from './desktop-job-card';
import MobileJobCard from './mobile-job-card';

interface JobCardProps {
  job: Job;
  layout?: "grid" | "list";
  showBookmark?: boolean;
  actionSlot?: React.ReactNode;
  priority?: boolean;
}

const JobCard = (props: JobCardProps) => {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <MobileJobCard {...props} />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <DesktopJobCard {...props} />
      </div>
    </>
  );
};

export default JobCard;