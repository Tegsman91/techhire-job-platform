// ---------------- TYPES ----------------
export type JobCategory =
  | "Frontend"
  | "Backend"
  | "Full-Stack"
  | "DevOps"
  | "Data Science"
  | "Mobile"
  | "AI/ML";

export type JobType = "Remote" | "Hybrid" | "On-Site";
export type EmploymentType = "Full-Time" | "Part-Time" | "Contract" | "Freelance";
export type ExperienceLevel = "Junior" | "Mid" | "Senior" | "Lead";

export type Job = {
  id: string;
  title: string;
  companyId: string;
  location: string;
  salary: string;
  category: JobCategory;
  skills: string[];
  postedAt: string;
  featured?: boolean;
  urgent?: boolean;
  jobType: JobType;
  employment: EmploymentType;
  experience: ExperienceLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  education: string;
  deadline?: string;
  openPositions: number;
};

export type Company = {
  id: string;
  name: string;
  logo: string;
  description: string;
  culture: string;
  website?: string;
  employees?: number;
  industry?: string;
  founded: number
  location: string;
  verified: boolean;
  perks: string[];
  techStack: string[];
  socials: {
    linkedin: string;
    twitter: string;
    github: string;
  };
};

export type Candidate = {
  id: string;
  name: string;
  skills: string[];
  experience: number;
  resume: string;
};

export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected";

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
};

export type Interview = {
  id: string;
  applicationId: string;
  date: string;
  type: "Technical" | "HR" | "System Design";
};

export type ReviewRole =
  | "Engineer"
  | "Designer"
  | "Product Manager"
  | "Data Analyst"
  | "QA Engineer"
  | "DevOps Engineer";

export type Review = {
  id: string;
  companyId: string;
  role: ReviewRole;
  rating: number;
  text: string;
  date: string;
  helpfulVotes: number;
  breakdown: {
    workLifeBalance: number;
    culture: number;
    compensation: number;
    management: number;
  };
};

// ---------------- DATA POOLS ----------------
const jobTypes: JobType[] = ["Remote", "Hybrid", "On-Site"];

const employmentTypes: EmploymentType[] = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Freelance",
];

export const experienceLevels: ExperienceLevel[] = [
  "Junior",
  "Mid",
  "Senior",
  "Lead",
];

export const skillsPool = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Docker",
  "AWS",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Tailwind",
];

const jobTitles = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "ML Engineer",
];

const salaryByRole: Record<string, string[]> = {
  "Frontend Engineer": ["₦800k - ₦1.5M"],
  "Backend Engineer": ["₦600k - ₦1.2M"],
  "Full Stack Developer": ["₦1M - ₦2M"],
  "DevOps Engineer": ["₦800k - ₦1.2M"],
  "Data Scientist": ["₦500k - ₦1M"],
  "ML Engineer": ["₦1M - ₦2M"],
};

const defaultSeed = "techhire-dummy-data";

const xmur3 = (seed: string) => {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
};

const createSeededRandom = (seed: string | number) => {
  let state = typeof seed === "number" ? seed >>> 0 : xmur3(seed)();

  const next = () => {
    state = Math.imul(state, 1664525) + 1013904223;
    return (state >>> 0) / 0x100000000;
  };

  return {
    next,
    pick: <T>(arr: T[]): T => {
      if (arr.length === 0) {
        throw new Error("Array cannot be empty");
      }
      return arr[Math.floor(next() * arr.length)];
    },
    int: (max: number): number => Math.floor(next() * max),
  };
};

type SeededRandom = ReturnType<typeof createSeededRandom>;

const getSalaryByRole = (title: string, rng: SeededRandom): string => {
  const match = Object.keys(salaryByRole).find((role) =>
    title.toLowerCase().includes(role.toLowerCase())
  );

  if (!match) return "₦500k - ₦1M";

  const ranges = salaryByRole[match];
  return ranges[rng.int(ranges.length)];
};

const titleToCategory: Record<string, JobCategory> = {
  "Frontend Engineer": "Frontend",
  "Backend Engineer": "Backend",
  "Full Stack Developer": "Full-Stack",
  "DevOps Engineer": "DevOps",
  "Data Scientist": "Data Science",
  "ML Engineer": "AI/ML",
};

const deriveCategoryFromTitle = (title: string): JobCategory =>
  titleToCategory[title] ?? ("Backend" as JobCategory);

const physicalLocations = ["Abuja", "Jos", "Ibadan", "Lagos", "Victoria Island", "Lekki", "Ikeja"];

export const locations = ["Remote", ...physicalLocations];

