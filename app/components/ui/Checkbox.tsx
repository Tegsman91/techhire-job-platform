'use client';

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import clsx from "clsx";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  'aria-label'?: string;
}

export default function Checkbox({
  checked,
  onCheckedChange,
  label,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={(val) => {
          if (val === "indeterminate") return;
          onCheckedChange?.(val);
        }}
        aria-label={!label ? ariaLabel : undefined}
        className={clsx(
          `flex h-4 w-4 items-center justify-center
          rounded-sm border transition-all duration-200
          border-black/20 dark:border-white/20
          bg-white dark:bg-[#0A0A0F]
          data-[state=checked]:border-cyan-500
          data-[state=checked]:bg-cyan-500
          dark:data-[state=checked]:shadow-[0_0_10px_#06B6D4]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-cyan-500/40
          `
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="h-3 w-3 text-black dark:text-cyan-400" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <span className="font-mono text-xs text-[var(--text-primary)]">
          {label}
        </span>
      )}
    </label>
  );
}