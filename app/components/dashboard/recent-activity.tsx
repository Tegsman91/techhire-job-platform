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
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/70">
        Activity Feed
      </p>

      <h2 className="mt-3 text-4xl font-black tracking-tight">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="
              group rounded-[1.5rem]
              border border-white/10
              bg-gradient-to-br
              from-white/[0.05]
              to-white/[0.02]
              p-5
              transition-all duration-300
              hover:border-cyan-400/30
              hover:bg-white/[0.05]
            "
          >
            <div className="flex items-start gap-4">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

              <p className="text-[15px] leading-relaxed text-white/75">
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