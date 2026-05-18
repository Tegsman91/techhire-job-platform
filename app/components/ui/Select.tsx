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
  onValueChange: (value: string) => void;
}

export default function CustomSelect({
  label,
  options,
  value,
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

      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger 
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-[#0A0A0F]/60 border border-white/10 text-white outline-none transition-all focus:shadow-[0_0_10px_#06B6D4]"        
          aria-labelledby={label ? labelId : undefined}
        >
          <Select.Value placeholder="Select option" />
          <ChevronDown size={16} />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="bg-[#18181B] rounded-lg border border-white/10 shadow-lg">
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