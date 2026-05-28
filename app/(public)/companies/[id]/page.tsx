import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import type { Metadata } from 'next';
import { companies, jobs, skillsPool, reviews } from '@/lib/dummy-data';
import Badge from '@/app/components/ui/Badge';
import JobCard from '@/app/components/jobs/job-card';
import FollowButton from '@/app/components/company/follow-button';
import Link from 'next/link';
import EmployeeReviewsSection from '@/app/components/company/employee-reviews';
import EmployeeTestimonialCard from '@/app/components/company/employee-testimonial-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const company = companies.find((c) => c.id === id);

  if (!company) {
    return {
      title: 'Company Not Found',
      description: 'The requested company profile does not exist.',
    };
  }

  return {
    title: `${company.name} | Company Profile`,
    description: `${company.name} is a ${company.industry} company located in ${company.location}. Explore culture, roles, and opportunities.`,
  };
}

type CompanyProfileProps = {
  params: Promise<{ id: string }>;
};

const CompanyProfilePage = async ({ params }: CompanyProfileProps) => {
  const { id: companyId } = await params;
  
  const company = companies.find((c) => c.id === companyId);

  const openJobs = jobs.filter((job) => job.companyId === companyId);


  if (!company) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] px-4 py-10 text-white">
        <h1 className="text-2xl font-bold">Company not found</h1>
      </div>
    );
  }

  const teamMembers = [
    { id: 1, name: 'Aisha Bello', role: 'Product Lead' },
    { id: 2, name: 'David Kim', role: 'Engineering Manager' },
    { id: 3, name: 'Sophia Grant', role: 'UX Designer' },
    { id: 4, name: 'Michael Torres', role: 'DevOps Engineer' },
  ];

  const socialLinks = [
    { icon: FaLinkedin, href: company.socials.linkedin, label: 'LinkedIn' },
    { icon: FaTwitter, href: company.socials.twitter, label: 'Twitter' },
    { icon: FaGithub, href: company.socials.github, label: 'GitHub' },
  ].filter((link) => link.href);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] dark:bg-[#0A0A0F] px-4 py-2 text-[var(--text-primary)] sm:px-4 lg:px-8 no-scrollbar">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_top_left,rgba(168,85,247,0.10),transparent_30%)]" />

      <div className="mx-auto w-full max-w-7xl py-4 space-y-8">
        <section
          className="
            relative overflow-hidden rounded-[2rem]
            border border-black/10 dark:border-cyan-500/20
            bg-white dark:bg-white/[0.04]
            p-5 sm:p-8
            backdrop-blur-2xl
            shadow-sm dark:shadow-[0_0_40px_rgba(34,211,238,0.08)]
          "
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/10 dark:from-cyan-500/10 dark:via-purple-500/5 to-transparent" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div
                className="
                  w-fit rounded-[1.5rem]
                  border border-black/10 dark:border-white/10
                  bg-black/[0.07] dark:bg-black/40
                  p-4
                  shadow-sm dark:shadow-[0_0_30px_rgba(6,182,212,0.12)]
                "
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={100}
                  height={110}
                  unoptimized
                  className="h-20 w-20 sm:h-24 sm:w-24"
                />
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  {company.verified && (
                    <Badge className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Verified
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  {company.name}
                </h1>

                <p className="mt-3 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
                  {company.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-700 dark:text-cyan-300">
                    {company.industry}
                  </span>
                </div>
              </div>
            </div>

            <FollowButton companyId={company.id} />
          </div>
        </section>

        <section className="rounded-[2rem]
          border border-black/10 dark:border-white/10
          bg-white dark:bg-white/[0.04]
          shadow-sm dark:shadow-none p-6 sm:p-8 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
            Company Stats
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {[
              { label: 'Founded', value: `${company.founded}` },
              { 
                label: 'Company Size', value: `${company.employees}+` 
              },
              { label: 'HQ Location', value: company.location },
              { 
                label: 'Open Positions', value: `${openJobs.length}` 
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="
                  rounded-3xl
                  border border-cyan-500/10 dark:border-cyan-500/15
                  bg-black/[0.02] dark:bg-black/30
                  p-6 text-center
                  backdrop-blur-xl
                  shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.06)]
                  hover:scale-[1.02]
                  transition-transform
                "
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">
                  {stat.label}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-cyan-700 dark:text-cyan-400">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Perks + Tech */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem]
            border border-black/10 dark:border-white/10
            bg-white dark:bg-white/[0.04]
            shadow-sm dark:shadow-none p-6 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
              Culture & Perks
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {company.perks.map((perk) => (
                <div
                  key={perk}
                  className="
                    flex items-center gap-2 rounded-2xl
                    bg-black/[0.03] dark:bg-white/5
                    px-4 py-3
                    text-[var(--text-primary)]
                  "
                >
                  <CheckCircle2 size={16} className="text-cyan-400" />
                  {perk}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem]
            border border-black/10 dark:border-white/10
            bg-white dark:bg-white/[0.04]
            shadow-sm dark:shadow-none p-6 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
              Tech Stack
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {skillsPool.map((skill) => (
                <Badge
                  key={skill}
                  className="
                    bg-black/[0.04] dark:bg-white/5
                    text-[var(--text-primary)]
                    border border-black/10 dark:border-white/10
                  "
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="rounded-[2rem]
          border border-black/10 dark:border-white/10
          bg-white dark:bg-white/[0.04]
          shadow-sm dark:shadow-none p-6 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
            Open Positions
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {openJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  featured: index === 0,
                  urgent: index === 1,
                }}
                layout="grid"
              />
            ))}
          </div>
        </section>

        <EmployeeReviewsSection
          companyId={company.id}
          reviews={reviews}
        />

        <section
          className="
            rounded-[2rem]
            border border-black/10 dark:border-white/10
            bg-white dark:bg-white/[0.04]
            p-6 backdrop-blur-xl
          "
        >
          <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
            Employee Testimonials
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {company.testimonials?.map((testimonial) => (
              <EmployeeTestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem]
          border border-black/10 dark:border-white/10
          bg-white dark:bg-white/[0.04]
          shadow-sm dark:shadow-none p-6 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
            Meet the Team
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="
                  rounded-2xl
                  border border-black/10 dark:border-white/10
                  bg-white dark:bg-black/25
                  backdrop-blur-xl
                  shadow-sm dark:shadow-[0_0_18px_rgba(6,182,212,0.04)]
                  p-4 text-center
                  hover:border-cyan-400/20
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <Image
                  src={`https://randomuser.me/api/portraits/${
                    member.id % 2 === 0 ? 'women' : 'men'
                  }/${member.id + 20}.jpg`}
                  alt={member.name}
                  width={72}
                  height={72}
                  placeholder="blur"
                  blurDataURL="/placeholders/company-blur.jpg"
                  unoptimized
                  className="mx-auto h-16 w-16 rounded-2xl object-cover"
                />

                <h3 className="mt-3 text-sm font-semibold">
                  {member.name}
                </h3>

                <p className="text-xs text-[var(--text-secondary)]">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Social */}
        <section className="rounded-[2rem]
          border border-black/10 dark:border-white/10
          bg-white dark:bg-white/[0.04]
          shadow-sm dark:shadow-none p-6 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 tracking-tight">
            Connect
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-2
                    rounded-2xl
                    border border-black/10 dark:border-white/10
                    bg-white dark:bg-black/30
                    text-[var(--text-primary)]
                    backdrop-blur-xl
                    shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.04)]
                    px-4 py-3
                    hover:border-cyan-400/40
                    transition
                  "
                >
                  <Icon size={16} className="text-cyan-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default CompanyProfilePage