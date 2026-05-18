import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Filters = {
  jobType: string[];
  experience: string[];
  employment: string[];
  salary: [number, number];
  skills: string[];
  location: string;
  posted: string | null;
  view: "grid" | "list";
  sort: string;
};

type JobFilterStore = {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
};

const initialFilters: Filters = {
  jobType: [],
  experience: [],
  employment: [],
  salary: [0, 50000000],
  skills: [],
  location: "",
  posted: null,
  view: "grid",
  sort: "recent",
};

export const useJobFilters = create<JobFilterStore>((set) => ({
  filters: initialFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}));

/* ================= SAVED JOBS STORE ================= */

type SavedJobsStore = {
  savedJobs: string[];
  toggleSavedJob: (jobId: string) => void;
};

export const useSavedJobsStore = create<SavedJobsStore>()(
  persist(
    (set) => ({
      savedJobs: [],

      toggleSavedJob: (jobId) =>
        set((state) => ({
          savedJobs: state.savedJobs.includes(jobId)
            ? state.savedJobs.filter((id) => id !== jobId)
            : [...state.savedJobs, jobId],
        })),
    }),
    {
      name: "saved-jobs-storage",
      skipHydration: true,
    }
  )
);

/* ================= APPLICATION STORE ================= */

export type ApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export type ApplicationItem = {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  appliedAt: string;
  status: ApplicationStatus;
  nextStep?: string;
  notes?: string
  rating?: number;

  applicant: {
    fullName: string;
    email: string;
    phone: string;
    coverLetter: string;
    linkedin?: string;
    portfolio?: string;
    fitReason: string;
    resumeName?: string;

    resumeUrl?: string;

    skills?: string[];

    screeningAnswers?: {
      question: string;
      answer: string;
    }[];
  };
};

