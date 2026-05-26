import ApplicationModal from "@/app/components/application/application-modal";
import JobActions from "@/app/components/jobs/job-actions";
import JobCard from "@/app/components/jobs/job-card";
import Badge from "@/app/components/ui/Badge";
import { companies, jobs } from "@/lib/dummy-data";
import { parseSalaryRange } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);

  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} | TechHire`,
    description: `Apply for ${job.title} at top tech companies.`,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);

  if (!job) return notFound();

  const company = companies.find((c) => c.id === job.companyId);

  if (!company) return notFound();

  const parsedSalary = parseSalaryRange(job.salary);

  const similarJobs = jobs.filter(
    (j) => j.category === job.category && j.id !== job.id
  ).slice(0, 4);

  const daysLeft = 12;

  const validThrough = new Date(
    new Date(job.postedAt).getTime() + daysLeft * 24 * 60 * 60 * 1000
  ).toISOString();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0F] text-zinc-900 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.description,
            employmentType: job.employment,
            datePosted: job.postedAt,
            validThrough,
            hiringOrganization: {
              "@type": "Organization",
              name: company.name,
              logo: company.logo,
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: job.location,
                addressCountry: "NG",
              },
            },
            baseSalary: parsedSalary
              ? {
                  "@type": "MonetaryAmount",
                  currency: "NGN",
                  value: {
                    "@type": "QuantitativeValue",
                    minValue: parsedSalary.minValue,
                    maxValue: parsedSalary.maxValue,
                  },
                }
              : undefined,
            skills: job.skills,
          }),
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8 space-y-8 sm:space-y-10">

        {/* HERO */}
        <section
          className="
            relative overflow-hidden w-full rounded-[28px]
            bg-white dark:bg-white/5
            backdrop-blur-2xl
            border border-zinc-200 dark:border-white/10
            shadow-lg dark:shadow-[0_0_40px_rgba(6,182,212,0.08)]
            before:absolute before:inset-0
            before:bg-linear-to-r
            before:from-cyan-500/5 before:via-purple-500/5 before:to-pink-500/5
            dark:before:from-cyan-500/10 dark:before:via-purple-500/10 dark:before:to-pink-500/10
            before:opacity-70
            px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10
          "
        >
          <div
            className="
              relative z-10 w-full min-w-0
              flex flex-col gap-6
              lg:flex-row lg:items-start lg:justify-between
            "
          >
            <div
              className="
                w-full min-w-0 flex flex-col
                sm:flex-row gap-5 sm:items-start flex-1
              "
            >
              <Image
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${company.name}`}
                alt={company.name}
                width={80}
                height={80}
                placeholder="blur"
                blurDataURL="/placeholders/company-blur.jpg"
                className="
                  rounded-2xl
                  bg-zinc-100 dark:bg-zinc-900
                  border border-zinc-200 dark:border-white/10
                  p-3
                "
              />

              <div className="flex-1 min-w-0 w-full">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  {job.title}
                </h1>

                <p className="text-zinc-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                  {company.name} • {job.location}
                </p>

                <p className="text-cyan-600 dark:text-cyan-400 font-semibold mt-3 text-lg">
                  {job.salary}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge size="sm">{job.jobType}</Badge>
                  <Badge size="sm">{job.employment}</Badge>
                  <Badge size="sm">{job.experience}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start lg:self-center">
                <JobActions jobId={job.id} />
              </div>
            </div>
          </div>
        </section>

        {/* MAIN */}
        <section className="w-full min-w-0 grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8 min-w-0 w-full">
            <ContentBlock title="Job Description">
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {job.description}
              </p>
            </ContentBlock>

            <ListBlock title="Requirements" items={job.requirements} />

            <ListBlock
              title="Responsibilities"
              items={job.responsibilities}
            />

            <ListBlock title="Benefits" items={job.benefits} />

            <ContentBlock title="Skills Required">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </ContentBlock>
          </div>

          {/* SIDEBAR */}
          <aside
            className="
              sticky top-6 h-fit rounded-[28px] w-full
              bg-white dark:bg-zinc-900/80
              backdrop-blur-xl
              border border-zinc-200 dark:border-cyan-500/20
              shadow-lg dark:shadow-[0_0_30px_rgba(6,182,212,0.08)]
              p-4 sm:p-6 lg:p-7
            "
          >
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={company.logo}
                alt={company.name}
                width={56}
                height={56}
                placeholder="blur"
                blurDataURL="/placeholders/company-blur.jpg"
                className="
                  rounded-2xl
                  bg-zinc-100 dark:bg-zinc-800
                  border border-zinc-200 dark:border-white/10
                  p-2
                "
                unoptimized
              />

              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">
                  {company.name}
                </h3>

                <p className="text-sm text-zinc-500 dark:text-gray-400">
                  Hiring across {job.category}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold">
              Company Info
            </h3>

            <p className="mt-3 text-zinc-600 dark:text-gray-400 leading-relaxed">
              {company.description}
            </p>

            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
              Open Positions: 8
            </p>

            <p className="mt-2 text-orange-500 dark:text-orange-400">
              Deadline in {daysLeft} days
            </p>

            <Link
              href={`/companies/${company.id}`}
              className="
                block mt-4 font-medium
                text-cyan-600 dark:text-cyan-400
                hover:underline
              "
            >
              View Company Profile
            </Link>

            <div className="hidden lg:block mt-4">
              <ApplicationModal
                jobTitle={job.title}
                jobId={job.id}
              />
            </div>
          </aside>
        </section>

        {/* SIMILAR JOBS */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Similar Jobs
          </h2>

          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar">
            {similarJobs.map((similarJob) => (
              <div
                key={similarJob.id}
                className="
                  min-w-[85vw] sm:min-w-[320px]
                  max-w-[85vw] sm:max-w-[380px]
                  snap-start flex-shrink-0
                "
              >
                <JobCard job={similarJob} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MOBILE APPLY BAR */}
      <div
        className="
          lg:hidden fixed bottom-0 inset-x-0
          bg-white/95 dark:bg-[#0A0A0F]/95
          backdrop-blur-xl
          border-t border-zinc-200 dark:border-white/10
          p-4
        "
      >
        <ApplicationModal
          jobTitle={job.title}
          jobId={job.id}
        />
      </div>
    </div>
  );
}

function ContentBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-[26px] w-full
        bg-white dark:bg-zinc-900/70
        backdrop-blur-xl
        border border-zinc-200 dark:border-white/10
        shadow-lg dark:shadow-[0_0_25px_rgba(255,255,255,0.03)]
        p-4 sm:p-6 lg:p-7
      "
    >
      <h3 className="text-2xl font-semibold mb-4">
        {title}
      </h3>

      <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <ContentBlock title={title}>
      <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </ContentBlock>
  );
}
