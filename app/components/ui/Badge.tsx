'use client';

import { clsx } from "clsx";
import { ReactNode } from "react";


type BadgeVariant = "skill" | "remote" | "urgent" | "new" | "featured";
type Size = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: Size;
  icon?: ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const baseStyles =
  `
    inline-flex items-center gap-1.5
    rounded-full border
    font-mono
    transition-all duration-200
    backdrop-blur-sm
    shadow-sm dark:shadow-none
  `;

const sizeStyles: Record<Size, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
};

// const variantStyles: Record<BadgeVariant, string> = {
//   skill:
//     "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30 hover:shadow-[0_0_8px_rgba(34,211,238,0.5)]",

//   remote:
//     "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 hover:shadow-[0_0_8px_rgba(34,197,94,0.5)]",

//   urgent:
//     "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30 animate-pulse hover:shadow-[0_0_10px_rgba(239,68,68,0.7)]",

//   new:
//     "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-yellow-300 border-yellow-500/30 hover:shadow-[0_0_8px_rgba(250,204,21,0.6)]",

//   featured:
//     "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-purple-300 border-purple-500/30 shadow-[0_0_6px_rgba(168,85,247,0.6)] hover:shadow-[0_0_12px_rgba(168,85,247,0.9)]",
// };

const variantStyles: Record<BadgeVariant, string> = {
  skill: `
    bg-gradient-to-r
    from-cyan-500/10 to-blue-500/10
    dark:from-cyan-500/20 dark:to-blue-500/20
    text-cyan-700 dark:text-cyan-300
    border-cyan-500/20 dark:border-cyan-500/30
    hover:shadow-[0_0_8px_rgba(34,211,238,0.35)]
    dark:hover:shadow-[0_0_8px_rgba(34,211,238,0.5)]
  `,

  remote: `
    bg-gradient-to-r
    from-green-500/10 to-emerald-500/10
    dark:from-green-500/20 dark:to-emerald-500/20
    text-green-700 dark:text-green-300
    border-green-500/20 dark:border-green-500/30
    hover:shadow-[0_0_8px_rgba(34,197,94,0.35)]
    dark:hover:shadow-[0_0_8px_rgba(34,197,94,0.5)]
  `,

  urgent: `
    bg-gradient-to-r
    from-red-500/10 to-orange-500/10
    dark:from-red-500/20 dark:to-orange-500/20
    text-red-700 dark:text-red-300
    border-red-500/20 dark:border-red-500/30
    animate-pulse
    hover:shadow-[0_0_10px_rgba(239,68,68,0.45)]
    dark:hover:shadow-[0_0_10px_rgba(239,68,68,0.7)]
  `,

  new: `
    bg-gradient-to-r
    from-yellow-400/10 to-amber-500/10
    dark:from-yellow-400/20 dark:to-amber-500/20
    text-amber-700 dark:text-yellow-300
    border-yellow-500/20 dark:border-yellow-500/30
    hover:shadow-[0_0_8px_rgba(250,204,21,0.4)]
    dark:hover:shadow-[0_0_8px_rgba(250,204,21,0.6)]
  `,

  featured: `
    bg-gradient-to-r
    from-purple-500/10 to-fuchsia-500/10
    dark:from-purple-500/20 dark:to-fuchsia-500/20
    text-purple-700 dark:text-purple-300
    border-purple-500/20 dark:border-purple-500/30
    shadow-[0_0_4px_rgba(168,85,247,0.25)]
    dark:shadow-[0_0_6px_rgba(168,85,247,0.6)]
    hover:shadow-[0_0_8px_rgba(168,85,247,0.45)]
    dark:hover:shadow-[0_0_12px_rgba(168,85,247,0.9)]
  `,
};

const Badge = ({
  children,
  variant = "skill",
  size = "md",
  icon,
  clickable = false,
  onClick,
  className,
}: BadgeProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <span
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={clickable ? handleKeyDown : undefined}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        clickable && "cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
    >
      {icon && 
        <span className="flex items-center justify-center">
          {icon}
        </span>
      }
      {children}
    </span>
  )
}

export default Badge
