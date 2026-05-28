'use client';

import clsx from 'clsx';
import { jsPDF } from 'jspdf';
import {
  type DragEndEvent,
} from '@dnd-kit/core';

import {
  arrayMove,
} from '@dnd-kit/sortable';

import {
  Download,
  GripVertical,
  Save,
  Eye,
} from 'lucide-react';
import { type ResumeData, ResumeTemplate, useResumeStore } from "@/lib/store";
import dynamic from 'next/dynamic';
import ModernTemplate from '@/app/components/resume/templates/modern';
import ClassicTemplate from '@/app/components/resume/templates/classic';
import TechTemplate from '@/app/components/resume/templates/tech';
import WorkExperienceEditor from '@/app/components/resume/editors/work-experience-editors';
import EducationEditor from '@/app/components/resume/editors/education-editor';
import CertificationsEditor from '@/app/components/resume/editors/certifications-editor';
import ProjectsEditor from '@/app/components/resume/editors/projects-editor';
import SkillsEditor from '@/app/components/resume/editors/skills-editor';

const ResumeSectionOrder = dynamic(
    () => import('./ResumeSectionOrder'),
    { ssr: false }
  );

const ResumePage = () => {
  const resume = useResumeStore((state) => state.resume);
  const saveResume = useResumeStore((state) => state.saveResume);

  const updateResume = (
    updater: (prev: ResumeData) => ResumeData
  ) => {
    saveResume(updater(resume));
  };

  const templates: ResumeTemplate[] = [
    'modern',
    'classic',
    'tech',
    'minimal',
  ];

  const updatePersonal = (
    key: keyof ResumeData['personal'],
    value: string
  ) => {
    updateResume((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [key]: value,
      },
    }));
  };

  const formatDate = (date: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const downloadPDF = () => {
    try {
      const pdf = new jsPDF();

      let y = 20;

      const pageHeight = pdf.internal.pageSize.height;

      const ensureSpace = (space = 20) => {
        if (y + space > pageHeight - 20) {
          pdf.addPage();
          y = 20;
        }
      };

      /* ================= HEADER ================= */

      pdf.setFontSize(22);

      pdf.text(
        resume.personal.name || 'Unnamed Candidate',
        20,
        y
      );

      y += 10;

      pdf.setFontSize(11);

      pdf.text(
        `${resume.personal.email} • ${resume.personal.phone}`,
        20,
        y
      );

      y += 8;

      pdf.text(
        `${resume.personal.location} • ${resume.personal.linkedin}`,
        20,
        y
      );

      y += 15;

      /* ================= SUMMARY ================= */

      ensureSpace(40);

      pdf.setFontSize(16);

      pdf.text('Professional Summary', 20, y);

      y += 10;

      pdf.setFontSize(11);

      const summaryLines = pdf.splitTextToSize(
        resume.summary || '',
        170
      );

      pdf.text(summaryLines, 20, y);

      y += summaryLines.length * 6 + 10;

      /* ================= EXPERIENCE ================= */

      ensureSpace(30);

      pdf.setFontSize(16);

      pdf.text('Experience', 20, y);

      y += 10;

      resume.experience.forEach((item) => {
        ensureSpace(45);

        pdf.setFontSize(13);

        pdf.text(
          `${item.title} - ${item.company}`,
          20,
          y
        );

        y += 7;

        pdf.setFontSize(10);

        pdf.text(
          `${formatDate(item.startDate)} - ${
            item.present
              ? 'Present'
              : formatDate(item.endDate)
          }`,
          20,
          y
        );

        y += 7;

        const descriptionLines =
          pdf.splitTextToSize(
            item.description || '',
            170
          );

        pdf.text(descriptionLines, 20, y);

        y += descriptionLines.length * 6 + 10;
      });

      /* ================= EDUCATION ================= */

      ensureSpace(30);

      pdf.setFontSize(16);

      pdf.text('Education', 20, y);

      y += 10;

      resume.education.forEach((item) => {
        ensureSpace(25);

        pdf.setFontSize(13);

        pdf.text(
          `${item.degree}`,
          20,
          y
        );

        y += 7;

        pdf.setFontSize(10);

        pdf.text(
          `${item.school} • ${item.dates}`,
          20,
          y
        );

        y += 12;
      });

      /* ================= SKILLS ================= */

      ensureSpace(30);

      pdf.setFontSize(16);

      pdf.text('Skills', 20, y);

      y += 10;

      pdf.setFontSize(11);

      const skillsText =
        resume.skills.join(', ');

      const skillLines =
        pdf.splitTextToSize(
          skillsText,
          170
        );

      pdf.text(skillLines, 20, y);

      y += skillLines.length * 6 + 10;

      /* ================= PROJECTS ================= */

      ensureSpace(30);

      pdf.setFontSize(16);

      pdf.text('Projects', 20, y);

      y += 10;

      resume.projects.forEach((project) => {
        ensureSpace(40);

        pdf.setFontSize(13);

        pdf.text(project.title, 20, y);

        y += 7;

        pdf.setFontSize(10);

        const projectLines =
          pdf.splitTextToSize(
            project.description || '',
            170
          );

        pdf.text(projectLines, 20, y);

        y += projectLines.length * 6 + 5;

        pdf.text(
          `Tech Stack: ${project.techStack.join(', ')}`,
          20,
          y
        );

        y += 12;
      });

      /* ================= CERTIFICATIONS ================= */

      ensureSpace(30);

      pdf.setFontSize(16);

      pdf.text('Certifications', 20, y);

      y += 10;

      resume.certifications.forEach((cert) => {
        ensureSpace(25);

        pdf.setFontSize(13);

        pdf.text(cert.name, 20, y);

        y += 7;

        pdf.setFontSize(10);

        pdf.text(
          `${cert.issuer} • ${cert.date}`,
          20,
          y
        );

        y += 12;
      });

      pdf.save(
        `${resume.personal.name || 'resume'}.pdf`
      );
    } catch (error) {
      console.error(error);

      alert('Failed to generate PDF');
    }
  };

  const handleSave = () => {
    saveResume(resume);

    alert('Resume saved successfully!');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex =
      resume.sectionOrder.indexOf(active.id as string);

    const newIndex =
      resume.sectionOrder.indexOf(over.id as string);

    if (oldIndex === -1 || newIndex === -1) return;

    updateResume((prev) => ({
      ...prev,
      sectionOrder: arrayMove(
        prev.sectionOrder,
        oldIndex,
        newIndex
      ),
    }));
  };

  return (
    <main
      className="
        min-h-screen px-4 py-6 lg:px-8 bg-gradient-to-br
        from-slate-50 via-white to-cyan-50 text-slate-900
        transition-colors duration-300 dark:from-[#0A0A0F] dark:via-[#0F172A] dark:to-[#0A0A0F] dark:text-white print:bg-white print:p-0
      "
    >
      <div className="mx-auto max-w-7xl">
        <div 
          className="
            relative mb-6 overflow-hidden rounded-[2rem]
            border border-cyan-200 bg-white/80 p-6 sm:p-8
            shadow-xl shadow-cyan-100/50 backdrop-blur-2xl
            flex flex-col gap-4
            lg:flex-row lg:items-center lg:justify-between
            dark:border-cyan-500/20 dark:bg-white/[0.03]
            dark:shadow-[0_0_30px_rgba(34,211,238,0.08)] print:hidden
          "
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

          <div>
            <h1 className="text-3xl font-bold sm:text-5xl">
              Resume Builder
            </h1>

            <p className="mt-2 text-slate-600 dark:text-white/60">
              Build a professional resume with
              live preview and PDF export.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                downloadPDF();
              }}
              className="
                flex w-full items-center justify-center gap-2
                rounded-2xl border border-slate-200
                bg-white px-5 py-3
                text-slate-700 transition duration-300
                hover:bg-slate-50 dark:border-white/10
                dark:bg-white/[0.03] dark:text-white
                dark:hover:bg-white/[0.05] sm:w-auto
              "
            >
              <Download size={18} />
              Download PDF
            </button>

            <button
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 hover:bg-cyan-400/80 transition duration-300 px-5 py-3 font-semibold text-black sm:w-auto"
            >
              <Save size={18} />
              Save Resume
            </button>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr] print:block">
          {/* LEFT */}
          <div className="space-y-6 print:hidden">
            {/* TEMPLATE */}
            <section 
              className="
                rounded-[2rem] border border-slate-200
                bg-white/80 p-5 shadow-sm
                backdrop-blur-xl dark:border-white/10
                dark:bg-white/[0.03] dark:shadow-none
              "
            >
              <h2 className="text-2xl font-bold">
                Templates
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {templates.map((template) => (
                  <button
                    key={template}
                    onClick={() =>
                      updateResume((prev) => ({
                        ...prev,
                        template,
                      }))
                    }
                    className={clsx(
                      'rounded-2xl border p-5 capitalize transition-all duration-300',
                      resume.template === template
                        ? `
                          border-cyan-400 bg-cyan-50 text-cyan-700
                          dark:bg-cyan-400/10 dark:text-cyan-300
                        `
                        : `
                          border-slate-200 bg-slate-50
                          text-slate-700 dark:border-white/10
                          dark:bg-black/20 dark:text-white
                        `
                    )}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </section>

            {/* PERSONAL */}
            <section 
              className="
                rounded-[2rem] border border-slate-200
                bg-white/80 p-5 shadow-sm
                backdrop-blur-xl dark:border-white/10
                dark:bg-white/[0.03] dark:shadow-none
              "
            >
              <h2 className="text-2xl font-bold">
                Personal Info
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Full Name"
                  value={resume.personal.name}
                  onChange={(e) =>
                    updatePersonal(
                      'name',
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Email"
                  value={resume.personal.email}
                  onChange={(e) =>
                    updatePersonal(
                      'email',
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Phone"
                  value={resume.personal.phone}
                  onChange={(e) =>
                    updatePersonal(
                      'phone',
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Location"
                  value={resume.personal.location}
                  onChange={(e) =>
                    updatePersonal(
                      'location',
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="LinkedIn"
                  value={resume.personal.linkedin}
                  onChange={(e) =>
                    updatePersonal(
                      'linkedin',
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Portfolio"
                  value={resume.personal.portfolio}
                  onChange={(e) =>
                    updatePersonal(
                      'portfolio',
                      e.target.value
                    )
                  }
                />
              </div>
            </section>

            {/* SUMMARY */}
            <section 
              className="
                rounded-[2rem] border border-slate-200
                bg-white/80 p-5 shadow-sm
                backdrop-blur-xl dark:border-white/10
                dark:bg-white/[0.03] dark:shadow-none
              "
            >
              <h2 className="text-2xl font-bold">
                Professional Summary
              </h2>

              <textarea
                value={resume.summary}
                onChange={(e) =>
                  updateResume((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                className="
                  mt-5 min-h-[150px] w-full
                  rounded-2xl border border-slate-200 bg-slate-50
                  p-4 text-base text-slate-900
                  outline-none resize-none transition
                  placeholder:text-slate-400 focus:border-cyan-400
                  focus:bg-white dark:border-white/10
                  dark:bg-black/20 dark:text-white
                  dark:placeholder:text-white/40
                "
              />
            </section>

            {/* EXPERIENCE */}
            <WorkExperienceEditor
              experience={resume.experience}
            />

            {/* EDUCATION */}
            <EducationEditor education={resume.education} />

            {/* CERTIFICATIONS */}
            <CertificationsEditor
              certifications={
                resume.certifications
              }
            />

            {/* PROJECTS */}
            <ProjectsEditor projects={resume.projects} />

            {/* SKILLS */}
            <SkillsEditor />

            {/* DRAG SECTIONS */}
            <section 
              className="
                rounded-[2rem] border border-slate-200
                bg-white/80 p-5 shadow-sm
                backdrop-blur-xl dark:border-white/10
                dark:bg-white/[0.03] dark:shadow-none
              "
            >
              <div className="mb-5 flex items-center gap-3">
                <GripVertical size={20} />

                <h2 className="text-2xl font-bold">
                  Reorder Sections
                </h2>
              </div>

              <ResumeSectionOrder
                sectionOrder={resume.sectionOrder}
                handleDragEnd={handleDragEnd}
              />
            </section>
          </div>

          {/* RIGHT */}
          <div className="min-w-0 xl:sticky xl:top-6 xl:h-fit print:static print:w-full">
            <div className="mb-4 flex items-center gap-2 print:hidden">
              <Eye size={18} />

              <p className="font-medium text-slate-700 dark:text-white">
                Live Preview
              </p>
            </div>

            <div
              className="
                min-w-0 overflow-hidden
                rounded-[2rem]
                border border-black/10
                bg-[#f3f4f6] p-4
                shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                dark:border-white/10
                dark:bg-white/[0.03]
                dark:shadow-[0_10px_40px_rgba(0,0,0,0.45)]
              "
            >
              {resume.template === 'modern' && (
                <ModernTemplate resume={resume} />
              )}

              {resume.template === 'classic' && (
                <ClassicTemplate resume={resume} />
              )}

              {resume.template === 'tech' && (
                <TechTemplate resume={resume} />
              )}

              {resume.template === 'minimal' && (
                <ModernTemplate resume={resume} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ResumePage

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full min-w-0 rounded-2xl
        border border-slate-200 bg-slate-50
        px-4 py-3 text-base text-slate-900
        outline-none transition
        placeholder:text-slate-400
        focus:border-cyan-400
        focus:bg-white
        dark:border-white/10
        dark:bg-black/20
        dark:text-white
        dark:placeholder:text-white/40
      "
    />
  );
}