const dummyApplications: ApplicationItem[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Frontend Developer",
    companyName: "TechNova",
    companyLogo: "/images/company-logos/logo-1.png",
    appliedAt: "2026-08-10T12:00:00Z",
    status: "Applied",
    nextStep: "Application received",
    notes: "Strong React portfolio. Needs deeper TypeScript review.",
    rating: 4,
    applicant: {
      fullName: "John Chris",
      email: "john@example.com",
      phone: "08012345678",
      coverLetter:
        "Excited to contribute to building scalable and accessible frontend experiences for modern products.",
      fitReason:
        "Strong frontend experience with React, Next.js, and TailwindCSS.",
      linkedin: "https://linkedin.com/in/johnchris",
      portfolio: "https://johnchris.dev",
      resumeName: "John-Chris-Resume.pdf",
      resumeUrl: "/resume/john-chris.pdf",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "Framer Motion",
      ],
      screeningAnswers: [
        {
          question: "How many years of React experience do you have?",
          answer: "4 years",
        },
        {
          question: "Have you worked remotely before?",
          answer: "Yes, for 2 years.",
        },
      ],
    },
  },

  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Backend Engineer",
    companyName: "CloudBase",
    companyLogo: "/images/company-logos/logo-2.png",
    appliedAt: "2026-08-08T09:30:00Z",
    status: "Screening",
    nextStep: "Technical assessment pending",
    notes: "Excellent Node.js background.",
    rating: 5,
    applicant: {
      fullName: "Sarah Williams",
      email: "sarah@example.com",
      phone: "08123456789",
      coverLetter:
        "Passionate about building reliable distributed systems and cloud-native backend infrastructure.",
      fitReason:
        "Strong Node.js and cloud expertise with AWS and PostgreSQL.",
      linkedin: "https://linkedin.com/in/sarahwilliams",
      portfolio: "https://sarahbackend.dev",
      resumeName: "Sarah-Williams-Resume.pdf",
      resumeUrl: "/resume/sarah-williams.pdf",
      skills: [
        "Node.js",
        "Express",
        "PostgreSQL",
        "Docker",
        "AWS",
      ],
      screeningAnswers: [
        {
          question: "Have you worked with microservices?",
          answer: "Yes, in my last two roles.",
        },
        {
          question: "Preferred backend stack?",
          answer: "Node.js + PostgreSQL",
        },
      ],
    },
  },

  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "Product Designer",
    companyName: "PixelWorks",
    companyLogo: "/images/company-logos/logo-3.png",
    appliedAt: "2026-08-05T14:15:00Z",
    status: "Interview",
    nextStep: "HR interview scheduled",
    notes: "Very strong UI case studies.",
    rating: 4,
    applicant: {
      fullName: "Michael Ebenezer",
      email: "michael@example.com",
      phone: "07098765432",
      coverLetter:
        "Designing user-first digital products that balance aesthetics and usability is my biggest passion.",
      fitReason:
        "5+ years in UI/UX strategy and product design systems.",
      linkedin: "https://linkedin.com/in/michaelebenezer",
      portfolio: "https://michaeldesigns.dev",
      resumeName: "Michael-Ebenezer-Resume.pdf",
      resumeUrl: "/resume/michael-ebenezer.pdf",
      skills: [
        "Figma",
        "Design Systems",
        "UX Research",
        "Wireframing",
        "Prototyping",
      ],
      screeningAnswers: [
        {
          question: "Have you built design systems before?",
          answer: "Yes, for two SaaS startups.",
        },
      ],
    },
  },

  {
    id: "app-4",
    jobId: "job-4",
    jobTitle: "DevOps Engineer",
    companyName: "InfraTech",
    companyLogo: "/images/company-logos/logo-4.png",
    appliedAt: "2026-08-02T11:00:00Z",
    status: "Offer",
    nextStep: "Awaiting candidate response",
    notes: "Perfect match for infrastructure role.",
    rating: 5,
    applicant: {
      fullName: "Amina Yusuf",
      email: "amina@example.com",
      phone: "09012344321",
      coverLetter:
        "Ready to optimize infrastructure workflows and improve CI/CD reliability across teams.",
      fitReason:
        "Expertise in CI/CD, Kubernetes, Terraform, and AWS.",
      linkedin: "https://linkedin.com/in/aminayusuf",
      portfolio: "https://aminadevops.dev",
      resumeName: "Amina-Yusuf-Resume.pdf",
      resumeUrl: "/resume/amina-yusuf.pdf",
      skills: [
        "Docker",
        "Kubernetes",
        "Terraform",
        "AWS",
        "CI/CD",
      ],
      screeningAnswers: [
        {
          question: "Experience with Kubernetes?",
          answer: "3 years managing production clusters.",
        },
      ],
    },
  },

  {
    id: "app-5",
    jobId: "job-5",
    jobTitle: "Data Analyst",
    companyName: "InsightHub",
    companyLogo: "/images/company-logos/logo-5.png",
    appliedAt: "2026-07-30T16:45:00Z",
    status: "Rejected",
    nextStep: "Application closed",
    notes: "Good communication but lacked SQL depth.",
    rating: 3,
    applicant: {
      fullName: "David Johnson",
      email: "david@example.com",
      phone: "08099887766",
      coverLetter:
        "Driven by turning complex data into actionable business insights that improve decision-making.",
      fitReason:
        "Advanced analytics and reporting skills with strong Excel expertise.",
      linkedin: "https://linkedin.com/in/davidjohnson",
      portfolio: "https://davidanalytics.dev",
      resumeName: "David-Johnson-Resume.pdf",
      resumeUrl: "/resume/david-johnson.pdf",
      skills: [
        "SQL",
        "Power BI",
        "Excel",
        "Python",
        "Data Visualization",
      ],
      screeningAnswers: [
        {
          question: "What analytics tools do you use most?",
          answer: "Power BI, SQL, and Python.",
        },
      ],
    },
  },
];

const initialApplications: ApplicationItem[] =
  process.env.NODE_ENV === "development"
    ? dummyApplications
    : [];

type ApplicationsStore = {
  applications: ApplicationItem[];
  addApplication: (application: ApplicationItem) => void;
  withdrawApplication: (id: string) => void;
  updateApplicationNotes: (id: string, notes: string) => void;
};

export const useApplicationsStore = create<ApplicationsStore>()(
  persist(
    (set) => ({
      applications: initialApplications,

      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, application],
        })),

      withdrawApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),

      updateApplicationNotes: (id, notes) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, notes } : app
          ),
        })),
    }),

    {
      name: 'applications-storage',
      skipHydration: true,
    }
  )
);

/* ================= FOLLOWED COMPANIES STORE ================= */

type FollowedCompaniesStore = {
  followedCompanies: string[];
  toggleFollowCompany: (companyId: string) => void;
};

export const useFollowedCompaniesStore = create<FollowedCompaniesStore>()(
  persist(
    (set) => ({
      followedCompanies: [],

      toggleFollowCompany: (companyId) =>
        set((state) => ({
          followedCompanies: state.followedCompanies.includes(companyId)
            ? state.followedCompanies.filter((id) => id !== companyId)
            : [...state.followedCompanies, companyId],
        })),
    }),
    {
      name: "followed-companies-storage",
      skipHydration: true,
    }
  )
);

