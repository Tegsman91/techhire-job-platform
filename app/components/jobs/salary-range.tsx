'use client';

import * as Slider from '@radix-ui/react-slider';

type Props = {
  value: [number, number];
  onChange: (val: [number, number]) => void;
};

export default function SalaryRange({ value, onChange }: Props) {
  const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`;

  return (
    <div className="space-y-4">
      {/* Values */}
      <div className="flex justify-between text-sm text-cyan-300 font-medium">
        <span>{formatNaira(value[0])}</span>
        <span>{formatNaira(value[1])}</span>
      </div>

      <Slider.Root
        value={value}
        min={500000}
        max={5000000}
        step={50000} // smoother movement (50k steps)
        onValueChange={(val) => onChange(val as [number, number])}
        className="relative flex items-center w-full h-6"
      >
        <Slider.Track className="bg-white/10 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-cyan-400 h-full rounded-full" />
        </Slider.Track>

        <Slider.Thumb className="block w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] cursor-pointer" />
        <Slider.Thumb className="block w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] cursor-pointer" />
      </Slider.Root>
    </div>
  );
}