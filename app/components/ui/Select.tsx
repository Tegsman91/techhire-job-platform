'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { useId } from 'react';

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
          className="
            mb-2 text-sm font-mono
            text-slate-500
            dark:text-white/60
          "
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
            rounded-2xl border
            border-slate-200 bg-white
            px-4 py-3
            text-slate-900
            shadow-sm
            outline-none
            transition-all
            hover:border-cyan-400/40
            focus:border-cyan-500
            focus:ring-4
            focus:ring-cyan-500/10
            dark:border-white/10
            dark:bg-black/20
            dark:text-white
            dark:shadow-none
            dark:hover:border-cyan-400/30
            dark:focus:border-cyan-400/50
            dark:focus:ring-cyan-400/10
          "
          aria-labelledby={label ? labelId : undefined}
        >
          <Select.Value
            placeholder={
              placeholder || 'Select option'
            }
          />

          <ChevronDown
            size={16}
            className="
              text-slate-500
              dark:text-white/50
            "
          />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="
              z-50 overflow-hidden rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-white/10
              dark:bg-[#0F172A]
              min-w-[var(--radix-select-trigger-width)]
            "
          >
            <Select.Viewport className="p-2">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="
                    cursor-pointer rounded-xl
                    px-3 py-2
                    outline-none
                    transition-colors
                    text-slate-700
                    hover:bg-slate-100
                    focus:bg-slate-100
                    dark:text-white
                    dark:hover:bg-white/10
                    dark:focus:bg-white/10
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