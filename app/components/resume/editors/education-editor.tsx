'use client';

import { useForm } from 'react-hook-form';
import { Reorder, useDragControls } from 'framer-motion';
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

  const controls = useDragControls();

  return (
    <section
      className="
        min-w-0 rounded-[2rem] overflow-x-hidden
        border border-slate-200 bg-white/80
        p-4 sm:p-5 shadow-sm backdrop-blur-xl
        dark:border-white/10 dark:bg-white/[0.03]
        dark:shadow-none
      "
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Education
        </h2>

        <button
          type="button"
          onClick={addEducation}
          className="
            rounded-xl bg-cyan-500 p-2
            text-white transition hover:bg-cyan-600
          "
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
            dragListener={false}
            dragControls={controls}
            className="
              rounded-3xl
              border border-slate-200
              bg-slate-50/80 p-5
              shadow-sm transition
              touch-pan-y
              dark:border-white/10
              dark:bg-black/20
              dark:shadow-none
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onPointerDown={(e) =>
                    controls.start(e)
                  }
                  className="
                    cursor-grab
                    touch-none
                    active:cursor-grabbing
                  "
                >
                  <GripVertical
                    size={18}
                    className="text-slate-400 dark:text-white/50"
                  />
                </button>

                <p
                  className="
                    font-medium
                    text-slate-700
                    dark:text-white
                  "
                >
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
                className="
                  text-red-500
                  transition
                  hover:text-red-600
                  dark:text-red-400
                  dark:hover:text-red-300
                "
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
      className="
        w-full rounded-2xl
        border border-slate-200 bg-white
        px-4 py-3 text-slate-900
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