const random = <T>(arr: T[], rng: SeededRandom): T => {
  if (arr.length === 0) {
    throw new Error("Array cannot be empty");
  }
  return arr[rng.int(arr.length)];
};

const randomSkills = (rng: SeededRandom) => {
  const set = new Set<string>();
  const target = Math.min(3, skillsPool.length);

  while (set.size < target) {
    set.add(random(skillsPool, rng));
  }

  return Array.from(set);
};

const MOCK_NOW = new Date("2026-04-01T00:00:00.000Z").getTime();

const createDeterministicDate = (
  rng: SeededRandom,
  index = 0
): string => {
  let daysAgo: number;

  if (index % 5 === 0) {
    daysAgo = 0;
  } else if (index % 5 <= 2) {
    daysAgo = rng.int(7);
  } else {
    daysAgo = rng.int(30);
  }

  return new Date(
    MOCK_NOW - daysAgo * 24 * 60 * 60 * 1000
  ).toISOString();
};

const descriptions = [
  "We are looking for a highly motivated engineer to build scalable digital products for millions of users.",
  "Join our fast-growing team to create innovative software solutions in a collaborative environment.",
];

const requirementPool = [
  "3+ years of professional experience",
  "Strong knowledge of React and TypeScript",
  "Experience with REST APIs",
  "Excellent communication skills",
  "Ability to work independently",
];

const responsibilityPool = [
  "Develop and maintain scalable applications",
  "Collaborate with cross-functional teams",
  "Write clean, maintainable code",
  "Participate in technical reviews",
];

const educationPool = [
  "Bachelor’s degree in Computer Science or related field",
  "Equivalent practical experience accepted",
];

const reviewRoles: ReviewRole[] = [
  "Engineer",
  "Designer",
  "Product Manager",
  "Data Analyst",
  "QA Engineer",
  "DevOps Engineer",
];

const reviewTexts = [
  "Great environment for learning and growth. Leadership encourages innovation.",
  "Flexible work culture and strong engineering standards.",
  "Compensation is competitive, though workload can be intense during launches.",
  "Management is supportive and transparent with team goals.",
  "Excellent culture with collaborative teammates across departments.",
  "Good place to build experience, but internal processes could improve.",
  "Strong work-life balance and benefits package.",
  "Fast-paced company with many opportunities for career progression.",
];


// ---------------- DUMMY DATA ----------------
export const companies: Company[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `company-${i + 1}`,
  name: `TechCorp ${i + 1}`,
  logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
    `TechCorp ${i + 1}`
  )}`,
  description: "Innovative tech company building future solutions.",
  culture: "Remote-first, async communication, engineering-driven.",
  website: `https://techcorp${i + 1}.com`,
  employees: 50 + i * 12,
  industry: ["Fintech", "SaaS", "E-commerce", "HealthTech", "EdTech"][i % 5],
  founded: 2015 + (i % 8),
  location: physicalLocations[i % physicalLocations.length],
  verified: i < 20,
  perks: [
    "Remote-first",
    "Unlimited PTO",
    "Health Insurance",
    "Equity Options",
  ],
  techStack: ["React", "Node.js", "AWS", "PostgreSQL", "Python"].slice(
    0,
    3 + (i % 3)
  ),
  socials: {
    linkedin: `https://linkedin.com/company/techcorp${i + 1}`,
    twitter: `https://twitter.com/techcorp${i + 1}`,
    github: `https://github.com/techcorp${i + 1}`,
  },
}));

export const createJobs = (seed = defaultSeed): Job[] => {
  const rng = createSeededRandom(`${seed}-jobs`);
  const randomItem = <T>(arr: T[]): T => random(arr, rng);

  return Array.from({ length: 120 }).map((_, i) => {
    const title = randomItem(jobTitles);

    const jobType = randomItem(jobTypes);

    const location =
    jobType === "Remote"
      ? "Remote"
      : randomItem(physicalLocations);

    return {
      id: `job-${i + 1}`,
      title,
      companyId: randomItem(companies).id,
      location,
      salary: getSalaryByRole(title, rng),
      category: deriveCategoryFromTitle(title),
      skills: randomSkills(rng),
      postedAt: createDeterministicDate(rng, i),
      featured: rng.next() > 0.8,
      urgent: rng.next() > 0.85,
      jobType,
      employment: randomItem(employmentTypes),
      experience: randomItem(experienceLevels),
      description: randomItem(descriptions),
      requirements: [...requirementPool]
        .sort(() => rng.next() - 0.5)
        .slice(0, 4),
      responsibilities: [...responsibilityPool]
        .sort(() => rng.next() - 0.5)
        .slice(0, 4),
      benefits: [...benefits]
        .sort(() => rng.next() - 0.5)
        .slice(0, 4),
      education: randomItem(educationPool),
      deadline: new Date(
        MOCK_NOW + (rng.int(30) + 7) * 24 * 60 * 60 * 1000
      ).toISOString(),
      openPositions: rng.int(8) + 1,
    };
  });
};

