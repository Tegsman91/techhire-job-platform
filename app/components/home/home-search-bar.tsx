'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HomeSearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    router.push(`/jobs?q=${trimmedQuery}`);
  };

  return (
    <div className="sticky top-0 z-40 bg-[#0A0A0F]/95 backdrop-blur-xl pb-4">
      <div
        className="
          flex items-center gap-3
          rounded-2xl border border-white/10
          bg-[#111318]
          px-4 py-3
          shadow-sm
        "
      >
        <Search size={18} className="text-gray-400 shrink-0" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search jobs, skills, companies..."
          aria-label="Search jobs, skills, companies"
          className="
            flex-1 bg-transparent
            text-sm text-white
            placeholder:text-gray-500
            outline-none
          "
        />

        <button
          className="
            flex items-center justify-center
            rounded-xl
            bg-white/5
            p-2
            text-gray-300
            hover:bg-white/10
            transition
          "
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </div>
  );
};

export default HomeSearchBar;