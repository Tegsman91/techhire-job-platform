
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
            `
              peer w-full rounded-lg resize-none
              px-4 py-3 outline-none
              transition-all duration-300
              bg-white dark:bg-[#0A0A0F]/60
              text-zinc-900 dark:text-white
              border border-zinc-300
              dark:border-white/10
              placeholder:text-zinc-400
              dark:placeholder:text-zinc-500
              focus:border-cyan-500
              dark:focus:border-[#06B6D4]
              focus:shadow-[0_0_10px_rgba(6,182,212,0.25)]
              dark:focus:shadow-[0_0_10px_#06B6D4]
            `,
            error
              ? `
                border-red-500
                shadow-[0_0_10px_rgba(239,68,68,0.35)]
                animate-[shake_0.3s_ease-in-out]
              `
              : success &&
                  `
                  border-green-500
                  shadow-[0_0_10px_rgba(16,185,129,0.25)]
                `,
            className
          )}
          {...props}
        />

        {label && (
          <label
            htmlFor={textareaId}
            className={clsx(
              `
                absolute left-3 top-1
                text-xs font-mono
                pointer-events-none
                transition-all duration-200
                text-zinc-500 dark:text-gray-400
                peer-focus:text-cyan-600
                dark:peer-focus:text-[#06B6D4]
                peer-placeholder-shown:top-3
                peer-placeholder-shown:text-sm
                peer-placeholder-shown:text-zinc-400
                dark:peer-placeholder-shown:text-gray-500
              `
            )}
          >
            {label}
          </label>
        )}

        {error && (
          <span
            id={errorId}
            className="mt-1 text-sm text-red-500 dark:text-red-400"
            role="alert"
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