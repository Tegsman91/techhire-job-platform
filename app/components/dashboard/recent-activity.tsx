'use client';

const activities = [
  'You applied to Frontend Engineer at TechCorp',
  'Your application at Nova Labs was viewed',
  'Interview scheduled with CodeBase',
  'Saved Product Designer role',
  'Your resume was downloaded',
];

const RecentActivity = () => {
  return (
    <section
      className="
        rounded-[2rem] border border-zinc-200 bg-white/90
        p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]
      "
    >
      <p
        className="
          text-xs font-bold uppercase tracking-[0.22em]
          text-cyan-600 dark:text-cyan-300/70
        "
      >
        Activity Feed
      </p>

      <h2
        className="
          mt-3 text-4xl font-black tracking-tight
          text-zinc-900 dark:text-white
        "
      >
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="
              group rounded-[1.5rem] border border-zinc-200
              bg-gradient-to-br from-zinc-50 to-white
              p-5 transition-all duration-300
              hover:border-cyan-300 hover:bg-cyan-50/50
              dark:border-white/10 dark:from-white/[0.05]
              dark:to-white/[0.02] dark:hover:border-cyan-400/30
              dark:hover:bg-white/[0.05]
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  mt-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500
                  shadow-[0_0_10px_rgba(6,182,212,0.45)]
                  dark:bg-cyan-400
                  dark:shadow-[0_0_12px_rgba(34,211,238,0.8)]
                "
              />

              <p
                className="
                  text-[15px] leading-relaxed text-zinc-700
                  dark:text-white/75
                "
              >
                {activity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;