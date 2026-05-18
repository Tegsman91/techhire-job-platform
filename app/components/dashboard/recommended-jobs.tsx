'use client';

import { useResumeStore } from '@/lib/store';

const RecommendedJobs = () => {
  const skills = useResumeStore(
    (state) => state.resume.skills
  );

  const jobs = [
    {
      id: 1,
      title: 'Frontend Engineer',
      company: 'TechCorp',
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'Nova Labs',
    },
    {
      id: 3,
      title: 'Fullstack Engineer',
      company: 'CodeBase',
    },
    {
      id: 4,
      title: 'Fullstack Engineer',
      company: 'CodeBase',
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/70">
          Recommended Jobs
        </p>

        <h2 className="mt-3 text-2xl font-black tracking-tight">
          Based on your skills:
          {' '}
          {skills.slice(0, 3).join(', ')}
        </h2>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="
              min-w-[85vw] sm:min-w-[320px]
              flex-shrink-0
              snap-start
              rounded-[2rem]
              border border-white/10
              bg-gradient-to-br
              from-white/[0.06]
              to-white/[0.03]
              p-4 sm:p-5 lg:p-6
              backdrop-blur-xl
              transition-all duration-500
              hover:-translate-y-1
              hover:border-cyan-400/30
              hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]
            "
          >
            <h3 className="text-xl font-bold">
              {job.title}
            </h3>

            <p className="mt-1 max-w-2xl text-base leading-relaxed text-white/55">
              {job.company}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button className="mt-8 w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:scale-[1.02]">
              View Job
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedJobs;