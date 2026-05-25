'use client';

import { LucideIcon } from "lucide-react";

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const StepCard = ({ icon: Icon, title, description }: StepCardProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="
        w-14 h-14 rounded-full
        flex items-center justify-center
        bg-[var(--surface-primary)]
        border border-[var(--border-primary)]
        shadow-[0_0_20px_rgba(6,182,212,0.3)]
      ">
        <Icon className="text-cyan-400" />
      </div>

      <h3 className="text-[var(--text-primary)] font-semibold">
        {title}
      </h3>

      <p className="text-sm text-[var(--text-secondary)] max-w-[12.5rem]">
        {description}
      </p>
    </div>
  );
};

export default StepCard;