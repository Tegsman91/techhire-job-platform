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
        <p id={labelId} className="mb-2 text-sm font-mono text-gray-400">
          {label}
        </p>
      )}

      <Select.Root 
        value={value || undefined} 
        onValueChange={onValueChange}
      >
        <Select.Trigger 
          // className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-[#0A0A0F]/60 border border-white/10 text-white outline-none transition-all focus:shadow-[0_0_10px_#06B6D4]" 
          className="
            flex w-full items-center justify-between
            rounded-2xl border border-white/10
            bg-black/20 px-4 py-3
            text-white outline-none transition-all
            focus:border-cyan-400/50
            focus:shadow-[0_0_12px_rgba(34,211,238,0.15)]
          "       
          aria-labelledby={label ? labelId : undefined}
        >
          <Select.Value placeholder={placeholder || 'Select option'} />
          <ChevronDown size={16} />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="
              z-50 overflow-hidden rounded-xl
              border border-white/10
              bg-[#18181B]
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
                  className="p-2 rounded cursor-pointer hover:bg-white/10 focus:bg-white/10 outline-none"
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}