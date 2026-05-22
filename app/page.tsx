'use client';

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useState } from "react";
import FeaturedCarousel from "./components/home/FeaturedCarousel";
import CategoryGrid from "./components/home/CategoryGrid";
import HiringCompanies from "./components/home/HiringCompanies";
import HowItWorks from "./components/home/HowItWorks";
import Badge from "./components/ui/Badge";
import SearchBar from "./components/jobs/search-bar";
import HomeSearchBar from "./components/home/home-search-bar";

export default function HomePage() {
  const [filters, setFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F] text-white"
    >
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(#1f2937_1px,transparent_1px),linear-gradient(to_right,#1f2937_1px,transparent_1px)] [background-size:40px_40px]" />

        <motion.div
          className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-400/10 to-transparent"
          animate={{ y: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/90 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 space-y-8">
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          {["Remote", "Full-Time", "Contract", "Senior", "Junior"].map(
            (filter) => (
              <Badge
                key={filter}
                clickable
                onClick={() => toggleFilter(filter)}
                className={
                  filters.includes(filter)
                    ? "ring-2 ring-cyan-400"
                    : ""
                }
              >
                {filter}
              </Badge>
            )
          )}
        </div>

        <motion.div
          className="flex items-center gap-2 text-sm text-orange-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Flame className="w-4 h-4" />
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            45
          </motion.span>
          new jobs today
        </motion.div>
      </div>

      <FeaturedCarousel />
      <CategoryGrid />
      <HiringCompanies />
      <HowItWorks />
    </div>
  );
}