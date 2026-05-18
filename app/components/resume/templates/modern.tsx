'use client';

import { ResumeData } from '@/lib/store';

type Props = {
  resume: ResumeData;
};

const ModernTemplate = ({ resume }: Props) => {
  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden print:overflow-visible rounded-3xl bg-white text-black shadow-2xl print:shadow-none">
      <div className="grid md:grid-cols-[320px_1fr]">
        {/* SIDEBAR */}
        <aside className="bg-neutral-100 p-6 sm:p-8">
          <h1 className="break-words text-3xl font-bold">
            {resume.personal.name}
          </h1>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-500">
                Contact
              </h2>

              <div className="space-y-2 text-sm">
                {resume.personal.email && <p>{resume.personal.email}</p>}
                {resume.personal.phone && <p>{resume.personal.phone}</p>}
                {resume.personal.location && <p>{resume.personal.location}</p>}
                {resume.personal.linkedin && <p>{resume.personal.linkedin}</p>}
                {resume.personal.portfolio && <p>{resume.personal.portfolio}</p>}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-500">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-black px-3 py-1 text-xs text-white print:text-black border print:border-black"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-500">
                Certifications
              </h2>

              <div className="space-y-3">
                {resume.certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="font-semibold">
                      {cert.name}
                    </p>

                    <p className="text-sm text-neutral-600">
                      {cert.issuer}
                    </p>

                    <p className="text-xs text-neutral-500">
                      {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="p-6 sm:p-8">
          {resume.sectionOrder.map((section) => {
            if (section === 'summary') {
              return (
                <Section
                  key={section}
                  title="Professional Summary"
                >
                  <p className="leading-relaxed text-neutral-700">
                    {resume.summary}
                  </p>
                </Section>
              );
            }

            if (section === 'experience') {
              return (
                <Section
                  key={section}
                  title="Experience"
                >
                  <div className="space-y-6">
                    {resume.experience.map((item) => (
                      <div
                        key={item.id}
                        className="break-inside-avoid"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-bold">
                              {item.title}
                            </h3>

                            <p className="text-sm text-neutral-600">
                              {item.company}
                            </p>
                          </div>

                          <p className="text-sm text-neutral-500">
                            {item.startDate} - {' '}
                            {item.present
                              ? 'Present'
                              : item.endDate}
                          </p>
                        </div>

                        <div
                          className="prose prose-sm mt-3 max-w-none text-neutral-700"
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </Section>
              );
            }

            if (section === 'projects') {
              return (
                <Section
                  key={section}
                  title="Projects"
                >
                  <div className="space-y-5">
                    {resume.projects.map((project) => (
                      <div
                        key={project.id}
                        className="break-inside-avoid"
                      >
                        <h3 className="font-bold">
                          {project.title}
                        </h3>

                        <p className="mt-2 text-sm text-neutral-700">
                          {project.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border px-2 py-1 text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              );
            }

            if (section === 'education') {
              return (
                <Section
                  key={section}
                  title="Education"
                >
                  <div className="space-y-5">
                    {resume.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="break-inside-avoid"
                      >
                        <h3 className="font-bold">
                          {edu.degree}
                        </h3>

                        <p className="text-sm text-neutral-600">
                          {edu.school}
                        </p>

                        <p className="text-sm text-neutral-500">
                          {edu.dates}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              );
            }

            return null;
          })}
        </main>
      </div>
    </div>
  )
}

export default ModernTemplate

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 break-inside-avoid-page">
      <h2 className="mb-3 border-b pb-2 text-xl font-bold">
        {title}
      </h2>

      {children}
    </section>
  );
}