/* ================= EMPLOYER JOBS STORE ================= */

export type EmployerJobStatus = 'draft' | 'published' | 'closed';

export type EmployerJobItem = {
  id: string;
  title: string;
  category: string;
  locationType: 'Remote' | 'Hybrid' | 'On-site';
  city: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';

  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];

  salaryMin: number;
  salaryMax: number;
  currency: string;
  benefits: string[];

  deadline: string;
  screeningQuestions?: string[];

  applicationsCount: number;
  viewsCount: number;

  status: EmployerJobStatus;
  createdAt: string;
};

type EmployerJobsStore = {
  employerJobs: EmployerJobItem[];
  addEmployerJob: (job: EmployerJobItem) => void;
  updateEmployerJob: (id: string, updates: Partial<EmployerJobItem>) => void;
};

export const useEmployerJobsStore = create<EmployerJobsStore>()(
  persist(
    (set) => ({
      employerJobs: [],

      addEmployerJob: (job) =>
        set((state) => ({
          employerJobs: state.employerJobs.some((existing) => existing.id === job.id)
            ? state.employerJobs.map((existing) =>
                existing.id === job.id ? job : existing
              )
            : [...state.employerJobs, job],
        })),

      updateEmployerJob: (id, updates) =>
        set((state) => ({
          employerJobs: state.employerJobs.map((job) =>
            job.id === id ? { ...job, ...updates } : job
          ),
        })),

    }),
    {
      name: 'employer-jobs-storage',
      // skipHydration: true,
    }
  )
);

/* ================= COMPANY PROFILE STORE ================= */

export type CompanyProfile = {
  companyName: string;
  tagline: string;
  industry: string;
  companySize: string;
  foundedYear: string;
  website: string;

  about: string;

  logo: string | null;

  perks: string[];
  techStack: string[];

  linkedin: string;
  twitter: string;
  github: string;

  gallery: string[];
};

type CompanyProfileStore = {
  profile: CompanyProfile | null;

  updateProfile: (
    profile: CompanyProfile
  ) => void;
};

export const useCompanyProfileStore =
  create<CompanyProfileStore>()(
    persist(
      (set) => ({
        profile: {
          companyName: 'TechHire Labs',
          tagline:
            'Building the future of hiring',

          industry: 'Software Development',

          companySize: '51-200',

          foundedYear: '2021',

          website: 'https://techhire.com',

          about:
            '<p>TechHire helps companies connect with world-class developers.</p>',

          logo: '/images/company-logo.png',

          perks: [
            'Remote-first',
            'Unlimited PTO',
          ],

          techStack: [
            'React',
            'Next.js',
            'AWS',
          ],

          linkedin:
            'https://linkedin.com/company/techhire',

          twitter:
            'https://twitter.com/techhire',

          github:
            'https://github.com/techhire',

          gallery: [],
        },

        updateProfile: (profile) =>
          set({
            profile,
          }),
      }),

      {
        name: 'company-profile-storage',
        skipHydration: true,
      }
    )
  );

/* ================= RESUME STORE ================= */

  export type ResumeTemplate =
  | 'modern'
  | 'classic'
  | 'tech'
  | 'minimal';

export type ResumeExperience = {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  present: boolean;
  description: string;
};

export type ResumeEducation = {
  id: string;
  school: string;
  degree: string;
  dates: string;
};

export type ResumeProject = {
  id: string;
  title: string;
  description: string;
  link: string;
  techStack: string[];
  newTech?: string;
};

export type ResumeCertification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

export type ResumeData = {
  template: ResumeTemplate;

  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };

  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  sectionOrder: string[];
};

type ResumeStore = {
  resume: ResumeData;
  saveResume: (resume: ResumeData) => void;
};

