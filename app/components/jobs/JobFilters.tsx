'use client';

import * as Slider from "@radix-ui/react-slider";
import { useJobFilters } from "@/lib/store";
import type { Filters } from "@/lib/store";
import { useState } from "react";
import Checkbox from "../ui/Checkbox";
import { skillTags } from "@/lib/dummy-data";
import { locations } from "@/lib/dummy-data";
import RadioGroup from "../ui/Radio-group";

type ArrayFilterKeys = {
  [K in keyof Filters]: Filters[K] extends string[] ? K : never
}[keyof Filters];

const JobFilters = () => {
  const { filters, setFilter } = useJobFilters();
  const [locationInput, setLocationInput] = useState(filters.location);
  const [isLocationSuggestionsOpen, setIsLocationSuggestionsOpen] = useState(
    Boolean(false)
  );

  const handleLocationSelect = (loc: string) => {
    setLocationInput(loc);
    setFilter("location", loc);
    setIsLocationSuggestionsOpen(false);
  };

  const toggleArrayValue = (field: ArrayFilterKeys, value: string) => {
    const current = filters[field];

    if (current.includes(value)) {
      setFilter(field, current.filter((v) => v !== value));
    } else {
      setFilter(field, [...current, value]);
    }
  };

  return (
    <div 
      className="sticky top-3 h-fit p-4 border border-white/10 bg-[#0A0A0F] space-y-6 text-sm"
    >
      {/* Job Type */}
      <div className="space-y-3 border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-gray-300 mb-2"
        >
          Job Type
        </p>

        {["Remote", "Hybrid", "On-site"].map((type) => (
          <Checkbox
            key={type}
            checked={filters.jobType.includes(type)}
            onCheckedChange={(checked) => {
              if (checked) {
                setFilter("jobType", [...filters.jobType, type]);
              } else {
                setFilter(
                  "jobType",
                  filters.jobType.filter((t) => t !== type)
                );
              }
            }}
            label={type}
          />
        ))}
      </div>

      {/* Experience */}
      <div className="space-y-3 border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-gray-300 mb-2"
        >
          Experience
        </p>

        {["Junior", "Mid", "Senior", "Lead"].map((level) => (
           <Checkbox
            key={level}
            checked={filters.experience.includes(level)}
            onCheckedChange={(checked) => {
              if (checked) {
                setFilter("experience", [...filters.experience, level]);
              } else {
                setFilter(
                  "experience",
                  filters.experience.filter((l) => l !== level)
                );
              }
            }}
            label={level}
          />
        ))}
      </div>

       {/* Employment */}
      <div className="space-y-3 border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-gray-300 mb-2"
        >
          Employment
        </p>

        {["Full-Time", "Part-Time", "Contract", "Freelance"].map((type) => (
          <Checkbox
            key={type}
            checked={filters.employment.includes(type)}
            onCheckedChange={(checked) => {
              if (checked) {
                setFilter("employment", [...filters.employment, type]);
              } else {
                setFilter(
                  "employment",
                  filters.employment.filter((t) => t !== type)
                );
              }
            }}
            label={type}
          />
        ))}
      </div>

      {/* Salary Slider */}
      <div className="space-y-3 border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-gray-300 mb-2"
        >
          Salary Range
        </p>

        <div className="flex flex-col gap-4">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            min={0}
            max={50000000}
            step={100000}
            value={filters.salary}
            onValueChange={(value) => {
              setFilter("salary", value as [number, number]);
            }}
          >
            {/* Track */}
            <Slider.Track className="bg-zinc-800 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-cyan-500 rounded-full h-full shadow-[0_0_10px_#06B6D4]" />
            </Slider.Track>

            <Slider.Thumb
              aria-label="Minimum salary"
              className="block w-4 h-4 bg-white rounded-full shadow 
              hover:bg-cyan-400 focus:outline-none 
              focus:ring-2 focus:ring-cyan-500"
            />

            <Slider.Thumb
              aria-label="Maximum salary"
              className="block w-4 h-4 bg-white rounded-full shadow 
              hover:bg-cyan-400 focus:outline-none 
              focus:ring-2 focus:ring-cyan-500"
            />
          </Slider.Root>

          <div className="text-gray-400 text-sm">
            ₦{filters.salary[0].toLocaleString()} — ₦
            {filters.salary[1].toLocaleString()}
          </div>
        </div>
      </div>

       {/* Skills */}
      <div className="space-y-3 border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-gray-300 mb-2"
        >
          Skills
        </p>

        <div className="flex flex-wrap gap-2">
          {skillTags.map((skill) => {
            const active = filters.skills.includes(skill);

            return (
              <button
                type="button"
                key={skill}
                onClick={() => toggleArrayValue("skills", skill)}
                aria-pressed={active}
                className={`px-2 py-1 rounded text-xs border transition ${
                  active
                    ? "bg-cyan-500 text-black border-cyan-500"
                    : "bg-zinc-800 hover:bg-zinc-700 text-gray-300 border-zinc-700"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

       {/* Location */}
      <div className="space-y-3 border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-gray-300 mb-2"
        >
          Location
        </p>

        <input
          value={locationInput}
          onChange={(e) => {
            const value = e.target.value;
            setLocationInput(value);
            setIsLocationSuggestionsOpen(Boolean(value));
          }}
          onFocus={() => setIsLocationSuggestionsOpen(Boolean(locationInput))}
          onBlur={() => {
            setTimeout(() => setIsLocationSuggestionsOpen(false), 150);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilter("location", locationInput);
              setIsLocationSuggestionsOpen(false);
            }
          }}
          placeholder="Search location..."
          className="
            w-full px-3 py-2 rounded-md
            bg-zinc-900 border border-zinc-700
            text-white placeholder-gray-500
            focus:outline-none focus:ring-1 focus:ring-cyan-500
          "
          role="combobox"
          aria-expanded={isLocationSuggestionsOpen}
          aria-autocomplete="list"
          aria-controls="location-suggestions"
        />

        {locationInput && isLocationSuggestionsOpen && (
          <div
            id="location-suggestions"
            role="listbox"
            className="mt-2 bg-zinc-900 rounded border border-zinc-700"
          >
            {(() => {
              const filteredLocations = locations.filter((loc) =>
                loc.toLowerCase().includes(locationInput.toLowerCase())
              );

              if (filteredLocations.length === 0) {
                return (
                  <div
                    role="option"
                    aria-disabled="true"
                    className="px-3 py-2 text-gray-500 italic"
                  >
                    No results
                  </div>
                );
              }

              return filteredLocations.map((loc) => (
                <div
                  key={loc}
                  role="option"
                  tabIndex={0}
                  aria-selected={loc === locationInput}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleLocationSelect(loc)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleLocationSelect(loc);
                    }
                  }}
                  className="px-3 py-2 hover:bg-zinc-800 cursor-pointer text-gray-300"
                >
                  {loc}
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* Posted */}
      <div className="space-y-3 border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-gray-300 mb-2"
        >
          Posted
        </p>

        <RadioGroup
          label="Posted"
          value={filters.posted ?? ""}
          onValueChange={(val) => setFilter("posted", val)}
          options={[
            { label: "Last 24h", value: "24h" },
            { label: "Last Week", value: "week" },
            { label: "Last Month", value: "month" },
          ]}
        />
      </div>
    </div>
  )
}

export default JobFilters