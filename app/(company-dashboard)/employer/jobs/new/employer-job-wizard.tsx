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
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none"
        />

        <button
          type="button"
          onClick={() => {
            if (!item.trim()) return;
            onChange([...(value || []), { id: nanoid(), text: item.trim() }]);
            setItem('');
          }}
          className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 px-4 py-2 text-cyan-300 transition"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value?.map((v) => (
          <span
            key={v.id}
            className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200"
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
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[180px]',
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
    <main className="relative z-0 min-h-screen overflow-x-hidden bg-[#0A0A0F] px-3 py-5 sm:px-6 lg:px-8 text-white"
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
        <section className="rounded-[2rem] border border-cyan-500/20 bg-white/[0.03] p-8 backdrop-blur-xl">
          <h1 className="text-4xl font-extrabold neon-cyan">
            {editId ? 'Edit Job' : 'Post a New Job'}
          </h1>
          <p className="mt-2 text-white/60">
            {editId
              ? 'Update your job listing details.'
              : 'Create premium job listings in a guided flow.'
            }
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="
            sticky top-6 h-fit
            rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl
            hidden lg:block"
          >
            {stepTitles.map((title, i) => (
              <div key={title} className="mb-5 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full grid place-items-center ${step >= i ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-white/40'}`}>
                  {step > i ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <span>{title}</span>
              </div>
            ))}
          </aside>

          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="text-sm text-white/60">
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
            rounded-[2rem] border border-white/10 
            bg-gradient-to-b from-white/[0.04] to-white/[0.02]
            p-5 sm:p-8 
            backdrop-blur-2xl 
            shadow-[0_0_40px_rgba(6,182,212,0.05)]
            space-y-6"
          >
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-white/40">
                    Job Title
                  </label>
                  <input 
                    {...register('title')} 
                    placeholder="Job Title" 
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-xl focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-white/40">
                    Department / Category
                  </label>
                  <input 
                    {...register('category')}
                    placeholder="Department / Category" 
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-xl focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none transition"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select 
                    {...register('locationType')}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] transition"
                  >
                    <option className="bg-[#0A0A0F]">Remote</option>
                    <option className="bg-[#0A0A0F]">Hybrid</option>
                    <option className="bg-[#0A0A0F]">On-site</option>
                  </select>
                  
                  
                  <input 
                    {...register('city')}
                    placeholder="City (e.g. Lagos)"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-xl focus:border-cyan-400/40 
                    focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] outline-none transition"
                  />
                  
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select 
                    {...register('employmentType')}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] transition"
                  >
                    <option className="bg-[#0A0A0F]">
                      Full-Time
                    </option>
                    <option className="bg-[#0A0A0F]">
                      Part-Time
                    </option>
                    <option className="bg-[#0A0A0F]">
                      Contract
                    </option>
                  </select>

                  <select 
                    {...register('experienceLevel')}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.25),0_0_10px_rgba(6,182,212,0.15)] transition"
                  >
                    <option className="bg-[#0A0A0F]">
                      Junior
                    </option>
                    <option className="bg-[#0A0A0F]">
                      Mid
                    </option>
                    <option className="bg-[#0A0A0F]">
                      Senior
                    </option>
                    <option className="bg-[#0A0A0F]">
                      Lead
                    </option>
                  </select>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 min-h-[220px] focus-within:border-cyan-400/30 focus-within:ring-1 focus-within:ring-cyan-500/20 transition"
                >
                  <div className="prose prose-invert max-w-none">
                    <EditorContent
                      editor={editor}
                      className="outline-none [&_.ProseMirror]:min-h-[180px]"
                    />
                  </div>
                </div>

                <Controller 
                  name="responsibilities" 
                  control={control} 
                  render={({ field }) => <BulletInput {...field} placeholder="Add responsibility" />} 
                />

                <Controller 
                  name="requirements" 
                  control={control} 
                  render={({ field }) => <BulletInput {...field} placeholder="Add requirement" />} 
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
                            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 hover:border-cyan-400/30 transition"
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
                  <label className="text-xs uppercase tracking-wide text-white/40">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    {...register('deadline')}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white 
                    appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-400 mt-2"
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
                w-full sm:w-auto 
                rounded-2xl border border-white/10 bg-white/5 
                px-5 py-3 text-white/70 hover:bg-white/10 transition"
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
                  w-full sm:w-auto 
                  rounded-2xl border border-cyan-500/20 bg-cyan-500/10 
                  px-5 py-3 text-cyan-300 hover:bg-cyan-500/20 transition"
                >
                  <Save size={18} /> Save Draft
                </button>

                <button 
                  type="button" 
                  onClick={() => setPreviewOpen(true)} 
                  className="flex items-center justify-center gap-2 
                  w-full sm:w-auto 
                  rounded-2xl border border-purple-500/20 bg-purple-500/10 
                  px-5 py-3 text-purple-300 hover:bg-purple-500/20 transition"
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
                    rounded-2xl border border-purple-500/20 bg-purple-500/10 
                    px-5 py-3 text-purple-300 hover:bg-purple-500/20 transition"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSubmit(onPublish)}
                    className="flex items-center justify-center gap-2 
                    w-full sm:w-auto 
                    rounded-2xl bg-gradient-to-r from-cyan-500/30 to-purple-500/20 
                    px-6 py-3 text-white hover:opacity-90 transition"
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
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0F]/70 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.15)]"
            >
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_45%)]" />

              {/* HEADER */}
              <div className="border-b border-white/10 px-6 py-5 shrink-0">
                <Dialog.Title className="text-2xl md:text-3xl font-bold text-cyan-300">
                  {values.title || 'Untitled Job'}
                </Dialog.Title>

                <Dialog.Description className="sr-only">
                  Preview how your job listing will appear to candidates.
                </Dialog.Description>

                <p className="mt-2 text-sm text-white/60">
                  {values.category} • {values.locationType} • {values.city}
                </p>
              </div>

              {/* BODY */}
              <div className="overflow-y-auto px-6 py-6 flex-1 space-y-8 pb-10 no-scrollbar">
                {/* DESCRIPTION */}
                <section>
                  <h3 className="text-sm uppercase tracking-wider text-white/40 mb-3">
                    Description
                  </h3>

                  <div
                    className="prose prose-invert max-w-none text-white/90"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(values.description || ''),
                    }}
                  />
                </section>

                {/* RESPONSIBILITIES */}
                {values.responsibilities?.length > 0 && (
                  <section>
                    <h3 className="text-sm uppercase tracking-wider text-white/40 mb-3">
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
                    <h3 className="text-sm uppercase tracking-wider text-white/40 mb-3">
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
                    <h3 className="text-sm uppercase tracking-wider text-white/40 mb-3">
                      Benefits
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {values.benefits.map((b: string) => (
                        <span
                          key={b}
                          className="
                            rounded-full
                            border border-cyan-500/20
                            bg-cyan-500/10
                            px-3 py-1 text-sm text-cyan-200
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
                  <h3 className="text-sm uppercase tracking-wider text-white/40 mb-3">
                    Compensation
                  </h3>

                  <p className="text-white/90 text-lg font-semibold">
                    ₦{values.salaryMin?.toLocaleString()} — ₦{values.salaryMax?.toLocaleString()}
                  </p>
                </section>

                {/* DEADLINE */}
                {values.deadline && (
                  <section>
                    <h3 className="text-sm uppercase tracking-wider text-white/40 mb-3">
                      Application Deadline
                    </h3>

                    <p className="text-white/80">
                      {new Date(values.deadline).toDateString()}
                    </p>
                  </section>
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t border-white/5 px-6 py-4 shrink-0 flex justify-end backdrop-blur-xl">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 hover:bg-white/10 transition"
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