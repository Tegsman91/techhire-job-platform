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
    <label className="flex items-center gap-3 cursor-pointer">
      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={(val) => {
          if (val === "indeterminate") return;
          onCheckedChange?.(val);
        }}
        aria-label={!label ? ariaLabel : undefined}
        className={clsx(
          "w-3.5 h-3.5 rounded-sm border border-white/20 flex items-center justify-center transition-all duration-200",
          "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_10px_#06B6D4]",
          "focus:outline-none focus-visible:shadow-[0_0_10px_#06B6D4]"
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="w-2.5 h-2.5 text-cyan-400" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <span className="text-xs text-white font-mono">{label}</span>
      )}
    </label>
  );
}