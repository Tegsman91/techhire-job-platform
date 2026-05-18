'use client';

import { forwardRef, TextareaHTMLAttributes, useId } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, success, className, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    const errorId = `${textareaId}-error`;

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          id={textareaId}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            "peer w-full rounded-lg bg-[#0A0A0F]/60 border border-white/10 px-4 py-3 text-white outline-none transition-all duration-300 resize-none",
            "focus:border-[#06B6D4] focus:shadow-[0_0_10px_#06B6D4]",
            error
              ? "border-red-500 shadow-[0_0_10px_red] animate-[shake_0.3s_ease-in-out]"
              : success && "border-green-500 text-green-500 shadow-[0_0_10px_#10B981]",
            className
          )}
          {...props}
        />

        {label && (
          <label
            htmlFor={textareaId}
            className={clsx(
              "absolute left-3 top-1 text-xs text-gray-400 transition-all duration-200 pointer-events-none",
              "peer-focus:text-[#06B6D4]",
              "peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500",
              "font-mono"
            )}
          >
            {label}
          </label>
        )}

        {error && (
          <span 
            id={errorId} 
            className="mt-1 text-sm text-red-500" role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;