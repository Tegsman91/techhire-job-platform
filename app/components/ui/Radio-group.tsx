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
        <p id={labelId} className="mb-2 text-sm font-mono text-gray-400">
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
                className={clsx(
                  "w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center transition-all",
                  "data-[state=checked]:border-primary data-[state=checked]:shadow-[0_0_10px_#06B6D4]"
                )}
              >
                <RadioGroupPrimitive.Indicator className="w-3 h-3 rounded-full bg-[#06B6D4]" />
              </RadioGroupPrimitive.Item>

              <label
                htmlFor={id}
                className="text-xs text-white font-mono cursor-pointer"
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