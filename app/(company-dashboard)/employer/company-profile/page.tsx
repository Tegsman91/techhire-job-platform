'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';
import {
  Building2,
  Globe,
  Upload,
  Save,
  Eye,
  Plus,
  X,
  Check,
  ImagePlus,
} from 'lucide-react';
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import Button from '@/app/components/ui/Button';
import { type CompanyProfile, useCompanyProfileStore } from '@/lib/store';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/lib/getCroppedImg';

const techOptions = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'AWS',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'MongoDB',
  'GraphQL',
  'Redis',
  'TailwindCSS',
  'Go',
  'Java',
  'Firebase',
];

const perkOptions = [
  'Remote-first',
  'Equity',
  'Unlimited PTO',
  'Health Insurance',
  'Learning Budget',
  '4-Day Work Week',
  'Gym Membership',
  'Team Retreats',
  'Flexible Hours',
  'Parental Leave',
];

const formSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name is required'),

  tagline: z
    .string()
    .min(3, 'Tagline is required'),

  industry: z
    .string()
    .min(2, 'Industry is required'),
  
  companySize: z
    .string()
    .min(1, 'Company size is required'),

  foundedYear: z
    .string()
    .min(4, 'Founded year is required'),

  website: z
    .string()
    .url('Enter a valid website URL'),

  linkedin: z
    .string()
    .url('Enter a valid LinkedIn URL')
    .or(z.literal('')),
  twitter: z
    .string()
    .url('Enter a valid Twitter URL')
    .or(z.literal('')),

  github: z
    .string()
    .url('Enter a valid GitHub URL')
    .or(z.literal('')),

  techStack: z
    .array(z.string())
    .min(1, 'Select at least one technology'),

  perks: z
    .array(z.string())
    .min(1, 'Select at least one perk'),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  companyName: 'TechHire Labs',
  tagline: 'Building the future of hiring',
  industry: 'Software Development',
  companySize: '51-200',
  foundedYear: '2021',
  website: 'https://techhire.com',
  linkedin: 'https://linkedin.com/company/techhire',
  twitter: 'https://twitter.com/techhire',
  github: 'https://github.com/techhire',
  techStack: ['React', 'Next.js', 'AWS'],
  perks: ['Remote-first', 'Unlimited PTO'],
};

