'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, Users, Briefcase, BadgeCheck } from 'lucide-react';
import { companies, jobs, locations } from '@/lib/dummy-data';
import Link from 'next/link';
import CustomSelect from '@/app/components/ui/Select';

type Industry =
  | 'Fintech'
  | 'SaaS'
  | 'E-commerce'
  | 'HealthTech'
  | 'EdTech';

type CompanyCardData = {
  id: string;
  name: string;
  logo: string;
  description: string;
  culture: string;
  employees: number;
  industry: Industry;
  location: string;
  openPositions: number;
  verified: boolean;
};

const industries: Industry[] = [
  'Fintech',
  'SaaS',
  'E-commerce',
  'HealthTech',
  'EdTech',
];

const enrichedCompanies: CompanyCardData[] = companies.map((company, index) => {
  const companyJobs = jobs.filter((job) => job.companyId === company.id);

  return {
    ...company,
    employees: 20 + (index + 1) * 8,
    industry: industries[index % industries.length],
    location: locations[index % locations.length],
    openPositions: companyJobs.length,
    verified: index < 15,
  };
});

const CompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [companySize, setCompanySize] = useState('All');
  const [location, setLocation] = useState('All');
  const [sortBy, setSortBy] = useState('Most Jobs');

  const filteredCompanies = useMemo(() => {
    let result = [...enrichedCompanies];

    if (search) {
      result = result.filter((company) =>
        company.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (industry !== 'All') {
      result = result.filter((company) => company.industry === industry);
    }

    if (location !== 'All') {
      result = result.filter((company) => company.location === location);
    }

    if (companySize !== 'All') {
      result = result.filter((company) => {
        if (companySize === 'Small') return company.employees < 100;
        if (companySize === 'Medium')
          return company.employees >= 100 && company.employees < 300;
        if (companySize === 'Large') return company.employees >= 300;
        return true;
      });
    }

    if (sortBy === 'Most Jobs') {
      result.sort((a, b) => b.openPositions - a.openPositions);
    } else if (sortBy === 'A-Z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Recently Active') {
      result.reverse();
    }

    return result;
  }, [search, industry, companySize, location, sortBy]);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
       <section className="rounded-[2rem] overflow-hidden border border-cyan-500/20 bg-white/[0.04] p-4 sm:p-6 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/10 dark:from-cyan-500/10 dark:via-purple-500/5 to-transparent" />
          <h1 className="text-3xl font-bold sm:text-4xl">
            Companies
          </h1>
          <p className="mt-2 text-secondary">
            Explore top employers hiring across industries.
          </p>
        </section>

        {/* Search + Filters */}
        <section className="card rounded-[2rem] p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input py-3 pl-12 pr-4"
              />
            </div>

            {/* Dropdowns */}
            {[
              {
                value: industry,
                setter: setIndustry,
                options: ['All', ...industries],
              },
              {
                value: companySize,
                setter: setCompanySize,
                options: ['All', 'Small', 'Medium', 'Large'],
              },
              {
                value: location,
                setter: setLocation,
                options: ['All', ...locations],
              },
            ].map((filter, idx) => (
              <CustomSelect
                key={idx}
                value={filter.value}
                onValueChange={filter.setter}
                options={filter.options.map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {['Most Jobs', 'A-Z', 'Recently Active'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  sortBy === option
                    ? 'bg-cyan-500 text-black'
                    : 'border border-[var(--border-primary)] bg-[var(--surface-secondary)] text-secondary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </section>
      </div>
    </div>
  )
}

export default CompaniesPage

function CompanyCard({ company }: { company: CompanyCardData }) {
  return (
    <div className="flex h-full flex-col rounded-[1.5rem] border border-gray-400 dark:border-white/10 dark:bg-white/[0.04] p-3 sm:p-5 backdrop-blur-xl transition hover:dark:border-cyan-500/30 hover:border-gray-600">
      <div className="flex items-start gap-3">
        <Image
          src={company?.logo || ""}
          alt={company?.name ?? 'Company logo'}
          width={44}
          height={44}
          placeholder="blur"
          blurDataURL="/placeholders/company-blur.jpg"
          className="h-11 w-11 shrink-0 rounded-xl bg-zinc-700 p-1"
          unoptimized
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold sm:text-lg">
              {company.name}
            </h3>

            {company.verified && (
              <BadgeCheck size={15} className="shrink-0 text-cyan-400" />
            )}
          </div>

          <p className="text-[11px] text-secondary sm:text-sm">
            {company.industry}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-secondary sm:mt-4 sm:text-sm">
        {company.description}
      </p>

      {/* Stats */}
      <div className="mt-4 grid gap-2 text-[11px] text-secondary sm:text-sm">
        <div className="flex items-center gap-2">
          <Users size={14} className="shrink-0" />
          <span>{company.employees} employees</span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={14} className="shrink-0" />
          <span>{company.openPositions} open roles</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{company.location}</span>
        </div>
      </div>

      <Link
        href={`/companies/${company.id}`}
        className="mt-4 rounded-xl bg-cyan-500 px-3 py-2 text-center text-xs font-semibold text-black sm:mt-6 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
      >
        View Profile
      </Link>
    </div>
  );
}