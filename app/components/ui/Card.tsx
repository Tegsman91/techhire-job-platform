'use client';

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

type Variant = "default" | "elevated" | "interactive" | "featured";
type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  variant?: Variant;
  padding?: Padding;
  withCorners?: boolean;
  className?: string;
}

const baseStyles =
  "relative rounded-2xl overflow-hidden backdrop-blur-md bg-[#0A0A0F]/60 transition-all duration-300";

const paddingStyles: Record<Padding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

const variantStyles: Record<Variant, string> = {
  default: "",
  elevated: "shadow-[0_0_25px_rgba(6,182,212,0.25)]",
  interactive: "hover:shadow-[0_0_30px_rgba(168,85,247,0.35)] cursor-pointer",
  featured: "",
};

const Card = ({
  children,
  variant = "default",
  padding = "md",
  withCorners = false,
  className,
}: CardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      className={clsx(baseStyles, paddingStyles[padding], variantStyles[variant], className)}
      variants={
        shouldReduceMotion
          ? undefined
          : {
              initial: { scale: 1 },
              hover: { scale: 1.02 },
            }
      }
      initial="initial"
      animate="initial"
       whileHover={shouldReduceMotion ? undefined : "hover"}
    >
      {(variant === "featured" || variant === "interactive") && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            padding: "2px",
            backgroundImage:
              "linear-gradient(120deg, #06B6D4, #A855F7, #EC4899, #06B6D4)",
            backgroundSize: "300% 300%",
            backgroundRepeat: "no-repeat",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          variants={{
            initial: { opacity: 0.4 },
            hover: shouldReduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                },
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2, repeat: Infinity }
          }
        />
      )}

      <div className="relative z-10">{children}</div>

      {withCorners && (
        <>
          <svg
            className="absolute top-2 left-2 w-6 h-6 text-primary opacity-70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 10V4h6" />
          </svg>

          <svg
            className="absolute bottom-2 right-2 w-6 h-6 text-primary opacity-70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 14v6h-6" />
          </svg>
        </>
      )}
    </motion.div>
  )
}

export default Card;

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4 text-xl font-semibold">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="text-sm text-muted">{children}</div>;
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex items-center justify-between">{children}</div>;
}