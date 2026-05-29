'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import * as Dialog from '@radix-ui/react-dialog';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Eye,
  Save,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { EmployerJobItem, useEmployerJobsStore } from '@/lib/store';
import Checkbox from '@/app/components/ui/Checkbox';
import SalaryRange from '@/app/components/jobs/salary-range';
import CustomSelect from '@/app/components/ui/Select';

const schema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  locationType: z.enum(['Remote', 'Hybrid', 'On-site']),
  city: z.string().min(2),
  employmentType: z.enum(['Full-Time', 'Part-Time', 'Contract']),
  experienceLevel: z.enum(['Junior', 'Mid', 'Senior', 'Lead']),
  description: z.string().min(20),
  responsibilities: z.array(z.object({ id: z.string(), text: z.string().min(1) })).min(1),
  requirements: z.array(z.object({ id: z.string(), text: z.string().min(1) })).min(1),
  niceToHaves: z.array(z.object({ id: z.string(), text: z.string().min(1) })).optional(),
  salaryMin: z.number(),
  salaryMax: z.number(),
  currency: z.string(),
  benefits: z.array(z.string()),
  deadline: z.string(),
  screeningQuestions: z.array(z.object({ id: z.string(), text: z.string().min(1) })).optional(),
}).refine((data) => data.salaryMin <= data.salaryMax, {
  message: 'Minimum salary must not exceed maximum salary',
  path: ['salaryMax'],
});

type FormValues = z.infer<typeof schema>;

const benefitsOptions = [
  'Health Insurance',
  'Equity',
  'Remote Work',
  'Unlimited PTO',
  'Learning Budget',
  'Wellness Program',
];

const stepTitles = [
  'Job Basics',
  'Job Details',
  'Compensation',
  'Application Settings',
];

const stepFields: (keyof FormValues)[][] = [
  ['title', 'category', 'locationType', 'city'],
  ['description', 'responsibilities', 'requirements'],
  ['salaryMin', 'salaryMax', 'currency', 'benefits'],
  ['deadline'],
];

type BulletInputProps = {
  value?: { id: string; text: string }[];
  onChange: (values: { id: string; text: string }[]) => void;
  placeholder: string;
};

