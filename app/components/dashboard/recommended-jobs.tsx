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
    <section
      className="
        rounded-[2rem] border border-zinc-200 bg-white/90
        p-5 shadow-sm
        dark:border-white/10 dark:bg-white/[0.03]
      "
    >
      <div>
        <p
          className="
            text-xs font-bold uppercase tracking-[0.22em]
            text-cyan-600 dark:text-cyan-300/70
          "
        >
          Recommended Jobs
        </p>

        <h2
          className="
            mt-3 text-2xl font-black tracking-tight
            text-zinc-900 dark:text-white
          "
        >
          Based on your skills:{' '}
          <span className="text-cyan-600 dark:text-cyan-300">
            {skills.slice(0, 3).join(', ')}
          </span>
        </h2>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="
              min-w-[85vw] sm:min-w-[320px] flex-shrink-0 snap-start
              rounded-[2rem]  border border-zinc-200
              bg-gradient-to-br from-zinc-50 to-white
              p-4 sm:p-5 lg:p-6 shadow-sm
              transition-all duration-500 hover:-translate-y-1
              hover:border-cyan-300 hover:shadow-lg
              dark:border-white/10 dark:from-white/[0.06]
              dark:to-white/[0.03] dark:backdrop-blur-xl
              dark:hover:border-cyan-400/30
              dark:hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]
            "
          >
            <h3
              className="
                text-xl font-bold text-zinc-900 dark:text-white
              "
            >
              {job.title}
            </h3>

            <p
              className="
                mt-1 max-w-2xl text-base leading-relaxed
                text-zinc-500 dark:text-white/55
              "
            >
              {job.company}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="
                    rounded-full border border-cyan-200
                    bg-cyan-50 px-3 py-1 text-xs font-medium
                    text-cyan-700 dark:border-cyan-500/20
                    dark:bg-cyan-400/10 dark:text-cyan-300
                  "
                >
                  {skill}
                </span>
              ))}
            </div>

            <button
              className="
                mt-8 w-full rounded-2xl bg-cyan-500
                px-5 py-3 text-sm font-bold uppercase tracking-wider
                text-white transition-all duration-300
                hover:scale-[1.02] hover:bg-cyan-600
                dark:bg-cyan-400 dark:text-black
              "
            >
              View Job
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedJobs;