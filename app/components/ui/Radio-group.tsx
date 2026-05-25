'use client';

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import clsx from "clsx";
import { useId } from "react";

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label?: string;
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
}

export default function RadioGroup({
  label,
  options,
  value,
  onValueChange,
}: RadioGroupProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;

  return (
    <div className="w-full">
      {label && (
        <p
          id={labelId}
          className="mb-2 font-mono text-sm text-[var(--text-secondary)]"
        >
          {label}
        </p>
      )}

      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        aria-labelledby={label ? labelId : undefined}
        className="flex flex-col gap-3"
      >
        {options.map((opt, index) => {
          const id = `${baseId}-${index}`;

          return (
            <div key={opt.value} className="flex items-center gap-3">
              <RadioGroupPrimitive.Item
                id={id}
                value={opt.value}
                className={clsx(`
                  flex h-4 w-4 items-center justify-center
                  rounded-full border transition-all duration-200
                  border-black/20 dark:border-white/20
                  bg-white dark:bg-[#0A0A0F]
                  data-[state=checked]:border-cyan-500
                  dark:data-[state=checked]:shadow-[0_0_10px_#06B6D4]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan-500/40
                `)}
              >
                <RadioGroupPrimitive.Indicator
                  className="
                    h-2 w-2 rounded-full
                    bg-cyan-500
                  "
                />
              </RadioGroupPrimitive.Item>

              <label
                htmlFor={id}
                className="
                  cursor-pointer font-mono text-xs
                  text-[var(--text-primary)]
                "
              >
                {opt.label}
              </label>
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>
    </div>
  );
}