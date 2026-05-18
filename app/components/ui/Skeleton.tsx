import clsx from 'clsx';
import React from 'react'

export type SkeletonVariant = "text" | "card" | "avatar" | "job-card";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  className?: string;
}

const baseStyles =
  "relative overflow-hidden rounded-md bg-[#27272A] border border-white/5";

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  avatar: "h-10 w-10 rounded-full",
  card: "h-40 w-full rounded-xl",
  "job-card": "h-40 w-full rounded-xl",
};

const shimmer =
  "before:content-[''] before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-cyan-400/10 before:to-transparent before:bg-[length:200%_100%] before:animate-shimmer";


const scanline =
  "after:content-[''] after:pointer-events-none after:absolute after:left-0 after:top-[-20%] after:w-full after:bg-gradient-to-r after:from-transparent after:via-cyan-400 after:to-transparent after:h-[2px] after:shadow-[0_0_12px_#06B6D4] after:animate-scanline";


const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        shimmer,
        scanline,
        className
      )}
      {...props}
    />
  )
}

export const SkeletonTextBlock = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={clsx(i === lines - 1 && "w-2/3")}
      />
    ))}
  </div>
);

export const SkeletonAvatarRow = () => (
  <div className="flex items-center gap-3">
    <Skeleton variant="avatar" />
    <div className="flex-1">
      <SkeletonTextBlock lines={2} />
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="p-4 rounded-xl bg-[#18181B] border border-white/5 space-y-4">
    <Skeleton variant="card" />
    <SkeletonTextBlock lines={3} />
  </div>
);

export const SkeletonJobCard = () => (
  <div className="p-4 rounded-xl bg-[#18181B] border border-white/5 space-y-3"
  >
    <div className="flex items-center justify-between">
      <Skeleton variant="avatar" />
      <Skeleton className="h-4 w-16" />
    </div>
    <SkeletonTextBlock lines={2} />
    <div className="flex gap-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

export default Skeleton
