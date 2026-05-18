'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import { FileText, Trash2, Sparkles } from 'lucide-react';
import Modal, { ModalHeader } from '../ui/Modal';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApplicationsStore } from '@/lib/store';

const applicationSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.email({ message: 'Enter a valid email' }),
  phone: z.string().min(7, { message: 'Phone number is required' }),
  coverLetter: z.string().min(50, { message: 'Cover letter is too short' }),
  linkedin: z
    .union([
      z.literal(''),
      z.url({ message: 'Enter a valid LinkedIn URL' }),
    ]),
  portfolio: z
    .union([
      z.literal(''),
      z.url({ message: 'Enter a valid Portfolio URL' }),
    ]),
  fitReason: z
    .string()
    .min(20, { message: 'Tell us why you are a good fit' })
    .max(500, { message: 'Maximum 500 characters allowed' }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationModalProps {
  jobTitle: string;
  jobId: string;
}

const profileResume = {
  fileName: 'my-resume-2026.pdf',
  coverLetter: 'I am excited to contribute my skills and experience to your company.',
};

const ApplicationModal = ({ jobTitle, jobId }: ApplicationModalProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const addApplication = useApplicationsStore((state) => state.addApplication);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      linkedin: '',
      portfolio: '',
      fitReason: '',
    },
  });

  const fitReason = watch('fitReason') || '';
  const coverLetter = watch('coverLetter') || '';

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setResumeFile(file);
      setResumeError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleUseProfileResume = () => {
    setValue('coverLetter', profileResume.coverLetter);
    setResumeFile(new File(['resume'], profileResume.fileName));
    setResumeError(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      setResumeError("Please upload a resume");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1800));

    addApplication({
      id: crypto.randomUUID(),
      jobId,
      jobTitle,
      companyName: 'TechHire Partner',
      companyLogo: '/images/company-logo.png',
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      nextStep: 'Await recruiter review',

      applicant: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        coverLetter: data.coverLetter,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        fitReason: data.fitReason,
        resumeName: resumeFile.name,
      },
    });

    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

    setIsSubmitting(false);
    setSubmitted(true);

    timeoutRef.current = setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      reset();
      setResumeFile(null);
    }, 2200);
  };

  return (
    <>
      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        Apply Now
      </Button>
      
      <Modal open={open} onOpenChange={setOpen} size="md">
        <ModalHeader>Apply for {jobTitle}</ModalHeader>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <Sparkles className="mx-auto text-cyan-400" size={42} />
            <h3 className="text-2xl font-bold text-white">
              Application Submitted!
            </h3>
            <p className="text-gray-400">
              Your application has been saved successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            </div>

            <Input label="Phone Number" {...register('phone')} error={errors.phone?.message} />

            <div
              {...getRootProps()}
              className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                isDragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              {resumeFile ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="text-cyan-400" size={18} />
                    <span>{resumeFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">
                  Drag & drop resume (PDF/DOCX)
                </p>
              )}
            </div>

            {resumeError && 
            <p className="text-red-400 text-sm">
              {resumeError}
            </p>
            }

            <button
              type="button"
              onClick={handleUseProfileResume}
              className="text-sm text-cyan-400 hover:underline"
            >
              Use Profile Resume
            </button>

            <Textarea
              label="Cover Letter"
              rows={5}
              maxLength={1200}
              {...register('coverLetter')}
              error={errors.coverLetter?.message}
            />
            <p className="text-xs text-gray-400 mt-[-22px] text-right">
              {coverLetter.length}/1200
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="LinkedIn URL" {...register('linkedin')} error={errors.linkedin?.message} />
              <Input label="Portfolio URL" {...register('portfolio')} error={errors.portfolio?.message} />
            </div>

            <Textarea
              label="Why are you a good fit?"
              rows={4}
              maxLength={500}
              {...register('fitReason')}
              error={errors.fitReason?.message}
            />
            <p className="text-xs text-gray-400 mt-[-22px] text-right">  {fitReason.length}/500</p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </Modal >
    </>
  )
}

export default ApplicationModal