'use client';

import { companies, jobs } from "@/lib/dummy-data";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import Badge from "../ui/Badge";
import Link from "next/link";


const FeaturedCarousel = () => {
  const featuredJobs = useMemo(() => {
    return jobs.slice(0, 5);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    if (!emblaApi) return;

    let timeout: NodeJS.Timeout;

    const play = () => {
      timeout = setTimeout(() => {
        emblaApi.scrollNext();
        play();
      }, 5000);
    };

    play();

      return () => clearTimeout(timeout);
  }, [emblaApi]);

  return (
    <section className="mt-16 py-12 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="relative z-20 text-2xl sm:text-3xl font-bold mb-6 text-white">
          Featured Opportunities
        </h2>
        <div className="relative group">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {featuredJobs.map((job) => {
                const company = companies.find((c) => c.id === job.companyId);
                
                return (
                  <Link 
                    href={`/jobs/${job.id}`}
                    key={job.id}
                    className="min-w-0 flex-[0_0_90%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] px-2"
                  >
                    <div 
                        className={clsx(
                          "cursor-pointer relative p-[1.5px] rounded-xl",
                          "bg-linear-to-r from-[#06B6D4] via-[#A855F7] to-[#EC4899]",
                          "hover:shadow-[0_0_25px_#06B6D4] transition"
                        )}
                      >
                        <div className="h-full flex flex-col justify-between gap-3 rounded-xl p-4 bg-[#0A0A0F]"
                        >
                          <Badge variant="featured" className="w-fit">
                            Featured
                          </Badge>

                          <div className="flex items-center gap-3">
                            <Image
                              src={company?.logo || ""}
                              alt={company?.name ?? "Company logo"}
                              width={40}
                              height={40}
                              sizes="(max-width: 640px) 40px, 40px"
                              priority={job.id === featuredJobs[0].id}
                              placeholder="blur"
                              blurDataURL="/placeholders/company-blur.jpg"
                              className="w-10 h-10 rounded bg-zinc-800 p-1"
                              unoptimized
                            />

                            <div>
                              <p className="text-sm text-white">
                                {company?.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {job.location}
                              </p>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-white">
                            {job.title}
                          </h3>

                          <p className="text-sm text-gray-400">
                            {job.salary}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {job.skills.map((skill, i) => (
                              <Badge 
                                key={`${skill}-${i}`}
                                size="sm"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute pointer-events-none z-10 left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition group-hover:pointer-events-auto bg-black/50 hover:bg-black/80 p-2 rounded-full"
          >
            <ChevronLeft /> 
          </button>

          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Previous slide"
            className="absolute pointer-events-none z-10 right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition bg-black/50 hover:bg-black/80 p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCarousel
