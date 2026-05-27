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
      <div
        className="
          flex justify-between text-sm font-medium
          text-cyan-700
          dark:text-cyan-300
        "
      >
        <span>{formatNaira(value[0])}</span>
        <span>{formatNaira(value[1])}</span>
      </div>

      <Slider.Root
        value={value}
        min={500000}
        max={5000000}
        step={50000}
        onValueChange={(val) => onChange(val as [number, number])}
        className="relative flex items-center w-full h-6"
      >
        {/* Track */}
        <Slider.Track
          className="
            relative grow rounded-full h-2
            bg-zinc-200
            dark:bg-white/10
          "
        >
          {/* Active range */}
          <Slider.Range
            className="
              absolute h-full rounded-full
              bg-cyan-500
              dark:bg-cyan-400
            "
          />
        </Slider.Track>

        {/* Thumb */}
        <Slider.Thumb
          className="
            block h-5 w-5 rounded-full
            border-2 border-white
            bg-cyan-500
            shadow-md
            transition
            hover:scale-110
            focus:outline-none
            focus:ring-4
            focus:ring-cyan-500/30

            dark:border-[#0A0A0F]
            dark:bg-cyan-400
            dark:shadow-[0_0_10px_rgba(6,182,212,0.8)]
          "
        />

        <Slider.Thumb
          className="
            block h-5 w-5 rounded-full
            border-2 border-white
            bg-cyan-500
            shadow-md
            transition
            hover:scale-110
            focus:outline-none
            focus:ring-4
            focus:ring-cyan-500/30

            dark:border-[#0A0A0F]
            dark:bg-cyan-400
            dark:shadow-[0_0_10px_rgba(6,182,212,0.8)]
          "
        />
      </Slider.Root>
    </div>
  );
}