function BulletInput({ value, onChange, placeholder }: BulletInputProps) {
  const [item, setItem] = useState('');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();

              if (!item.trim()) return;

              onChange([
                ...(value || []),
                {
                  id: nanoid(),
                  text: item.trim(),
                },
              ]);

              setItem('');
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-2xl  px-4 py-3 
          border border-zinc-200
          bg-white  text-zinc-900
          placeholder:text-zinc-400 shadow-sm
          dark:border-white/10 dark:bg-black/40
          dark:text-white
          dark:placeholder:text-white/40
          backdrop-blur-xl focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none transition"
        />

        <button
          type="button"
          onClick={() => {
            if (!item.trim()) return;
            onChange([...(value || []), { id: nanoid(), text: item.trim() }]);
            setItem('');
          }}
          className="
            rounded-xl bg-cyan-100 hover:bg-cyan-200 px-4 py-2
            text-cyan-700 transition dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 dark:text-cyan-300
          "
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value?.map((v) => (
          <span
            key={v.id}
            className="
              flex items-center gap-2 rounded-full border border-cyan-200
              bg-cyan-50 px-3 py-1 text-sm text-cyan-700
              dark:border-cyan-500/20 dark:bg-cyan-500/10
              dark:text-cyan-200
            "
          >
            <span>{v.text}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((entry) => entry.id !== v.id))}
              className="rounded-full bg-white/10 px-2 py-1 text-xs"
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

const EmployerJobWizard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  const employerJobs = useEmployerJobsStore((s) => s.employerJobs);
  const updateEmployerJob = useEmployerJobsStore((s) => s.updateEmployerJob);

  const existingJob = employerJobs.find((job) => job.id === editId);

  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const addEmployerJob = useEmployerJobsStore((s) => s.addEmployerJob);
  const [draftId, setDraftId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      locationType: 'Remote',
      city: '',
      employmentType: 'Full-Time',
      experienceLevel: 'Mid',
      description: '',
      responsibilities: [],
      requirements: [],
      niceToHaves: [],
      salaryMin: 50000,
      salaryMax: 120000,
      currency: 'USD',
      benefits: [],
      deadline: '',
      screeningQuestions: [],
    },
  });

  const values = watch();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Describe the role, responsibilities, expectations...',
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: [
          'prose',
          'max-w-none',
          'min-h-[180px]',
          'focus:outline-none',
          'text-zinc-800',
          'dark:prose-invert',
          'dark:text-white',
        ].join(' '),
      },
    },
    onUpdate({ editor }) {
      setValue('description', editor.getHTML(), {
        shouldValidate: true,
      });
    },
  });

  useEffect(() => {
    if (!existingJob) return;

    setValue('title', existingJob.title);
    setValue('category', existingJob.category);
    setValue('locationType', existingJob.locationType);
    setValue('city', existingJob.city);
    setValue('employmentType', existingJob.employmentType);
    setValue('experienceLevel', existingJob.experienceLevel);

    setValue('description', existingJob.description);

    setValue(
      'responsibilities',
      existingJob.responsibilities.map((text) => ({
        id: nanoid(),
        text,
      }))
    );

    setValue(
      'requirements',
      existingJob.requirements.map((text) => ({
        id: nanoid(),
        text,
      }))
    );

    setValue(
      'niceToHaves',
      existingJob.niceToHaves?.map((text) => ({
        id: nanoid(),
        text,
      })) ?? []
    );

    setValue('salaryMin', existingJob.salaryMin);
    setValue('salaryMax', existingJob.salaryMax);
    setValue('currency', existingJob.currency);
    setValue('benefits', existingJob.benefits);

    setValue('deadline', existingJob.deadline);

    setValue(
      'screeningQuestions',
      existingJob.screeningQuestions?.map((text) => ({
        id: nanoid(),
        text,
      })) ?? []
    );

    setDraftId(existingJob.id);

    // also update editor content
    editor?.commands.setContent(existingJob.description || '');
  }, [existingJob, setValue, editor]);

  const onPublish = (data: FormValues) => {
    const formattedData = {
      ...data,
      responsibilities: data.responsibilities.map((item) => item.text),
      requirements: data.requirements.map((item) => item.text),
      niceToHaves: data.niceToHaves?.map((item) => item.text) ?? [],
      screeningQuestions: data.screeningQuestions?.map((item) => item.text) ?? [],
    };

    if (editId && existingJob) {
      // UPDATE
      updateEmployerJob(editId, {
        ...formattedData,
        status: 'published',
      });
    } else {
      // CREATE
      addEmployerJob({
        ...formattedData,
        id: nanoid(),
        applicationsCount: 0,
        viewsCount: 0,
        status: 'published',
        createdAt: new Date().toISOString(),
      });
    }

    router.push('/employer/jobs');
  };

  const saveDraft = () => {
    const id = editId ?? draftId ?? nanoid();

    const draftJob: EmployerJobItem = {
      id,
      title: values.title || '',
      category: values.category || '',
      locationType: values.locationType || 'Remote',
      city: values.city || '',
      employmentType: values.employmentType || 'Full-Time',
      experienceLevel: values.experienceLevel || 'Mid',

      description: values.description || '',
      responsibilities: values.responsibilities?.map((item) => item.text) ?? [],
      requirements: values.requirements?.map((item) => item.text) ?? [],
      niceToHaves: values.niceToHaves?.map((item) => item.text) ?? [],

      salaryMin: values.salaryMin || 0,
      salaryMax: values.salaryMax || 0,
      currency: values.currency || 'USD',
      benefits: values.benefits || [],

      applicationsCount: existingJob?.applicationsCount ?? 0,
      viewsCount: existingJob?.viewsCount ?? 0,

      deadline: values.deadline || '',
      screeningQuestions: values.screeningQuestions?.map((item) => item.text) ?? [],

      status: 'draft',
      createdAt: existingJob?.createdAt ?? new Date().toISOString(),
    };

    if (editId && existingJob) {
      updateEmployerJob(editId, draftJob);
    } else {
      addEmployerJob(draftJob);
    }

    setDraftId(id);
  };

  const responsibilities = values.responsibilities.map((r) =>
    typeof r === 'string' ? r : r.text
  );

  const requirements = values.requirements.map((r) =>
    typeof r === 'string' ? r : r.text
  );

  return (
    <main
      className="
        relative z-0 min-h-screen overflow-x-hidden
        bg-gradient-to-br
        from-slate-50 via-white to-cyan-50/40
        text-zinc-900
        px-3 py-5 sm:px-6 lg:px-8
        dark:bg-[#0A0A0F]
        dark:bg-none
        dark:text-white
      "
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(6,182,212,0.2), transparent 40%), radial-gradient(circle at bottom left, rgba(168,85,247,0.2), transparent 45%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section
          className="
            relative overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-gradient-to-br from-white via-cyan-50/40
            to-purple-50/30 p-6 sm:p-8
            shadow-[0_10px_40px_rgba(15,23,42,0.06)]
            dark:border-cyan-500/20 dark:from-white/[0.05]
            dark:via-cyan-500/[0.04] dark:to-purple-500/[0.03]
            dark:shadow-[0_0_40px_rgba(6,182,212,0.08)]
          "
        >
          {/* Glow Effects */}
          <div className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />

          <div className="pointer-events-none absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/10" />

          <div className="relative z-10">
            <div
              className="
                inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5
                text-xs font-medium uppercase tracking-[0.18em]
                text-cyan-700 dark:border-cyan-500/20
                dark:bg-cyan-500/10 dark:text-cyan-300
              "
            >
              {editId ? 'Editing Mode' : 'Hiring Workflow'}
            </div>

            <h1
              className="
                mt-5 text-4xl sm:text-5xl font-black tracking-tight
                text-zinc-900 dark:bg-gradient-to-r
                dark:from-cyan-200 dark:via-cyan-300
                dark:to-purple-300 dark:bg-clip-text
                dark:text-transparent
              "
            >
              {editId ? 'Edit Job' : 'Post a New Job'}
            </h1>

            <p
              className="
                mt-4 max-w-2xl text-base sm:text-lg leading-relaxed
                text-zinc-600 dark:text-white/60
              "
            >
              {editId
                ? 'Update your job listing details and optimize your hiring pipeline.'
                : 'Create premium job listings with a guided workflow designed for modern recruiting teams.'
              }
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="
            sticky top-6 h-fit rounded-[2rem]
            border border-zinc-200 bg-white/90 p-5
            backdrop-blur-xl shadow-sm dark:border-white/10 dark:bg-white/[0.03] hidden lg:block"
          >
            {stepTitles.map((title, i) => (
              <div key={title} className="mb-5 flex items-center gap-3">
                <div
                  className={`
                    h-10 w-10 rounded-full grid place-items-center transition
                    ${
                      step >= i
                        ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-white/40'
                    }
                  `}
                >
                  {step > i ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <span>{title}</span>
              </div>
            ))}
          </aside>

          {/* Mobile step indicator */}
          <div 
            className="
              lg:hidden flex items-center justify-between rounded-2xl
              border border-zinc-200 bg-white/90 px-4 py-3
              shadow-sm dark:border-white/10 dark:bg-white/[0.03]
            "
          >
            <span className="text-sm text-zinc-500 dark:text-white/60">
              Step {step + 1} of {stepTitles.length}
            </span>

            <div className="flex gap-1">
              {stepTitles.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-full ${
                    i <= step ? 'bg-cyan-400' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <form 
            onSubmit={handleSubmit(onPublish)} 
            className="
            rounded-[2rem] border border-zinc-200
            bg-gradient-to-b from-white to-slate-50/90
            shadow-sm dark:border-white/10
            dark:from-white/[0.04] dark:to-white/[0.02]
            p-5 sm:p-8  backdrop-blur-2xl space-y-6"
          >
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-zinc-500 dark:text-white/40">
                    Job Title
                  </label>

                  <input 
                    {...register('title')} 
                    placeholder="Job Title" 
                    className="w-full rounded-2xl px-4 py-3 
                    border border-zinc-200
                    bg-white text-zinc-900
                    placeholder:text-zinc-400 shadow-sm
                    dark:border-white/10 dark:bg-black/40
                    dark:text-white
                    dark:placeholder:text-white/40
                    backdrop-blur-xl focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-zinc-500 dark:text-white/40">
                    Department / Category
                  </label>

                  <input 
                    {...register('category')}
                    placeholder="Department / Category" 
                    className="w-full rounded-2xl px-4 py-3 
                    border border-zinc-200
                    bg-white  text-zinc-900
                    placeholder:text-zinc-400 shadow-sm
                    dark:border-white/10 dark:bg-black/40
                    dark:text-white
                    dark:placeholder:text-white/40
                    backdrop-blur-xl focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none transition"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">                
                  <Controller
                    name="locationType"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select location type"
                        options={[
                          { label: 'Remote', value: 'Remote' },
                          { label: 'Hybrid', value: 'Hybrid' },
                          { label: 'On-site', value: 'On-site' },
                        ]}
                      />
                    )}
                  />
                  
                  <input 
                    {...register('city')}
                    placeholder="City (e.g. Lagos)"
                    className="w-full rounded-2xl px-4 py-3 
                    border border-zinc-200
                    bg-white  text-zinc-900
                    placeholder:text-zinc-400 shadow-sm
                    dark:border-white/10 dark:bg-black/40
                    dark:text-white
                    dark:placeholder:text-white/40
                    backdrop-blur-xl focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none transition"
                  />
                  
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    name="employmentType"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select employment type"
                        options={[
                          { label: 'Full-Time', value: 'Full-Time' },
                          { label: 'Part-Time', value: 'Part-Time' },
                          { label: 'Contract', value: 'Contract' },
                        ]}
                      />
                    )}
                  />

                  <Controller
                    name="experienceLevel"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        placeholder="Select experience level"
                        options={[
                          { label: 'Junior', value: 'Junior' },
                          { label: 'Mid', value: 'Mid' },
                          { label: 'Senior', value: 'Senior' },
                          { label: 'Lead', value: 'Lead' },
                        ]}
                      />
                    )}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div
                  className="
                    rounded-2xl border
                    border-zinc-200 bg-white
                    dark:border-white/10 dark:bg-black/40
                    backdrop-blur-xl p-4 min-h-[220px]
                    focus-within:border-cyan-400/40
                    focus-within:ring-1
                    focus-within:ring-cyan-500/20
                    transition
                  "
                >
                  <div className="prose max-w-none dark:prose-invert">
                    <EditorContent
                      editor={editor}
                      className="outline-none [&_.ProseMirror]:min-h-[180px]"
                    />
                  </div>
                </div>

                <Controller 
                  name="responsibilities" 
                  control={control} 
                  render={({ field }) => 
                    <BulletInput 
                      {...field} 
                      placeholder="Add responsibility" 
                    />
                  } 
                />

                <Controller 
                  name="requirements" 
                  control={control} 
                  render={({ field }) => 
                    <BulletInput 
                      {...field} 
                      placeholder="Add requirement" 
                    />
                  } 
                />
              </>
            )}

            {step === 2 && (
              <>
                <Controller
                  name="salaryMin"
                  control={control}
                  render={({ field: minField }) => (
                    <Controller
                      name="salaryMax"
                      control={control}
                      render={({ field: maxField }) => (
                        <SalaryRange
                          value={[minField.value, maxField.value]}
                          onChange={([min, max]) => {
                            minField.onChange(min);
                            maxField.onChange(max);
                          }}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="benefits"
                  control={control}
                  render={({ field }) => {
                    const selected = field.value || [];

                    const toggle = (benefit: string) => {
                      if (selected.includes(benefit)) {
                        field.onChange(selected.filter((b: string) => b !== benefit));
                      } else {
                        field.onChange([...selected, benefit]);
                      }
                    };

                    return (
                      <div className="grid gap-3 md:grid-cols-2">
                        {benefitsOptions.map((benefit) => (
                          <div
                            key={benefit}
                            className="
                              rounded-2xl border border-zinc-200 bg-white
                              px-4 py-3 shadow-sm hover:border-cyan-300
                              transition dark:border-white/10
                              dark:bg-black/30 dark:hover:border-cyan-400/30"
                          >
                            <Checkbox
                              label={benefit}
                              checked={selected.includes(benefit)}
                              onCheckedChange={() => toggle(benefit)}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-zinc-500 dark:text-white/40">
                    Application Deadline
                  </label>

                  <input
                    type="date"
                    {...register('deadline')}
                    className="
                      w-full rounded-2xl px-4 py-3
                      border border-zinc-200
                      bg-white text-zinc-900
                      placeholder:text-zinc-400
                      shadow-sm outline-none transition
                      [color-scheme:light]
                      dark:border-white/10
                      dark:bg-[#0F1117]
                      dark:text-white
                      dark:placeholder:text-white/40
                      backdrop-blur-xl
                      focus:border-cyan-400/40
                      focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)]
                      [&::-webkit-calendar-picker-indicator]:cursor-pointer
                      [&::-webkit-calendar-picker-indicator]:opacity-80
                      hover:[&::-webkit-calendar-picker-indicator]:opacity-100
                    "
                  />
                </div>

                <Controller 
                  name="screeningQuestions" 
                  control={control} 
                  render={({ field }) => <BulletInput {...field} placeholder="Add screening question" 
                  />} 
                />
              </>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
              {/* Back Button */}
              <button 
                type="button" 
                onClick={() => setStep((s) => Math.max(0, s - 1))} 
                className="flex items-center justify-center gap-2 
                w-full sm:w-auto  rounded-2xl border border-zinc-200
                bg-white px-5 py-3 text-zinc-700 hover:bg-zinc-100
                shadow-sm dark:border-white/10 dark:bg-white/5
                dark:text-white/70 dark:hover:bg-white/10 transition"
              >
                <ArrowLeft size={18} />
                <span className="sm:hidden">Back</span>
              </button>

              {/* Right Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                <button 
                  type="button" 
                  onClick={saveDraft} 
                  className="flex items-center justify-center gap-2 
                  w-full sm:w-auto  rounded-2xl
                  border border-cyan-200 bg-cyan-50
                  px-5 py-3 text-cyan-700 hover:bg-cyan-100
                  shadow-sm dark:border-cyan-500/20
                  dark:bg-cyan-500/10 dark:text-cyan-300
                  dark:hover:bg-cyan-500/20 transition"
                >
                  <Save size={18} /> Save Draft
                </button>

                <button 
                  type="button" 
                  onClick={() => setPreviewOpen(true)} 
                  className="flex items-center justify-center gap-2 
                  w-full sm:w-auto 
                  rounded-2xl
                  border border-purple-200
                  bg-purple-100
                  px-5 py-3
                  text-purple-700
                  hover:bg-purple-200
                  shadow-sm
                  dark:border-purple-500/20
                  dark:bg-purple-500/10
                  dark:text-purple-300
                  dark:hover:bg-purple-500/20
                  transition"
                >
                  <Eye size={18} /> Preview
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const valid = await trigger(stepFields[step]);
                      if (valid) setStep((s) => s + 1);
                    }}
                    className="flex items-center justify-center gap-2 
                    w-full sm:w-auto 
                    rounded-2xl border border-purple-200
                    bg-purple-100 px-5 py-3 text-purple-700
                    hover:bg-purple-200 shadow-sm
                    dark:border-purple-500/20
                    dark:bg-purple-500/10 dark:text-purple-300
                    dark:hover:bg-purple-500/20 transition"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit(onPublish)}
                    className="
                      flex items-center justify-center gap-2
                      w-full sm:w-auto rounded-2xl
                      px-6 py-3 text-white
                      transition-all duration-300
                      bg-gradient-to-r
                      from-cyan-500 to-purple-500
                      hover:opacity-90 shadow-lg
                      dark:from-cyan-600
                      dark:to-violet-700
                      dark:shadow-[0_0_20px_rgba(6,182,212,0.18)]
                      dark:hover:brightness-110
                    "
                  >
                    Publish Job
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70" />

          <div className="fixed inset-0 flex items-start sm:items-center justify-center p-4">
            <Dialog.Content
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 dark:bg-[#0A0A0F]/70 bg-white/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.15)]"
            >
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_45%)]" />

              {/* HEADER */}
              <div className="border-b border-zinc-200 dark:border-white/10 px-6 py-5 shrink-0">
                <Dialog.Title className="text-2xl md:text-3xl font-bold dark:text-cyan-300 text-cyan-600">
                  {values.title || 'Untitled Job'}
                </Dialog.Title>

                <Dialog.Description className="sr-only">
                  Preview how your job listing will appear to candidates.
                </Dialog.Description>

                <p className="mt-2 text-sm text-zinc-500 dark:text-white/60">
                  {values.category} • {values.locationType} • {values.city}
                </p>
              </div>

              {/* BODY */}
              <div className="overflow-y-auto px-6 py-6 flex-1 space-y-8 pb-10 no-scrollbar">
                {/* DESCRIPTION */}
                <section>
                  <h3 className="mb-3 text-sm uppercase tracking-wider text-zinc-500 dark:text-white/40">
                    Description
                  </h3>

                  <div
                    className="
                      prose max-w-none text-zinc-700
                      dark:prose-invert dark:text-white/90
                    "
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(values.description || ''),
                    }}
                  />
                </section>

                {/* RESPONSIBILITIES */}
                {values.responsibilities?.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm uppercase tracking-wider text-zinc-500 dark:text-white/40">
                      Responsibilities
                    </h3>

                    <ul className="space-y-2">
                      {responsibilities.map((text, i) => (
                        <li key={i}>{text}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* REQUIREMENTS */}
                {values.requirements?.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm uppercase tracking-wider text-zinc-500 dark:text-white/40">
                      Requirements
                    </h3>

                    <ul className="space-y-2">
                      {requirements.map((text, i) => (
                        <li key={i}>{text}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* BENEFITS */}
                {values.benefits?.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm uppercase tracking-wider text-zinc-500 dark:text-white/40">
                      Benefits
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {values.benefits.map((b: string) => (
                        <span
                          key={b}
                          className="
                            rounded-full border border-cyan-200
                            bg-cyan-50 px-3 py-1 text-sm text-cyan-700
                            dark:border-cyan-500/20 
                            dark:bg-cyan-500/10
                            dark:text-cyan-200
                          "
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* SALARY */}
                <section>
                  <h3 className="mb-3 text-sm uppercase tracking-wider text-zinc-500 dark:text-white/40">
                    Compensation
                  </h3>

                  <p className="text-zinc-900 dark:text-white/90 text-lg font-semibold">
                    ₦{values.salaryMin?.toLocaleString()} — ₦{values.salaryMax?.toLocaleString()}
                  </p>
                </section>

                {/* DEADLINE */}
                {values.deadline && (
                  <section>
                    <h3 className="mb-3 text-sm uppercase tracking-wider text-zinc-500 dark:text-white/40">
                      Application Deadline
                    </h3>

                    <p className="text-zinc-700 dark:text-white/80">
                      {new Date(values.deadline).toDateString()}
                    </p>
                  </section>
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t border-zinc-200 dark:border-white/5 px-6 py-4 shrink-0 flex justify-end backdrop-blur-xl">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="
                    rounded-xl border border-zinc-300
                    bg-zinc-100 px-4 py-2 text-zinc-700
                    hover:bg-zinc-200 transition dark:border-white/10
                    dark:bg-white/5 dark:text-white/70
                    dark:hover:bg-white/10
                  "
                >
                  Close
                </button>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}

export default EmployerJobWizard