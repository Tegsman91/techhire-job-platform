'use client';

import { useForm, Controller } from 'react-hook-form';
import { Reorder, useDragControls } from 'framer-motion';
import * as Checkbox from '@radix-ui/react-checkbox';
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  Bold,
  Italic,
  List,
} from 'lucide-react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  ResumeExperience,
  useResumeStore,
} from '@/lib/store';

type Props = {
  experience: ResumeExperience[];
};

const WorkExperienceEditor = ({ experience }: Props) => {
  const saveResume = useResumeStore((state) => state.saveResume);
  const resume = useResumeStore((state) => state.resume);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      experience,
    },
  }); 

  const values = watch('experience');

  const updateExperience = (
    updated: ResumeExperience[]
  ) => {
    setValue('experience', updated);

    saveResume({
      ...resume,
      experience: updated,
    });
  };

  const addExperience = () => {
    const updated = [
      ...values,
      {
        id: crypto.randomUUID(),
        company: '',
        title: '',
        startDate: '',
        endDate: '',
        present: false,
        description: '',
      },
    ];

    updateExperience(updated);
  };

  const removeExperience = (id: string) => {
    updateExperience(
      values.filter((item) => item.id !== id)
    );
  };

  const controls = useDragControls();

  return (
    <section
        className="
          min-w-0 overflow-x-hidden
          rounded-[2rem] border border-slate-200
          bg-white/80 p-4 sm:p-5shadow-sm
          backdrop-blur-xl dark:border-white/10
          dark:bg-white/[0.03]
          dark:shadow-none
        "
      >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Work Experience
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
            Add your professional experience.
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="
            rounded-xl bg-cyan-500
            px-4 py-2 font-medium
            text-white transition
            hover:bg-cyan-600
          "
        >
          <Plus size={18} />
        </button>
      </div>

      <Controller
        control={control}
        name="experience"
        render={() => (
          <Reorder.Group
            axis="y"
            values={values}
            onReorder={(newOrder) =>
              updateExperience(newOrder)
            }
            className="space-y-5"
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
                  shadow-sm
                  touch-pan-y
                  dark:border-white/10
                  dark:bg-black/20
                  dark:shadow-none
                "
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
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

                    <h3
                      className="
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Experience {index + 1}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeExperience(item.id)
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    value={item.company}
                    placeholder="Company"
                    onChange={(value) => {
                      const updated = [...values];
                      updated[index].company = value;
                      updateExperience(updated);
                    }}
                  />

                  <Input
                    value={item.title}
                    placeholder="Job Title"
                    onChange={(value) => {
                      const updated = [...values];
                      updated[index].title = value;
                      updateExperience(updated);  
                    }}
                  />

                  <div>
                    <label 
                      className="
                        mb-2 block text-sm
                        text-slate-500
                        dark:text-white/60
                      "
                    >
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) => {
                        const updated = [
                          ...values,
                        ];
                        updated[index].startDate =
                          e.target.value;
                        updateExperience(updated);
                      }}
                      className="
                        w-full rounded-2xl
                        border border-slate-200
                        bg-white px-4 py-3
                        text-slate-900 outline-none
                        transition
                        focus:border-cyan-400
                        disabled:bg-slate-100
                        disabled:text-slate-400
                        dark:border-white/10
                        dark:bg-black/20
                        dark:text-white
                        dark:disabled:bg-black/10
                        dark:disabled:text-white/30
                      "
                    />
                  </div>

                  <div>
                    <label 
                      className="
                        mb-2 block text-sm
                        text-slate-500
                        dark:text-white/60
                      "
                    >
                      End Date
                    </label>

                    <input
                      type="date"
                      disabled={item.present}
                      value={item.endDate}
                      onChange={(e) => {
                        const updated = [
                          ...values,
                        ];
                        updated[index].endDate =
                          e.target.value;
                        updateExperience(updated);
                      }}
                      className="
                        w-full rounded-2xl
                        border border-slate-200
                        bg-white px-4 py-3
                        text-slate-900 outline-none
                        transition
                        focus:border-cyan-400
                        disabled:bg-slate-100
                        disabled:text-slate-400
                        dark:border-white/10
                        dark:bg-black/20
                        dark:text-white
                        dark:disabled:bg-black/10
                        dark:disabled:text-white/30
                      "
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Checkbox.Root
                    checked={item.present}
                    onCheckedChange={(checked) => {
                      const updated = [...values];
                      updated[index].present =
                        Boolean(checked);
                      if (checked) {
                        updated[index].endDate =
                          '';
                      }
                      updateExperience(updated);
                    }}
                    className="
                      flex h-5 w-5
                      items-center justify-center
                      rounded border border-slate-300
                      bg-white text-cyan-600
                      dark:border-white/20
                      dark:bg-black
                      dark:text-white
                    "
                  >
                    <Checkbox.Indicator>
                      <Check size={14} />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  <p 
                    className="
                      text-sm text-slate-600
                      dark:text-white/70
                    "
                  >
                    Present
                  </p>
                </div>

                {item.endDate &&
                  item.startDate &&
                  item.endDate <
                    item.startDate && (
                    <p className="mt-3 text-sm text-red-400">
                      End date must be after
                      start date.
                    </p>
                  )}

                <div className="mt-5">
                  <RichTextEditor
                    value={item.description}
                    onChange={(content) => {
                      const updated = [...values];
                      updated[index].description =
                        content;
                      updateExperience(updated);
                    }}
                  />
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      />
    </section>
  )
}

export default WorkExperienceEditor

function Input({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        className="
          mb-2 block text-sm
          text-slate-500
          dark:text-white/60
        "
      >
        {placeholder}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full rounded-2xl
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
    </div>
  );
}

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],

    content: value,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          'prose prose-slate dark:prose-invert max-w-none min-h-[180px] p-4 outline-none',
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div
      className="
        overflow-hidden rounded-2xl
        border border-slate-200 bg-white
        dark:border-white/10
        dark:bg-black/20
      "
    >
      <div className="flex gap-2 border-b border-white/10 bg-black/30 p-3">
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className="
            rounded-lg
            border border-slate-200
            bg-white p-2
            text-slate-700 transition
            hover:bg-slate-100
            dark:border-white/10
            dark:bg-black/20
            dark:text-white
            dark:hover:bg-white/10
          "
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className="
            rounded-lg
            border border-slate-200
            bg-white p-2
            text-slate-700 transition
            hover:bg-slate-100
            dark:border-white/10
            dark:bg-black/20
            dark:text-white
            dark:hover:bg-white/10
          "
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className="
            rounded-lg
            border border-slate-200
            bg-white p-2
            text-slate-700 transition
            hover:bg-slate-100
            dark:border-white/10
            dark:bg-black/20
            dark:text-white
            dark:hover:bg-white/10
          "
        >
          <List size={16} />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="
          min-h-[180px]
          bg-white p-4
          max-w-none prose prose-slate
          dark:bg-black/20
          dark:prose-invert
        "
      />
    </div>
  );
}