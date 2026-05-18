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
  "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 overflow-hidden";

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

const variantStyles: Record<Variant, string> = {
  primary:
  "bg-[var(--color-primary)] text-black shadow-neon hover:shadow-[0_0_20px_#06B6D4]",
  secondary:
    "bg-[var(--color-secondary)] text-white shadow-neon-pink hover:shadow-[0_0_20px_#A855F7]",
  danger:
    "bg-red-500 text-white hover:bg-red-600",
  ghost:
    "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white",
  outline:
    "border border-white/20 text-text hover:border-primary",
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
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <motion.span
        className="absolute inset-0 rounded-xl pointer-events-none"
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

      <span className="relative flex items-center gap-2 z-10">
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          leftIcon
        )}

        {children}

        {!loading && rightIcon}
      </span>

      {loading && (
        <motion.span
          className="absolute inset-0 rounded-xl bg-primary opacity-20"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </button>
  )
}

export default Button