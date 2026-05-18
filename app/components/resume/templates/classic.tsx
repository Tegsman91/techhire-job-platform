'use client';

import { ResumeData } from '@/lib/store';

type Props = {
  resume: ResumeData;
};

import React from 'react'

const ClassicTemplate = ({ resume }: Props) => {
  return (
    <div className="mx-auto w-full max-w-4xl bg-white p-6 text-black shadow-2xl sm:p-10 print:shadow-none">
      <header className="border-b pb-6 text-center">
        <h1 className="break-words text-4xl font-bold">
          {resume.personal.name}
        </h1>

        <p className="mt-3 text-sm text-neutral-600">
          {[resume.personal.email, resume.personal.phone, resume.personal.location].filter(Boolean).join(' • ')}
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          {[resume.personal.linkedin, resume.personal.portfolio].filter(Boolean).join(' • ')}
        </p>
      </header>

      {resume.sectionOrder.map((section) => {
        if (section === 'summary') {
          return (
            <ClassicSection
              key={section}
              title="Professional Summary"
            >
              <p className="leading-relaxed text-neutral-700">
                {resume.summary}
              </p>
            </ClassicSection>
          );
        }

        if (section === 'experience') {
          return (
            <ClassicSection
              key={section}
              title="Experience"
            >
              <div className="space-y-8">
                {resume.experience.map((item) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <h3 className="font-bold">
                          {item.title}
                        </h3>

                        <p className="text-neutral-600">
                          {item.company}
                        </p>
                      </div>

                      <p className="text-sm text-neutral-500">
                        {item.startDate} -{' '}
                        {item.present
                          ? 'Present'
                          : item.endDate}
                      </p>
                    </div>

                    <div
                      className="mt-3 text-sm leading-relaxed text-neutral-700"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </div>
                ))}
              </div>
            </ClassicSection>
          );
        }

        if (section === 'education') {
          return (
            <ClassicSection
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

                    <p className="text-neutral-600">
                      {edu.school}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {edu.dates}
                    </p>
                  </div>
                ))}
              </div>
            </ClassicSection>
          );
        }

        if (section === 'projects') {
          return (
            <ClassicSection
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
                          className="rounded border px-2 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ClassicSection>
          );
        }

        if (section === 'skills') {
          return (
            <ClassicSection
              key={section}
              title="Skills"
            >
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ClassicSection>
          );
        }

        if (section === 'certifications') {
          return (
            <ClassicSection
              key={section}
              title="Certifications"
            >
              <div className="space-y-4">
                {resume.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="break-inside-avoid"
                  >
                    <h3 className="font-semibold">
                      {cert.name}
                    </h3>

                    <p className="text-sm text-neutral-600">
                      {cert.issuer}
                    </p>

                    <p className="text-xs text-neutral-500">
                      {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </ClassicSection>
          );
        }

        return null;
      })}
    </div>
  )
}

export default ClassicTemplate

function ClassicSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 break-inside-avoid-page">
      <h2 className="mb-5 text-2xl font-bold">
        {title}
      </h2>

      {children}
    </section>
  );
}