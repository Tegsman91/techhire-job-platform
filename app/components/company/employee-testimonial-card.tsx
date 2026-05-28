'use client';

import type { EmployeeTestimonial } from '@/lib/dummy-data';
import { Star } from 'lucide-react';

type Props = {
  testimonial: EmployeeTestimonial;
};

const EmployeeTestimonialCard = ({
  testimonial,
}: Props) => {
  return (
    <div
      className="
        rounded-[2rem]
        border border-black/10
        bg-white/80 p-6
        shadow-sm
        dark:border-white/10
        dark:bg-white/[0.04]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            className="
              text-lg font-bold
              text-slate-900
              dark:text-white
            "
          >
            {testimonial.name}
          </h3>

          <p
            className="
              text-sm
              text-slate-500
              dark:text-white/60
            "
          >
            {testimonial.role}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Star
            size={16}
            className="fill-cyan-400 text-cyan-400"
          />

          <span
            className="
              text-sm font-medium
              text-slate-700
              dark:text-white
            "
          >
            {testimonial.rating}/5
          </span>
        </div>
      </div>

      <p
        className="
          mt-5 leading-relaxed
          text-slate-600
          dark:text-white/70
        "
      >
        {testimonial.review}
      </p>

      {testimonial.pros && (
        <div className="mt-5 flex flex-wrap gap-2">
          {testimonial.pros.map((pro) => (
            <span
              key={pro}
              className="
                rounded-full
                border border-cyan-500/20
                bg-cyan-50
                px-3 py-1
                text-xs font-medium
                text-cyan-700
                dark:bg-cyan-400/10
                dark:text-cyan-300
              "
            >
              {pro}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTestimonialCard;