'use client';

import { ResumeData } from '@/lib/store';

type Props = {
  resume: ResumeData;
};

const TechTemplate = ({ resume }: Props) => {
  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#0B1120] text-cyan-50 shadow-2xl print:border-none print:shadow-none print:text-black print:bg-white print:rounded-none print:max-w-none">
      <header className="border-b border-cyan-500/20 bg-cyan-500/10 p-6 sm:p-8 print:border-black/20 print:bg-white">
        <h1 className="break-words text-4xl font-black">
          {resume.personal.name}
        </h1>

        <p className="mt-3 text-cyan-200 print:text-black">
          {resume.personal.email} •{' '}
          {resume.personal.phone}
        </p>

        <p className="mt-2 text-cyan-300/80 print:text-black">
          {resume.personal.location}
        </p>
      </header>

      <main className="grid items-start gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* LEFT */}
        <div className="space-y-8">
          {resume.sectionOrder.map((section) => {
            if (section === 'summary') {
              return (
                <TechSection
                  key={section}
                  title="Professional Summary"
                >
                  <p className="leading-relaxed text-cyan-100/80 print:text-black">
                    {resume.summary}
                  </p>
                </TechSection>
              );
            }

            if (section === 'experience') {
              return (
                <TechSection
                  key={section}
                  title="Experience"
                >
                  <div className="space-y-4">
                    {resume.experience.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5 print:border-black"
                      >
                        <div className="flex flex-wrap justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-cyan-100 print:text-black">
                              {item.title}
                            </h3>

                            <p className="text-sm text-cyan-300 print:text-black">
                              {item.company}
                            </p>
                          </div>

                          <p className="text-sm text-cyan-400/70 print:text-black">
                            {item.startDate} -{' '}
                            {item.present
                              ? 'Present'
                              : item.endDate}
                          </p>
                        </div>

                        <div
                          className="mt-4 text-sm leading-relaxed text-cyan-100/80 print:text-black"
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </TechSection>
              );
            }

            if (section === 'projects') {
              return (
                <TechSection
                  key={section}
                  title="Projects"
                >
                  <div className="space-y-5">
                    {resume.projects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5 print:border-black"
                      >
                        <h3 className="font-bold print:text-black">
                          {project.title}
                        </h3>

                        <p className="mt-3 text-sm text-cyan-100/80 print:text-black">
                          {project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200 print:border-black print:text-black"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TechSection>
              );
            }

            if (section === 'education') {
              return (
                <TechSection
                  key={section}
                  title="Education"
                >
                  <div className="space-y-4">
                    {resume.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5 print:border-black"
                      >
                        <h3 className="font-bold print:text-black">
                          {edu.degree}
                        </h3>

                        <p className="text-sm text-cyan-300 print:text-black">
                          {edu.school}
                        </p>

                        <p className="text-sm text-cyan-400/70 print:text-black">
                          {edu.dates}
                        </p>
                      </div>
                    ))}
                  </div>
                </TechSection>
              );
            }

            return null;
          })}
        </div>

        {/* RIGHT */}
        <aside className="space-y-8">
          {resume.sectionOrder.includes('skills') && (
            <TechSection title="Tech Stack">
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-black"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </TechSection>
          )}

          <TechSection title="GitHub Contributions">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 70 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-sm ${
                      index % 4 === 0
                        ? 'bg-cyan-400 print:bg-black'
                        : index % 3 === 0
                        ? 'bg-cyan-400/70 print:bg-white'
                        : 'bg-cyan-400/20 print:bg-black'
                    }`}
                  />
                )
              )}
            </div>
          </TechSection>

          {resume.sectionOrder.includes(
            'certifications'
          ) && (
            <TechSection title="Certifications">
              <div className="space-y-4">
                {resume.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4 print:border-black"
                  >
                    <h3 className="font-semibold">
                      {cert.name}
                    </h3>

                    <p className="text-sm text-cyan-300 print:text-black">
                      {cert.issuer}
                    </p>

                    <p className="text-xs text-cyan-400/70 print:text-black">
                      {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </TechSection>
          )}
        </aside>
      </main>
    </div>
  )
}

export default TechTemplate

function TechSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="break-inside-avoid-page space-y-4">
      <h2 className="mb-2 text-xl font-bold text-cyan-300 print:text-black">
        {title}
      </h2>

      {children}
    </section>
  );
}