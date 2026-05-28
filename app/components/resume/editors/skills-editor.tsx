'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { useResumeStore } from '@/lib/store';

const SkillsEditor = () => {
  const resume = useResumeStore(
    (state) => state.resume
  );

  const saveResume = useResumeStore(
    (state) => state.saveResume
  );

  const [input, setInput] = useState('');

  const addSkill = () => {
    if (!input.trim()) return;

    const updated = [
      ...resume.skills,
      input,
    ];

    saveResume({
      ...resume,
      skills: updated,
    });

    setInput('');
  };

  const removeSkill = (
    skill: string
  ) => {
    saveResume({
      ...resume,
      skills: resume.skills.filter(
        (s) => s !== skill
      ),
    });
  };

  return (
    <section
      className="
        min-w-0 overflow-x-hidden
        rounded-[2rem]
        border border-slate-200
        bg-white/80 p-4 sm:p-5
        shadow-sm backdrop-blur-xl
        dark:border-white/10
        dark:bg-white/[0.03]
        dark:shadow-none
      "
    >
      <h2
        className="
          text-2xl font-bold
          text-slate-900
          dark:text-white
        "
      >
        Skills
      </h2>

      <div className="mt-5 flex gap-3">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Add skill"
          className="
            flex-1 rounded-2xl
            border border-slate-200
            bg-white px-4 py-3
            text-slate-900
            outline-none transition
            placeholder:text-slate-400
            focus:border-cyan-400
            dark:border-white/10
            dark:bg-black/20
            dark:text-white
            dark:placeholder:text-white/40
          "
        />

        <button
          onClick={addSkill}
          className="
            rounded-2xl
            bg-cyan-500 px-5
            text-white transition
            hover:bg-cyan-600
          "
        >
          Add
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {resume.skills.map((skill) => (
          <div
            key={skill}
            className="
              flex items-center gap-2
              rounded-full
              border border-cyan-200
              bg-cyan-50
              px-4 py-2 text-sm
              text-cyan-700
              transition
              dark:border-cyan-400/20
              dark:bg-cyan-400/10
              dark:text-cyan-300
            "
          >
            {skill}

            <button
              onClick={() =>
                removeSkill(skill)
              }
              className="
                text-cyan-700
                transition
                hover:text-red-500
                dark:text-cyan-300
                dark:hover:text-red-400
              "
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsEditor;