"use client";

import { Bookmark, Share2 } from "lucide-react";
import { useSavedJobsStore } from "@/lib/store";

export default function JobActions({ jobId }: { jobId: string }) {
  const { savedJobs, toggleSavedJob } = useSavedJobsStore();

  const isSaved = savedJobs.includes(jobId);

  return (
    <div className="flex gap-3">
      <button 
        type="button"
        onClick={() => toggleSavedJob(jobId)} 
        aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
      >
        <Bookmark fill={isSaved ? "currentColor" : "none"} />
      </button>

      <button
        onClick={() => navigator.clipboard.writeText(window.location.href)}
        aria-label="Copy link to clipboard"
      >
        <Share2 />
      </button>
    </div>
  );
}