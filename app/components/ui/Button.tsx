'use client';

import clsx from "clsx";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const baseStyles =
  `
    relative inline-flex items-center justify-center
    rounded-xl font-medium overflow-hidden
    transition-all duration-300
  `;

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

const variantStyles: Record<Variant, string> = {
  primary: `
    bg-slate-900 text-white
    hover:bg-slate-800
    hover:shadow-[0_10px_30px_rgba(15,23,42,0.15)]
    dark:bg-[var(--color-primary)]
    dark:text-black
    dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.45)]
    dark:shadow-neon
  `,

  secondary: `
    bg-purple-500 text-white
    hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]
    dark:bg-[var(--color-secondary)]
    dark:text-white
    dark:shadow-neon-pink
  `,


  danger: `
    bg-red-500 text-white
    hover:bg-red-600
  `,

  ghost: `
    bg-zinc-100 text-zinc-700
    border border-zinc-200
    hover:bg-zinc-200
    dark:bg-white/5
    dark:text-white/80
    dark:border-white/10
    dark:hover:bg-white/10
    dark:hover:text-white
  `,

  outline: `
    border border-zinc-300
    text-zinc-700
    hover:border-cyan-500
    hover:text-cyan-600
    hover:bg-cyan-50

    dark:border-white/20
    dark:text-white
    dark:hover:border-cyan-400
    dark:hover:bg-white/5
  `,
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        `
          disabled:opacity-50
          disabled:cursor-not-allowed
        `,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Animated Glow */}
      <motion.span
        className="
          absolute inset-0 rounded-xl
          pointer-events-none
          opacity-0 dark:opacity-0
        "
        initial={{ opacity: 0 }}
        whileHover={disabled || loading ? undefined : { opacity: 1 }}
        style={{
          background:
            "linear-gradient(90deg, #06B6D4, #A855F7, #EC4899, #06B6D4)",
          backgroundSize: "300% 300%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          leftIcon
        )}

        {children}

        {!loading && rightIcon}
      </span>

      {/* Loading Pulse */}
      {loading && (
        <motion.span
          className="
            absolute inset-0 rounded-xl
            bg-cyan-500/20
          "
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </button>
  );
};

export default Button;