'use client';

import { useForm } from 'react-hook-form';
import { Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';

import {
  ResumeProject,
  useResumeStore,
} from '@/lib/store';

type Props = {
  projects: ResumeProject[];
};

const ProjectsEditor = ({
  projects,
}: Props) => {
  const resume = useResumeStore(
    (state) => state.resume
  );

  const saveResume = useResumeStore(
    (state) => state.saveResume
  );

  const { watch, setValue } = useForm({
    defaultValues: {
      projects,
    },
  });

  const values = watch('projects');

  const updateProjects = (
    updated: ResumeProject[]
  ) => {
    setValue('projects', updated);

    saveResume({
      ...resume,
      projects: updated,
    });
  };

  const addProjects = () => {
    updateProjects([
      ...values,
      {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        link: '',
        techStack: [],
        newTech: '',
      },
    ]);
  };

  const addTechStack = (
    index: number,
    value: string
  ) => {
    if (!value.trim()) return;

    const updated = [...values];

    updated[index].techStack = [
      ...updated[index].techStack,
      value.trim(),
    ];

    updated[index].newTech = '';

    updateProjects(updated);
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Projects
        </h2>

        <button
          type="button"
          onClick={addProjects}
          className="rounded-xl bg-cyan-400 p-2 text-black"
        >
          <Plus size={18} />
        </button>
      </div>

      <Reorder.Group
        axis="y"
        values={values}
        onReorder={updateProjects}
        className="space-y-4"
      >
        {values.map((item, index) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="rounded-3xl border border-white/10 bg-black/20 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical size={18} />

                <p className="font-medium">
                  Project {index + 1}
                </p>
              </div>

              <button
                onClick={() =>
                  updateProjects(
                    values.filter(
                      (proj) =>
                        proj.id !== item.id
                    )
                  )
                }
                className="text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid gap-4">
              <Input
                placeholder="Project Title"
                value={item.title}
                onChange={(value) => {
                  const updated = [...values];

                  updated[index].title = value;

                  updateProjects(updated);
                }}
              />

              <textarea
                placeholder="Project Description"
                value={item.description}
                onChange={(e) => {
                  const updated = [...values];

                  updated[index].description =
                    e.target.value;

                  updateProjects(updated);
                }}
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none resize-none"
              />

              <Input
                placeholder="Project Link"
                value={item.link}
                onChange={(value) => {
                  const updated = [...values];

                  updated[index].link = value;

                  updateProjects(updated);
                }}
              />

              {/* TECH STACK */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Tech Stack
                </label>

                <div className="flex flex-wrap gap-2">
                  {item.techStack.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300"
                    >
                      {tech}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...values];

                          updated[index].techStack =
                            updated[index].techStack.filter(
                              (t) => t !== tech
                            );

                          updateProjects(updated);
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Add tech (React, Node.js...)"
                    value={item.newTech ?? ''}
                    onChange={(e) => {
                      const updated = [...values];

                      updated[index].newTech =
                        e.target.value;

                      updateProjects(updated);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();

                        addTechStack(
                          index,
                          item.newTech || ''
                        );
                      }
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      addTechStack(
                        index,
                        item.newTech || ''
                      )
                    }
                    className="rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-black"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </section>
  );
};

export default ProjectsEditor;

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
    />
  );
}