const defaultResume: ResumeData = {
  template: 'modern',

  personal: {
    name: 'Aminu Salisu',
    email: 'aminu@example.com',
    phone: '+234 800 000 0000',
    location: 'Lagos, Nigeria',
    linkedin: 'linkedin.com/in/aminusalisu',
    portfolio: 'aminusalisu.dev',
  },

  summary:
    'Frontend engineer focused on building modern web experiences with React, Next.js, and TypeScript.',

  experience: [
    {
      id: crypto.randomUUID(),
      company: 'TechNova',
      title: 'Frontend Engineer',
      startDate: '2022-01-01',
      endDate: '',
      present: true,
      description:
        'Built scalable frontend systems and improved application performance.',
    },
  ],

  education: [
    {
      id: crypto.randomUUID(),
      school: 'University of Lagos',
      degree: 'BSc Computer Science',
      dates: '2017 - 2021',
    },
  ],

  skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],

  projects: [
    {
      id: crypto.randomUUID(),
      title: 'Developer Hiring Platform',
      description:
        'Built a modern recruitment platform for remote engineering teams.',
      link: 'https://hireflow.dev',
      techStack: ['React', 'Next.js', 'Zustand'],
      newTech: '',
    },
  ],

  certifications: [
    {
      id: crypto.randomUUID(),
      name: 'AWS Certified Developer',
      issuer: 'Amazon',
      date: '2025',
    },
  ],

  sectionOrder: [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: defaultResume,

      saveResume: (resume) =>
        set({
          resume,
        }),
    }),
    {
      name: 'resume-storage',
      skipHydration: true,
    }
  )
);

/* ================= CANDIDATE PROFILE STORE ================= */

export type CandidateProfile = {
  avatar: string;

  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    github: string;
  };

  professionalTitle: string;

  bio: string;

  experienceLevel:
    | 'Junior'
    | 'Mid'
    | 'Senior'
    | 'Lead';

  skills: string[];

  lookingFor: {
    remote: boolean;
    fullTime: boolean;
    contract: boolean;
    internship: boolean;

    salaryMin: number;
    salaryMax: number;
  };

  workAuthorization: string;
};

type CandidateProfileStore = {
  profile: CandidateProfile;

  updateProfile: (
    profile: CandidateProfile
  ) => void;
};

const defaultProfile: CandidateProfile = {
  avatar: '',

  personal: {
    name: 'Aminu Salisu',
    email: 'aminu@example.com',
    phone: '+234 800 000 0000',
    location: 'Lagos, Nigeria',
    linkedin: '',
    portfolio: '',
    github: '',
  },

  professionalTitle:
    'Senior Frontend Developer',

  bio: '',

  experienceLevel: 'Senior',

  skills: [
    'React',
    'Next.js',
    'TypeScript',
  ],

  lookingFor: {
    remote: true,
    fullTime: true,
    contract: false,
    internship: false,

    salaryMin: 500000,
    salaryMax: 1500000,
  },

  workAuthorization:
    'Authorized to work',
};

export const useCandidateProfileStore =
  create<CandidateProfileStore>()(
    persist(
      (set) => ({
        profile: defaultProfile,

        updateProfile: (profile) =>
          set({
            profile,
          }),
      }),

      {
        name: 'candidate-profile-storage',
        skipHydration: true,
      }
    )
  );

/* ================= JOB ALERT STORE ================= */

export type JobAlertFrequency =
  | 'Daily'
  | 'Weekly';

export type JobAlert = {
  id: string;
  keywords: string;
  location: string;

  jobTypes: string[];

  salaryRange: number;

  frequency: JobAlertFrequency;

  createdAt: string;
};

type JobAlertsStore = {
  alerts: JobAlert[];

  emailNotifications: boolean;

  pushNotifications: boolean;

  addAlert: (
    alert: JobAlert
  ) => void;

  updateAlert: (
    id: string,
    updates: Partial<JobAlert>
  ) => void;

  deleteAlert: (
    id: string
  ) => void;

  toggleEmailNotifications: () => void;

  togglePushNotifications: () => void;
};

export const useJobAlertsStore =
  create<JobAlertsStore>()(
    persist(
      (set) => ({
        alerts: [],

        emailNotifications: true,

        pushNotifications: false,

        addAlert: (alert) =>
          set((state) => ({
            alerts: [
              alert,
              ...state.alerts,
            ],
          })),

        updateAlert: (
          id,
          updates
        ) =>
          set((state) => ({
            alerts:
              state.alerts.map(
                (alert) =>
                  alert.id === id
                    ? {
                        ...alert,
                        ...updates,
                      }
                    : alert
              ),
          })),

        deleteAlert: (id) =>
          set((state) => ({
            alerts:
              state.alerts.filter(
                (alert) =>
                  alert.id !== id
              ),
          })),

        toggleEmailNotifications:
          () =>
            set((state) => ({
              emailNotifications:
                !state.emailNotifications,
            })),

        togglePushNotifications:
          () =>
            set((state) => ({
              pushNotifications:
                !state.pushNotifications,
            })),
      }),
      {
        name: 'job-alerts-storage',
      }
    )
  );