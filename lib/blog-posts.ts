export type BlogCategory =
  | "Interview Tips"
  | "Resume Writing"
  | "Career Growth"
  | "Tech Trends";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  date: string;
  image: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-ace-technical-interviews",
    title: "How to Ace Technical Interviews",
    excerpt:
      "Master coding rounds, system design, and behavioral interviews with confidence.",
    category: "Interview Tips",
    author: "Sarah Johnson",
    date: "2026-04-10",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
    content: `
# How to Ace Technical Interviews

Technical interviews can feel overwhelming, but preparation changes everything.

## Focus Areas

- Data structures
- Algorithms
- System design
- Communication

## Final Advice

Practice consistently and explain your thinking clearly.
`,
  },

  {
    slug: "top-skills-for-2026",
    title: "Top Skills for 2026",
    excerpt:
      "The most in-demand tech skills companies are hiring for this year.",
    category: "Tech Trends",
    author: "Michael Lee",
    date: "2026-03-22",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200",
    content: `
# Top Skills for 2026

The market continues evolving rapidly.

## Most Valuable Skills

- AI Engineering
- Cloud Infrastructure
- Cybersecurity
- TypeScript
- Product Thinking
`,
  },

  {
    slug: "resume-mistakes-to-avoid",
    title: "Resume Mistakes to Avoid",
    excerpt:
      "Avoid these common resume issues that stop recruiters from calling back.",
    category: "Resume Writing",
    author: "Amanda Brooks",
    date: "2026-02-18",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200",
    content: `
# Resume Mistakes to Avoid

Small resume issues can cost opportunities.

## Common Problems

- Too much text
- Poor formatting
- Missing achievements
- Generic summaries
`,
  },

  {
    slug: "building-a-strong-linkedin-profile",
    title: "Building a Strong LinkedIn Profile",
    excerpt:
      "Optimize your LinkedIn profile to attract recruiters and opportunities.",
    category: "Career Growth",
    author: "David Kim",
    date: "2026-01-11",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200",
    content: `
# Building a Strong LinkedIn Profile

LinkedIn is your professional brand online.

## Optimize Your Profile

- Professional headline
- Strong summary
- Portfolio links
- Recommendations
`,
  },

  {
    slug: "remote-work-productivity-tips",
    title: "Remote Work Productivity Tips",
    excerpt:
      "Stay productive and balanced while working remotely.",
    category: "Career Growth",
    author: "Emily Stone",
    date: "2025-12-03",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    content: `
# Remote Work Productivity Tips

Remote work requires structure.

## Helpful Habits

- Dedicated workspace
- Clear routines
- Time blocking
- Healthy breaks
`,
  },
  {
  slug: "how-to-build-a-portfolio-that-gets-hired",
  title: "How to Build a Portfolio That Gets Hired",
  excerpt:
    "Create a developer portfolio that stands out to recruiters and hiring managers.",
  category: "Career Growth",
  author: "Olivia Carter",
  date: "2025-11-20",
  image:
    "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1200",
  content: `
# How to Build a Portfolio That Gets Hired

Your portfolio is proof of your skills.

## Include These

- Real projects
- Case studies
- GitHub links
- Clean UI design

## Final Tip

Show impact, not just code.
`,
  },

{
  slug: "best-resume-format-for-tech-jobs",
  title: "Best Resume Format for Tech Jobs",
  excerpt:
    "Learn the resume structure recruiters prefer for software and tech roles.",
  category: "Resume Writing",
  author: "Daniel Reed",
  date: "2025-10-14",
  image:
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200",
  content: `
# Best Resume Format for Tech Jobs

Recruiters scan resumes quickly.

## Recommended Structure

- Summary
- Skills
- Experience
- Projects
- Education

## Keep It Simple

Focus on readability and achievements.
`,
},

{
  slug: "how-to-negotiate-your-tech-salary",
  title: "How to Negotiate Your Tech Salary",
  excerpt:
    "Strategies to confidently negotiate compensation and benefits.",
  category: "Career Growth",
  author: "Sophia Adams",
  date: "2025-09-08",
  image:
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200",
  content: `
# How to Negotiate Your Tech Salary

Negotiation is part of the hiring process.

## Before Negotiating

- Research salary ranges
- Know your value
- Prepare achievements

## During Negotiation

Stay professional and confident.
`,
},

{
  slug: "frontend-trends-every-developer-should-know",
  title: "Frontend Trends Every Developer Should Know",
  excerpt:
    "Explore the frontend technologies shaping modern web development.",
  category: "Tech Trends",
  author: "Chris Walker",
  date: "2025-08-17",
  image:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200",
  content: `
# Frontend Trends Every Developer Should Know

Frontend development evolves rapidly.

## Current Trends

- Server Components
- AI-powered UI
- Edge rendering
- Motion design

## Stay Updated

Build projects using modern tools.
`,
},

{
  slug: "common-behavioral-interview-questions",
  title: "Common Behavioral Interview Questions",
  excerpt:
    "Prepare strong answers for teamwork, leadership, and problem-solving questions.",
  category: "Interview Tips",
  author: "Rachel Green",
  date: "2025-07-29",
  image:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
  content: `
# Common Behavioral Interview Questions

Behavioral rounds test communication skills.

## Prepare Stories About

- Conflict resolution
- Leadership
- Challenges
- Teamwork

## Use STAR Method

Situation, Task, Action, Result.
`,
},
{
  slug: "how-ai-is-changing-software-engineering",
  title: "How AI Is Changing Software Engineering",
  excerpt:
    "Discover how AI tools are transforming developer workflows and productivity.",
  category: "Tech Trends",
  author: "Nathan Scott",
  date: "2025-06-13",
  image:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
  content: `
# How AI Is Changing Software Engineering

AI tools are reshaping development.

## Areas Impacted

- Code generation
- Testing
- Documentation
- Debugging

## The Future

Developers who adapt fastest will thrive.
`,
},
{
  slug: "writing-project-descriptions-that-stand-out",
  title: "Writing Project Descriptions That Stand Out",
  excerpt:
    "Improve your resume and portfolio with impactful project descriptions.",
  category: "Resume Writing",
  author: "Laura Bennett",
  date: "2025-05-02",
  image:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200",
  content: `
# Writing Project Descriptions That Stand Out

Projects help prove your abilities.

## Strong Descriptions Include

- Technologies used
- Problems solved
- Measurable impact
- Your contributions

## Avoid

Generic descriptions with no results.
`,
},
];