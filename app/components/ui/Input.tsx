'use client';

import { forwardRef, InputHTMLAttributes, useId } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          placeholder={label ? " " : props.placeholder}
          className={clsx(
            "peer relative z-10 w-full rounded-lg bg-white/20 dark:bg-[#0A0A0F]/60 border border-zinc-300 dark:border-white/10 px-4 pr-10 py-3 text-black dark:text-white outline-none transition-all duration-300",
            "focus:border-[#06B6D4] focus:shadow-[0_0_10px_#06B6D4]",
            error
              ? "border-red-500 shadow-[0_0_10px_red] animate-[shake_0.3s_ease-in-out]"
              : success && "border-green-500 shadow-[0_0_10px_#10B981]",
            className
          )}
          {...props}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />

        {success && !error && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 z-20 text-[#10B981]" />
        )}
        
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              "absolute left-3 top-1 text-xs text-zinc-500 dark:text-gray-400 transition-all duration-200 pointer-events-none",
              "peer-focus:text-cyan-600",
              "dark:peer-focus:text-[#06B6D4]",
              "peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500",
              "font-mono"
            )}
          >
            {label}
          </label>
        )}

        {error && (
          <p 
            id={errorId} 
            className="mt-1 text-xs text-red-400" role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;