export const createCandidates = (seed = defaultSeed): Candidate[] => {
  const rng = createSeededRandom(`${seed}-candidates`);

  return Array.from({ length: 30 }).map((_, i) => ({
    id: `candidate-${i + 1}`,
    name: `Candidate ${i + 1}`,
    skills: randomSkills(rng),
    experience: rng.int(10) + 1,
    resume: `/resumes/resume-${i + 1}.pdf`,
  }));
};

export const createApplications = (
  jobs: Job[],
  candidates: Candidate[],
  seed = defaultSeed
): Application[] => {
  const rng = createSeededRandom(`${seed}-applications`);
  const randomItem = <T>(arr: T[]): T => random(arr, rng);

  const seenPairs = new Set<string>();
  const applications: Application[] = [];
  let id = 1;

  const maxPairs = jobs.length * candidates.length;
  const target = Math.min(80, maxPairs);
  let attempts = 0;

  while (applications.length < target && attempts < maxPairs) {
    const jobId = randomItem(jobs).id;
    const candidateId = randomItem(candidates).id;
    const pairKey = `${jobId}|${candidateId}`;
    attempts++;

    if (!seenPairs.has(pairKey)) {
      seenPairs.add(pairKey);
      applications.push({
        id: `application-${id}`,
        jobId,
        candidateId,
        status: randomItem([
          "Applied",
          "Screening",
          "Interview",
          "Offer",
          "Rejected",
        ]) as ApplicationStatus,
        appliedAt: createDeterministicDate(rng, id),
      });
      id++;
    }
  }

  return applications;
};

export const createInterviews = (
  applications: Application[],
  seed = defaultSeed
): Interview[] => {
  if (applications.length === 0) {
    return [];
  }

  const rng = createSeededRandom(`${seed}-interviews`);
  const randomItem = <T>(arr: T[]): T => random(arr, rng);

  return Array.from({ length: 40 }).map((_, i) => ({
    id: `interview-${i + 1}`,
    applicationId: randomItem(applications).id,
    date: new Date(
      MOCK_NOW + (rng.int(20) + 1) * 24 * 60 * 60 * 1000
    ).toISOString(),
    type: randomItem(["Technical", "HR", "System Design"]) as Interview["type"],
  }));
};

export const salaryRanges = [
  { role: "Frontend Engineer", range: "₦800k - ₦1.5M" },
  { role: "Backend Engineer", range: "₦600k - ₦1.2M" },
  { role: "Full Stack Developer", range: "₦1M - ₦2M" },
  { role: "DevOps Engineer", range: "₦800k - ₦1.2M" },
  { role: "Data Scientist", range: "₦500k - ₦1M" },
  { role: "ML Engineer", range: "₦1M - ₦2M" },
];

export const benefits = [
  "Health Insurance",
  "Remote Work",
  "Stock Options",
  "Unlimited PTO",
  "Learning Budget",
];

export const createReviews = (
  companies: Company[],
  seed = defaultSeed
): Review[] => {
  const rng = createSeededRandom(`${seed}-reviews`);
  const randomItem = <T>(arr: T[]): T => random(arr, rng);

  return Array.from({ length: 180 }).map((_, i) => {
    const rating = rng.int(5) + 1;

    return {
      id: `review-${i + 1}`,
      companyId: randomItem(companies).id,
      role: randomItem(reviewRoles),
      rating,
      text: randomItem(reviewTexts),
      date: createDeterministicDate(rng, i),
      helpfulVotes: rng.int(120),
      breakdown: {
        workLifeBalance: Math.max(1, Math.min(5, rating + (rng.int(3) - 1))),
        culture: Math.max(1, Math.min(5, rating + (rng.int(3) - 1))),
        compensation: Math.max(1, Math.min(5, rating + (rng.int(3) - 1))),
        management: Math.max(1, Math.min(5, rating + (rng.int(3) - 1))),
      },
    };
  });
};

export const jobs = createJobs();

export const reviews = createReviews(companies);

// ---------------- TAGS ----------------
export const skillTags = skillsPool;

export const jobCategories: JobCategory[] = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "DevOps",
  "Data Science",
  "Mobile",
  "AI/ML",
];
