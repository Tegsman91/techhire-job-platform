'use client';

import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps {
  label?: string;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function Slider({
  label,
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
}: SliderProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between text-sm font-mono text-gray-400">
          <span>{label}</span>
          <span className="text-[#06B6D4]">{value[0] ?? min}</span>
        </div>
      )}

      <SliderPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        className="relative flex items-center w-full h-5"
      >

        <SliderPrimitive.Track className="relative w-full h-1 rounded-full bg-white/10">
          <SliderPrimitive.Range className="absolute h-full bg-primary shadow-[0_0_10px_#06B6D4]" />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
           className="block w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_#06B6D4] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all hover:scale-110"
         />
      </SliderPrimitive.Root>
    </div>
  );
}