'use client';

import { companies, jobs } from "@/lib/dummy-data";
import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";

const HiringCompanies = () => {
  const companyCounts = useMemo(() => {
    const map: Record<string, number> = {};

    jobs.forEach((job) => {
      map[job.companyId] = (map[job.companyId] || 0) + 1;
    });

    return map;
  }, []);

  const topCompanies = useMemo(() => {
    return companies
      .map((company) => ({
        ...company,
        count: companyCounts[company.id] || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [companyCounts]);
  
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="relative text-2xl sm:text-3xl font-bold text-white mb-8">
          Companies Hiring Now
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-2 relative"
        >
          {topCompanies.map((company) => (
            <Link 
              key={company.id}
              href={`/company-profile?id=${company.id}`}
              className="group block"
            >
              <div 
                className="
                  h-full rounded-2xl p-5
                  flex flex-col gap-4
                  bg-white/[0.04]
                  border border-white/10
                  backdrop-blur-xl
                  shadow-[0_8px_30px_rgba(0,0,0,0.35)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-2
                  hover:scale-[1.02]
                  hover:border-cyan-400/30
                  hover:bg-white/[0.06]
                  hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]
                "
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-inner"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={40}
                      height={40}
                      placeholder="blur"
                      blurDataURL="/placeholders/company-blur.jpg"
                      className="w-8 h-8"
                      unoptimized
                    />
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      {company.name}
                    </p>

                    <span className="
                      inline-flex items-center gap-1
                      text-xs font-medium
                      px-2 py-0.5 rounded-full
                      bg-green-500/10 text-green-400
                      border border-green-500/20
                    ">
                      ✓ Verified
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  {company.count > 0
                    ? `${company.count.toLocaleString()} open positions`
                    : "No open roles"}
                </p>

                <span className="text-sm text-[#06B6D4] group-hover:underline mt-auto">
                  View Jobs →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HiringCompanies