const CompanyProfilePage = () => {
  const updateProfile = useCompanyProfileStore(
    (state) => state.updateProfile
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
  useState<Area | null>(null);

  const [cropImage, setCropImage] = useState<string | null>(null);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(
    '/images/company-logo.png'
  );

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const togglePerk = (perk: string) => {
    const currentPerks = watch('perks') || [];

    if (currentPerks.includes(perk)) {
      setValue(
        'perks',
        currentPerks.filter((item) => item !== perk)
      );
    } else {
      setValue('perks', [...currentPerks, perk]);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <p>
        TechHire helps companies connect with world-class developers,
        designers, and product talent globally.
      </p>
    `,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          'min-h-[220px] px-1 sm:px-2 outline-none text-white leading-relaxed',
      },
    },
  });

  const onLogoDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    // setLogoPreview(preview);

    setCropImage(preview);
  }, []);

  const handleCropSave = async () => {
    if (!cropImage || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(
      cropImage,
      croppedAreaPixels
    );

    setLogoPreview(croppedImage);

    setCropImage(null);
  };

  const onGalleryDrop = useCallback((acceptedFiles: File[]) => {
    const previews = acceptedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setGalleryImages((prev) => [...prev, ...previews]);
  }, []);

  const {
    getRootProps: getLogoRootProps,
    getInputProps: getLogoInputProps,
    isDragActive: isLogoDragging,
  } = useDropzone({
    onDrop: onLogoDrop,
    accept: {
      'image/*': [],
    },
    multiple: false,
  });

  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
    isDragActive: isGalleryDragging,
  } = useDropzone({
    onDrop: onGalleryDrop,
    accept: {
      'image/*': [],
    },
    multiple: true,
  });

  const selectedTech = watch('techStack');

  const selectedPerks = watch('perks');

  const toggleTech = (tech: string) => {
    const exists = selectedTech.includes(tech);

    if (exists) {
      setValue(
        'techStack',
        selectedTech.filter((item) => item !== tech),
        {
          shouldValidate: true,
        }
      );
    } else {
      setValue(
        'techStack',
        [...selectedTech, tech],
        {
          shouldValidate: true,
        }
      );
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setSaving(true);

      const payload: CompanyProfile = {
        ...values,
        about: editor?.getHTML() ?? '',
        logo: logoPreview,
        gallery: galleryImages,
      };

      updateProfile(payload);

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A0A0F] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,211,238,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-5xl">
                Company Profile
              </h1>

              <p className="mt-3 max-w-2xl text-white/60">
                Customize your employer brand, showcase company culture,
                and attract top talent.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/company/techhire"
                target="_blank"
              >
                <Button
                  variant="outline"
                  leftIcon={<Eye size={18} />}
                  className="w-full sm:w-auto"
                >
                  Preview Profile
                </Button>
              </Link>

              <Button
                leftIcon={<Save size={18} />}
                onClick={handleSubmit(onSubmit)}
                loading={saving}
                className="w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </section>

        <form className="grid gap-6 lg:grid-cols-1 xl:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* BASIC INFO */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
                  <Building2 size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Basic Information
                  </h2>

                  <p className="text-sm text-white/50">
                    Your public employer profile details.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Company Name"
                  error={errors.companyName?.message}
                >
                  <input
                    {...register('companyName')}
                    className="input"
                    placeholder="Company Name"
                  />
                </InputField>

                <InputField
                  label="Tagline"
                  error={errors.tagline?.message}
                >
                  <input
                    {...register('tagline')}
                    className="input"
                    placeholder="Innovating the future"
                  />
                </InputField>

                <InputField
                  label="Industry"
                  error={errors.industry?.message}
                >
                  <input
                    {...register('industry')}
                    className="input"
                    placeholder="Technology"
                  />
                </InputField>

                <InputField
                  label="Company Size"
                  error={errors.companySize?.message}
                >
                  <select
                    {...register('companySize')}
                    className="input"
                  >
                    <option value="" className="bg-[#0A0A0F]">
                      Select Size
                    </option>
                    <option value="1-10" className="bg-[#0A0A0F]">
                      1-10
                    </option>
                    <option value="11-50" className="bg-[#0A0A0F]">
                      11-50
                    </option>
                    <option value="51-200" className="bg-[#0A0A0F]">
                      51-200
                    </option>
                    <option value="201-500" className="bg-[#0A0A0F]">
                      201-500
                    </option>
                    <option value="500+" className="bg-[#0A0A0F]">
                      500+
                    </option>
                  </select>
                </InputField>

                <InputField
                  label="Founded Year"
                  error={errors.foundedYear?.message}
                >
                  <input
                    {...register('foundedYear')}
                    className="input"
                    placeholder="2020"
                  />
                </InputField>

                <InputField
                  label="Website"
                  error={errors.website?.message}
                >
                  <div className="relative">
                    <Globe
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                    />

                    <input
                      {...register('website')}
                      className="
                        w-full
                        rounded-2xl
                        border border-white/10
                        bg-black/30
                        py-3
                        pl-12
                        pr-4
                        text-white
                        outline-none
                        transition
                        focus:border-cyan-400/40
                      "
                      placeholder="https://company.com"
                    />
                  </div>
                </InputField>
              </div>
            </section>
            
            {/* ABOUT */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold sm:text-2xl">
                  About Company
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Showcase your mission, culture, and story.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto border-b border-white/10 pb-4">
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().toggleBold().run()
                    }
                    className={toolbarButton(editor?.isActive('bold'))}
                  >
                    Bold
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().toggleItalic().run()
                    }
                    className={toolbarButton(editor?.isActive('italic'))}
                  >
                    Italic
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      editor
                        ?.chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                    }
                    className={toolbarButton(
                      editor?.isActive('bulletList')
                    )}
                  >
                    Bullet List
                  </button>
                </div>

                <EditorContent editor={editor} />
              </div>
            </section>

            {/* CULTURE & PERKS */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Culture & Perks
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Highlight what makes your company special.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {perkOptions.map((perk) => {
                  const active = selectedPerks.includes(perk);

                  return (
                    <button
                      key={perk}
                      type="button"
                      onClick={() => togglePerk(perk)}
                      className={clsx(
                        'flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300',
                        active
                          ? 'border-cyan-500/30 bg-cyan-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:border-cyan-500/20'
                      )}
                    >
                      <span>{perk}</span>

                      <div
                        className={clsx(
                          'flex h-5 w-5 items-center justify-center rounded-full border',
                          active
                            ? 'border-cyan-400 bg-cyan-400 text-black'
                            : 'border-white/20'
                        )}
                      >
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.perks && (
                <p className="mt-3 text-sm text-red-400">
                  {errors.perks.message}
                </p>
              )}
            </section>

            {/* TECH STACK */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Tech Stack
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Select technologies your team uses.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {techOptions.map((tech) => {
                  const active = selectedTech.includes(tech);

                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={clsx(
                        'rounded-full border px-3 py-2 text-xs sm:px-4 sm:text-sm transition-all duration-300',
                        active
                          ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-cyan-500/20'
                      )}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>

              {errors.techStack && (
                <p className="mt-3 text-sm text-red-400">
                  {errors.techStack.message}
                </p>
              )}
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* LOGO */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Company Logo
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Upload your company logo.
                </p>
              </div>

              <div
                {...getLogoRootProps()}
                className={clsx(
                  'cursor-pointer rounded-[2rem] border border-dashed p-5 sm:p-8 text-center transition-all duration-300',
                  isLogoDragging
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-white/10 bg-black/20 hover:border-cyan-500/20'
                )}
              >
                <input {...getLogoInputProps()} />

                {logoPreview ? (
                  <div className="space-y-4">
                    <div className="mx-auto h-28 w-28 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                      <Image
                        src={logoPreview}
                        alt="Company Logo"
                        width={112}
                        height={112}
                        placeholder="blur"
                        blurDataURL="/placeholders/company-blur.jpg"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <p className="text-sm text-white/50">
                      Drag and drop to replace logo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                      <Upload size={28} />
                    </div>

                    <div>
                      <p className="font-medium">
                        Upload Company Logo
                      </p>

                      <p className="mt-1 text-sm text-white/50">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* SOCIALS */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Social Links
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Connect your online presence.
                </p>
              </div>

              <div className="space-y-4">
                <SocialInput
                  icon={<FaLinkedin size={18} />}
                  placeholder="LinkedIn URL"
                  register={register('linkedin')}
                  error={errors.linkedin?.message}
                />

                <SocialInput
                  icon={<FaTwitter size={18} />}
                  placeholder="Twitter URL"
                  register={register('twitter')}
                  error={errors.twitter?.message}
                />

                <SocialInput
                  icon={<FaGithub size={18} />}
                  placeholder="GitHub URL"
                  register={register('github')}
                  error={errors.github?.message}
                />
              </div>
            </section>

            {/* GALLERY */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Company Gallery
                  </h2>

                  <p className="mt-1 text-sm text-white/50">
                    Upload office photos and team culture shots.
                  </p>
                </div>

                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                  <ImagePlus size={22} />
                </div>
              </div>

              <div
                {...getGalleryRootProps()}
                className={clsx(
                  'cursor-pointer rounded-[2rem] border border-dashed p-5 sm:p-8 text-center transition-all duration-300',
                  isGalleryDragging
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-white/10 bg-black/20 hover:border-cyan-500/20'
                )}
              >
                <input {...getGalleryInputProps()} />

                <div className="space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                    <Plus size={28} />
                  </div>

                  <div>
                    <p className="font-medium">
                      Upload Office Photos
                    </p>

                    <p className="mt-1 text-sm text-white/50">
                      Drag & drop multiple images
                    </p>
                  </div>
                </div>
              </div>

              {galleryImages.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-3xl border border-white/10"
                    >
                      <Image
                        src={image}
                        alt="Gallery"
                        width={400}
                        height={300}
                        className="h-28 sm:h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setGalleryImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </form>
      </div>

      {cropImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#111] p-6">
            <div className="relative h-[350px] w-full overflow-hidden rounded-2xl">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) =>
                  setCroppedAreaPixels(croppedPixels)
                }
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-6 w-full"
            />

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCropImage(null)}
                className="rounded-xl border border-white/10 px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCropSave}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-black"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CompanyProfilePage

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function SocialInput({
  icon,
  placeholder,
  register,
  error,
}: {
  icon: React.ReactNode;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div>
      <div className="relative min-w-0">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300">
          {icon}
        </div>

        <input
          {...register}
          placeholder={placeholder}
          className="
            w-full
            rounded-2xl
            border border-white/10
            bg-black/30
            text-sm sm:text-base
            py-3
            pl-12
            pr-4
            text-white
            outline-none
            transition
            focus:border-cyan-400/40
          "
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

const toolbarButton = (active?: boolean) =>
  clsx(
    'rounded-xl border px-3 py-2 text-xs sm:px-4 sm:text-sm transition-all duration-300',
    active
      ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'
      : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-cyan-500/20'
  );
