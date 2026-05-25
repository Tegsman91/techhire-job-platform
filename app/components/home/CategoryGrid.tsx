'use client';

import { categoryConfig } from "@/config/category-config";
import { jobs } from "@/lib/dummy-data";
import clsx from "clsx";
import Link from "next/link";
import { useMemo } from "react";

const CategoryGrid = () => {
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};

    categoryConfig.forEach((cat) => {
      map[cat.value] = jobs.filter(
        (job) => job.category === cat.value
      ).length;
    });

    return map;
  }, []);

  
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="relative text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-white mb-8">
          Explore by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {categoryConfig.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.value];

            return (
              <Link
                href={`/jobs?category=${encodeURIComponent(cat.value)}`}
                key={cat.value}
                className={clsx(
                  "cursor-pointer group relative rounded-xl p-px overflow-hidden",
                  "hover:-translate-y-1 hover:scale-[1.02]",
                  "transition-all duration-300"
                )}
              >
                <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20 group-hover:opacity-100 transition duration-300">
                  <div className="w-full h-full rounded-xl 
                    bg-[linear-gradient(120deg,#06B6D4,#A855F7,#EC4899,#06B6D4)] 
                    bg-size-[300%_300%]
                    animate-gradient">
                  </div>
                </div>

                <div
                  className="
                    relative rounded-xl p-5
                    flex items-center gap-4 h-full
                    bg-white dark:bg-[#0A0A0F]
                    border border-black/5 dark:border-white/5
                    shadow-sm dark:shadow-none
                    group-hover:shadow-[0_0_50px_rgba(168,85,247,0.35)]
                    transition
                  "
                >
                  <div
                    className="
                      p-3 rounded-lg
                      bg-linear-to-br
                      from-black/5 to-black/10
                      dark:from-zinc-800 dark:to-zinc-900
                      text-cyan-600 dark:text-[#06B6D4]
                      group-hover:text-zinc-600
                      group-hover:dark:text-white
                      group-hover:bg-linear-to-br
                      group-hover:from-[#06B6D4]/20
                      group-hover:to-[#A855F7]/20
                      group-hover:shadow-[0_0_8px_rgba(6,182,212,0.5)]
                      transition-all duration-300
                    "
                  >
                    <Icon size={22} />
                  </div>

                  <div>
                    <p className="text-[var(--text-primary)] font-semibold">
                      {cat.value}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {count > 0 ? `${count.toLocaleString()} jobs` : "No openings yet"}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid