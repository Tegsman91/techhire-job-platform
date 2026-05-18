'use client';

import { useForm } from 'react-hook-form';
import { Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';

import {
  ResumeEducation,
  useResumeStore,
} from '@/lib/store';

type Props = {
  education: ResumeEducation[];
};

const EducationEditor = ({
  education,
}: Props) => {
  const resume = useResumeStore(
    (state) => state.resume
  );

  const saveResume = useResumeStore(
    (state) => state.saveResume
  );

  const { watch, setValue } = useForm({
    defaultValues: {
      education,
    },
  });

  const values = watch('education');

  const updateEducation = (
    updated: ResumeEducation[]
  ) => {
    setValue('education', updated);

    saveResume({
      ...resume,
      education: updated,
    });
  };

  const addEducation = () => {
    updateEducation([
      ...values,
      {
        id: crypto.randomUUID(),
        school: '',
        degree: '',
        dates: '',
      },
    ]);
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Education
        </h2>

        <button
          type="button"
          onClick={addEducation}
          className="rounded-xl bg-cyan-400 p-2 text-black"
        >
          <Plus size={18} />
        </button>
      </div>

      <Reorder.Group
        axis="y"
        values={values}
        onReorder={updateEducation}
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
                  Education {index + 1}
                </p>
              </div>

              <button
                onClick={() =>
                  updateEducation(
                    values.filter(
                      (edu) =>
                        edu.id !== item.id
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
                placeholder="School"
                value={item.school}
                onChange={(value) => {
                  const updated = [
                    ...values,
                  ];

                  updated[index].school =
                    value;

                  updateEducation(
                    updated
                  );
                }}
              />

              <Input
                placeholder="Degree"
                value={item.degree}
                onChange={(value) => {
                  const updated = [
                    ...values,
                  ];

                  updated[index].degree =
                    value;

                  updateEducation(
                    updated
                  );
                }}
              />

              <Input
                placeholder="Dates"
                value={item.dates}
                onChange={(value) => {
                  const updated = [
                    ...values,
                  ];

                  updated[index].dates =
                    value;

                  updateEducation(
                    updated
                  );
                }}
              />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </section>
  );
};

export default EducationEditor;

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

