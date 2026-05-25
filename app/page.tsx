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
import NotificationBell from "./components/layouts/notification-bell";

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
    <div
      className="
        relative min-h-screen overflow-hidden
        bg-[var(--bg-primary)]
        text-[var(--text-primary)]
        transition-colors duration-300
      "
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid opacity-10 dark:opacity-100" />

        <motion.div
          className="
            hidden dark:block
            absolute inset-0
            bg-linear-to-b
            from-transparent
            via-cyan-400/10
            to-transparent
          "
          animate={{ y: ["-100%", "100%"] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          }}
        />
      </div>

      <div
        className="
          absolute inset-0 z-0
          hidden dark:block
          bg-gradient-to-b
          from-black/60
          to-black/90
        "
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 space-y-8">
        <div className="absolute right-4 top-4 z-30 sm:right-6 sm:top-6"
        >
          <NotificationBell />
        </div>

        <h1 className="hidden lg:block text-4xl sm:text-6xl font-bold bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> 
          Find Your Next Tech Role 
        </h1> 

        <p className="text-[var(--text-secondary)] text-lg hidden lg:block">
          15,250+ opportunities at top tech companies 
        </p>

        <div className="w-full max-w-2xl mt-4 lg:mt-0">
          <SearchBar />
        </div>

        <div className="hidden lg:flex  flex-wrap justify-center gap-3 relative z-10">
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
          className="hidden lg:flex items-center gap-2 text-sm text-orange-400"
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
      <div className="hidden lg:grid">
        <CategoryGrid />
      </div>
      <HiringCompanies />
      <div className="hidden lg:grid">
        <HowItWorks />
      </div>
    </div>
  );
}