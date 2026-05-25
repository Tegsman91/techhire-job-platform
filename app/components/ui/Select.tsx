'use client';

import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { useId } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
}

export default function CustomSelect({
  label,
  options,
  value,
  placeholder,
  onValueChange,
}: SelectProps) {
  const labelId = useId();

  return (
    <div className="w-full">
      {label && (
        <p
          id={labelId}
          className="mb-2 text-sm font-mono text-[var(--text-secondary)]"
        >
          {label}
        </p>
      )}

      <Select.Root
        value={value || undefined}
        onValueChange={onValueChange}
      >
        <Select.Trigger
          className="
            flex w-full items-center justify-between
            rounded-2xl
            border border-[var(--border-primary)]
            bg-[var(--surface-primary)]
            px-4 py-3
            text-[var(--text-primary)]
            outline-none
            backdrop-blur-xl
            transition-all
            focus:border-cyan-400/50
            focus:shadow-[0_0_12px_rgba(34,211,238,0.15)]
          "
          aria-labelledby={label ? labelId : undefined}
        >
          <Select.Value placeholder={placeholder || 'Select option'} />

          <ChevronDown
            size={16}
            className="text-[var(--text-secondary)]"
          />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="
              z-50 overflow-hidden rounded-2xl
              border border-[var(--border-primary)]
              bg-[var(--bg-secondary)]
              shadow-2xl
              backdrop-blur-xl
              min-w-[var(--radix-select-trigger-width)]
            "
          >
            <Select.Viewport className="p-2">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="
                    rounded-xl px-3 py-2
                    cursor-pointer
                    outline-none
                    transition-colors
                    text-[var(--text-primary)]
                    hover:bg-[var(--surface-secondary)]
                    focus:bg-[var(--surface-secondary)]
                  "
                >
                  <Select.ItemText>
                    {opt.label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}