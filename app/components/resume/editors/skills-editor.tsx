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
    <section className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <h2 className="text-2xl font-bold">
        Skills
      </h2>

      <div className="mt-5 flex gap-3">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Add skill"
          className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
        />

        <button
          onClick={addSkill}
          className="rounded-2xl bg-cyan-400 px-5 text-black"
        >
          Add
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {resume.skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"
          >
            {skill}

            <button
              onClick={() =>
                removeSkill(skill)
              }
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