'use client';

import * as Popover from "@radix-ui/react-popover";
import { jobs, locations } from "@/lib/dummy-data";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";

type Suggestion = {
  label: string;
  type: "job" | "skill" | "location";
};

const MAX_RESULTS = 8;

function SuggestionDropdown({
  suggestions,
  selectedIndex,
  onSelect,
}: {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (value: string) => void;
}) {
  return (
    <div
      className="
        mt-2 w-full rounded-2xl border border-white/10
        bg-[#111118] backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.45)]
        overflow-hidden z-50
      "
    >
      {suggestions.map((item, index) => (
        <button
          key={`${item.label}-${index}`}
          type="button"
          onMouseDown={() => onSelect(item.label)}
          className={`
            w-full text-left px-4 py-3 transition
            flex items-center justify-between
            ${
              selectedIndex === index
                ? "bg-cyan-500/15 text-cyan-300"
                : "text-white hover:bg-white/5"
            }
          `}
        >
          <span>{item.label}</span>
          <span className="text-xs text-gray-500 uppercase">
            {item.type}
          </span>
        </button>
      ))}
    </div>
  );
}

const SearchBar = () => {
  const router = useRouter();

  const jobOptions = useMemo(() => {
    const titles = jobs.map((job) => job.title);
    const skills = jobs.flatMap((job) => job.skills);
    return [...new Set([...titles, ...skills])];
  }, []);

   const locationOptions = useMemo(() => {
    return [...new Set(locations)];
  }, []);

  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const [debouncedJob, setDebouncedJob] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");

  const [activeDropdown, setActiveDropdown] = useState<"job" | "location" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const jobInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedJob(jobQuery), 300);
    return () => clearTimeout(timer);
  }, [jobQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLocation(locationQuery), 300);
    return () => clearTimeout(timer);
  }, [locationQuery]);

  const jobSuggestions = useMemo(() => {
    if (!debouncedJob.trim()) return [];

    return jobOptions
      .filter((item) =>
        item.toLowerCase().includes(debouncedJob.toLowerCase())
      )
      .slice(0, MAX_RESULTS)
      .map((item) => ({
        label: item,
        type: jobs.some((job) => job.title === item) 
          ? ("job" as const)
          : ("skill" as const),
      }));
  }, [debouncedJob, jobOptions]);

  const locationSuggestions = useMemo(() => {
    if (!debouncedLocation.trim()) return [];

    return locationOptions
      .filter((item) =>
        item.toLowerCase().includes(debouncedLocation.toLowerCase())
      )
      .slice(0, MAX_RESULTS)
      .map((item) => ({
        label: item,
        type: "location" as const,
      }));
  }, [debouncedLocation, locationOptions]);

  const currentSuggestions =
    activeDropdown === "job" ? jobSuggestions : locationSuggestions;

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (jobQuery.trim()) params.set("q", jobQuery.trim());
    if (locationQuery.trim()) params.set("loc", locationQuery.trim());

    router.push(`/jobs?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!currentSuggestions.length) {
      if (e.key === "Enter") handleSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev: number) =>
        prev === currentSuggestions.length - 1 ? 0 : prev + 1
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev: number) =>
        prev === 0 ? currentSuggestions.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = currentSuggestions[selectedIndex];

      if (selected) {
        if (selected.type === "location") {
          setLocationQuery(selected.label);
          setActiveDropdown(null);
          locationInputRef.current?.focus();
        } else {
          setJobQuery(selected.label);
          setActiveDropdown(null);
          jobInputRef.current?.focus();
        }
      } else {
        handleSearch();
      }
    }
  };

  return (
    <div
      className="
        w-full rounded-3xl border border-white/10
        bg-white/5 backdrop-blur-2xl
        p-3 sm:p-4
        shadow-[0_0_30px_rgba(6,182,212,0.12)]
      "
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <Popover.Root open={activeDropdown === "job" && jobSuggestions.length > 0}>
          <Popover.Anchor asChild>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-4 h-4" />

              <input
                ref={jobInputRef}
                value={jobQuery}
                onChange={(e) => {
                  setJobQuery(e.target.value);
                  setActiveDropdown("job");
                  setSelectedIndex(0);
                }}
                onFocus={() => setActiveDropdown("job")}
                onKeyDown={handleKeyDown}
                placeholder="Job title or skill"
                className="
                  w-full rounded-2xl bg-[#0A0A0F]
                  border border-white/10
                  pl-11 pr-4 py-4
                  text-white placeholder-gray-500
                  outline-none focus:border-cyan-500"
              />
            </div>
          </Popover.Anchor>

          <Popover.Portal>
            <Popover.Content
              sideOffset={8}
              align="start"
              className="z-[9999] w-[var(--radix-popover-trigger-width)]"
            >
              <SuggestionDropdown
                suggestions={jobSuggestions}
                selectedIndex={selectedIndex}
                onSelect={(value) => {
                  setJobQuery(value);
                  setActiveDropdown(null);
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* LOCATION INPUT */}
        {/* <Popover.Root
          open={activeDropdown === "location" && locationSuggestions.length > 0}
        >
          <Popover.Anchor asChild>
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-4 h-4" />

              <input
                ref={locationInputRef}
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setActiveDropdown("location");
                  setSelectedIndex(0);
                }}
                onFocus={() => setActiveDropdown("location")}
                onKeyDown={handleKeyDown}
                placeholder="Location"
                className="
                  w-full rounded-2xl bg-[#0A0A0F]
                  border border-white/10
                  pl-11 pr-4 py-4
                  text-white placeholder-gray-500
                  outline-none focus:border-cyan-500
                "
              />
            </div>
          </Popover.Anchor>

          <Popover.Portal>
            <Popover.Content
              sideOffset={8}
              align="start"
              className="z-[9999] w-[var(--radix-popover-trigger-width)]"
            >
              <SuggestionDropdown
                suggestions={locationSuggestions}
                selectedIndex={selectedIndex}
                onSelect={(value) => {
                  setLocationQuery(value);
                  setActiveDropdown(null);
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root> */}

        {/* BUTTON */}
        <button
          onClick={handleSearch}
          className="
            rounded-2xl px-6 py-4
            bg-linear-to-r from-cyan-500 to-blue-500
            text-black font-semibold
            shadow-[0_0_20px_rgba(6,182,212,0.3)]
            hover:scale-[1.02] transition
          "
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default SearchBar