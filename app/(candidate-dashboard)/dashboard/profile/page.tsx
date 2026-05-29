'use client';

import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import { Camera, Save, Sparkles } from 'lucide-react';
import {
  CandidateProfile,
  useCandidateProfileStore,
} from '@/lib/store';
import Image from 'next/image';
import { UseFormRegisterReturn } from 'react-hook-form';
import Checkbox from '@/app/components/ui/Checkbox';
import CustomSelect from '@/app/components/ui/Select';

type FormValues = z.infer<typeof schema> &
  CandidateProfile;

const schema = z.object({
  avatar: z.string(),

  personal: z.object({
    name: z.string().min(1),
    email: z.email(),
    phone: z.string().min(1),
    location: z.string().min(1),
    linkedin: z.string(),
    portfolio: z.string(),
    github: z.string(),
  }),

  professionalTitle: z
    .string()
    .min(2),

  bio: z
    .string()
    .max(500),

  experienceLevel: z.enum([
    'Junior',
    'Mid',
    'Senior',
    'Lead',
  ]),

  skills: z.array(z.string()),

  lookingFor: z.object({
    remote: z.boolean(),
    fullTime: z.boolean(),
    contract: z.boolean(),
    internship: z.boolean(),

    salaryMin: z.number(),
    salaryMax: z.number(),
  }),

  workAuthorization:
    z.string().min(1),
});

const allSkills = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'AWS',
  'Docker',
  'TailwindCSS',
  'GraphQL',
  'PostgreSQL',
];

const ProfilePage = () => {
  const profile =
    useCandidateProfileStore(
      (state) => state.profile
    );

  const updateProfile =
    useCandidateProfileStore(
      (state) => state.updateProfile
    );

  const [skills, setSkills] =
    useState(profile.skills);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [imageSrc, setImageSrc] =
    useState<string | null>(null);

  const [showCropper, setShowCropper] =
    useState(false);

  const onCropComplete = (
    _: unknown,
    croppedPixels: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ) => {
    setCroppedAreaPixels(
      croppedPixels
    );
  };

  const saveCroppedImage =
    async () => {
      if (
        !imageSrc ||
        !croppedAreaPixels
      )
        return;

      const croppedImage =
        await getCroppedImg(
          imageSrc,
          croppedAreaPixels
        );

      if (!croppedImage) return;

      setValue('avatar', croppedImage);

      setShowCropper(false);
    };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: profile,
  });

  const avatar = watch('avatar');
  const bio = watch('bio');

  const onDrop = (files: File[]) => {
    const file = files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result as string);

      setShowCropper(true);
    };

    reader.readAsDataURL(file);
  };

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {
      'image/*': [],
    },
    multiple: false,
    onDrop,
  });

  const values = watch();

  const completion = useMemo(() => {
    const total = 10;

    let completed = 0;

    if (values.avatar) completed++;

    if (values.personal.name)
      completed++;

    if (values.personal.email)
      completed++;

    if (values.personal.phone)
      completed++;

    if (values.professionalTitle)
      completed++;

    if (values.bio)
      completed++;

    if (skills.length)
      completed++;

    if (values.personal.linkedin)
      completed++;

    if (values.personal.github)
      completed++;

    if (values.workAuthorization)
      completed++;

    return Math.round(
      (completed / total) * 100
    );
  }, [values, skills]);

  const onSubmit = (
    data: CandidateProfile
  ) => {
    updateProfile({
      ...data,
      skills,
    });

    alert(
      'Profile updated successfully!'
    );
  };

  return (
    <main
      className="
        relative min-h-screen overflow-hidden
        bg-gradient-to-br
        from-slate-50 via-white
        to-cyan-50 px-4 py-6
        text-slate-900 transition-colors
        dark:from-[#070B14] dark:via-[#0B1120]
        dark:to-[#070B14] dark:text-white
        sm:px-6 lg:px-8
      "
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute left-[-10%] top-[-10%]
            h-[500px] w-[500px] rounded-full
            bg-cyan-500/10 blur-3xl
          "
        />

        <div
          className="
            absolute bottom-[-10%] right-[-10%]
            h-[500px] w-[500px]  rounded-full
            bg-purple-500/10 blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <div
          className="
            mb-8 rounded-[2rem]
            border border-slate-200/70
            bg-white/80 p-6
            shadow-xl shadow-slate-200/40
            backdrop-blur-xl dark:border-white/10
            dark:bg-white/[0.04] dark:shadow-none
          "
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="text-cyan-500 dark:text-cyan-400" />

                <p
                  className="
                    text-sm uppercase tracking-[0.25em]
                    text-cyan-600 dark:text-cyan-300
                  "
                >
                  Candidate Profile
                </p>
              </div>

              <h1
                className="
                  mt-4 text-3xl font-black text-slate-900
                  dark:text-white sm:text-5xl
                "
              >
                Build Your Professional Identity
              </h1>

              <p
                className="
                  mt-3 max-w-2xl text-slate-600
                  dark:text-white/60
                "
              >
                Complete your profile to improve
                job matches and recruiter
                visibility.
              </p>
            </div>

            <div
              className="
                w-full max-w-md rounded-[2rem]
                border border-cyan-300/40 bg-cyan-500/10
                p-5 dark:border-cyan-400/20
              "
            >
              <div className="flex items-center justify-between">
                <p
                  className="
                    text-sm uppercase tracking-wider
                    text-cyan-700 dark:text-cyan-200
                  "
                >
                  Profile Completion
                </p>

                <p
                  className="
                    text-2xl font-black text-cyan-700
                    dark:text-cyan-300
                  "
                >
                  {completion}%
                </p>
              </div>

              <div
                className="
                  mt-4 h-3 overflow-hidden rounded-full
                  bg-slate-200 dark:bg-black/30
                "
              >
                <div
                  style={{
                    width: `${completion}%`,
                  }}
                  className="
                    h-full rounded-full bg-cyan-500
                    transition-all duration-500
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="grid gap-6 xl:grid-cols-[1fr_380px]"
        >
          {/* LEFT */}
          <div className="space-y-6">
            {/* PERSONAL */}
            <section
              className="
                rounded-[2rem]
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/[0.04] p-6
                backdrop-blur-xl
                shadow-sm dark:shadow-none
              "
            >
              <h2
                className="
                  text-2xl font-bold
                  text-zinc-900
                  dark:text-white
                "
              >
                Personal Information
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Full Name"
                  register={register(
                    'personal.name'
                  )}
                />

                <Input
                  placeholder="Email"
                  register={register(
                    'personal.email'
                  )}
                />

                <Input
                  placeholder="Phone"
                  register={register(
                    'personal.phone'
                  )}
                />

                <Input
                  placeholder="Location"
                  register={register(
                    'personal.location'
                  )}
                />

                <Input
                  placeholder="LinkedIn"
                  register={register(
                    'personal.linkedin'
                  )}
                />

                <Input
                  placeholder="Portfolio"
                  register={register(
                    'personal.portfolio'
                  )}
                />

                <Input
                  placeholder="GitHub"
                  register={register(
                    'personal.github'
                  )}
                />
              </div>
            </section>

            {/* PROFESSIONAL */}
            <section
              className="
                rounded-[2rem]
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/[0.04] p-6
                backdrop-blur-xl
                shadow-sm dark:shadow-none
              "
            >
              <h2
                className="
                  text-2xl font-bold
                  text-zinc-900
                  dark:text-white
                "
              >
                Professional Details
              </h2>

              <div className="mt-6 space-y-5">
                <Input
                  placeholder="Professional Title"
                  register={register(
                    'professionalTitle'
                  )}
                />

                <div>
                  <textarea
                    maxLength={500}
                    placeholder="Professional bio..."
                    {...register('bio')}
                    className="
                      min-h-[180px] w-full rounded-[1.5rem]
                      border border-slate-200 bg-slate-50
                      p-4 text-slate-900 outline-none resize-none
                      transition placeholder:text-slate-400
                      focus:border-cyan-400
                      dark:border-white/10 dark:bg-black/20
                      dark:text-white
                      dark:placeholder:text-white/40
                    "
                  />

                  <div
                    className="
                      mt-2 text-right text-sm text-slate-500
                      dark:text-white/40
                    "
                  >
                    {bio?.length || 0}/500
                  </div>
                </div>

                <Controller
                  name="experienceLevel"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value}
                      onValueChange={(
                        value
                      ) =>
                        field.onChange(
                          value
                        )
                      }
                      placeholder="Select experience level"
                      options={[
                        {
                          label: 'Junior',
                          value: 'Junior',
                        },
                        {
                          label: 'Mid',
                          value: 'Mid',
                        },
                        {
                          label: 'Senior',
                          value: 'Senior',
                        },
                        {
                          label: 'Lead',
                          value: 'Lead',
                        },
                      ]}
                    />
                  )}
                />

                {errors.experienceLevel && (
                  <p className="text-sm text-red-500">
                    Experience level is
                    required
                  </p>
                )}
              </div>
            </section>

            {/* SKILLS */}
            <section
              className="
                mt-8 rounded-[2rem]
                border border-zinc-200
                bg-white/90 p-6 shadow-sm
                backdrop-blur-xl dark:border-white/10
                dark:bg-white/[0.04]
              "
            >
              <h2
                className="
                  text-2xl font-bold
                  text-zinc-900
                  dark:text-white
                "
              >
                Skills
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {allSkills.map(
                  (skill) => {
                    const active =
                      skills.includes(
                        skill
                      );

                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          setSkills(
                            active
                              ? skills.filter(
                                  (
                                    s
                                  ) =>
                                    s !==
                                    skill
                                )
                              : [
                                  ...skills,
                                  skill,
                                ]
                          );
                        }}
                        className={`
                          rounded-full px-4 py-2 text-sm font-medium
                          transition-all
                          ${
                            active
                              ? 'bg-cyan-500 text-white'
                              : `
                                border border-slate-200
                                bg-slate-100
                                text-slate-700
                                hover:border-cyan-300
                                hover:bg-cyan-50
                                dark:border-white/10
                                dark:bg-white/[0.03]
                                dark:text-white/70
                              `
                          }
                        `}
                      >
                        {skill}
                      </button>
                    );
                  }
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* AVATAR */}
            <section
              className="
                rounded-[2rem]
                border border-zinc-200 bg-white/90 p-6
                shadow-sm backdrop-blur-xl
                dark:border-white/10 dark:bg-white/[0.04]
              "
            >
              <h2
                className="
                  text-2xl font-bold
                  text-zinc-900
                  dark:text-white
                "
              >
                Profile Photo
              </h2>

              <div
                {...getRootProps()}
                className="
                  mt-6 flex cursor-pointer
                  flex-col items-center justify-center
                  rounded-[2rem]
                  border border-dashed border-cyan-400/30
                  bg-slate-50 p-8 text-center
                  transition
                  hover:bg-cyan-50
                  dark:bg-black/20
                "
              >
                <input {...getInputProps()} />

                {avatar ? (
                  <Image
                    src={avatar}
                    alt=""
                    height={200}
                    width={200}
                    placeholder="blur"
                    blurDataURL="/placeholders/company-blur.jpg"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <>
                    <Camera
                      size={40}
                      className="text-cyan-500 dark:text-cyan-300"
                    />

                    <p className="mt-4 text-slate-600 dark:text-white/70">
                      Upload avatar
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* LOOKING FOR */}
            <section
              className="
                rounded-[2rem]
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/[0.04] p-6
                backdrop-blur-xl
                shadow-sm dark:shadow-none
              "
            >
              <h2 
                className="
                  text-2xl font-bold
                  text-zinc-900
                  dark:text-white
                "
              >
                Looking For
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  {
                    key: 'remote',
                    label: 'Remote',
                  },
                  {
                    key: 'fullTime',
                    label: 'Full-Time',
                  },
                  {
                    key: 'contract',
                    label: 'Contract',
                  },
                  {
                    key: 'internship',
                    label: 'Internship',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="
                      rounded-2xl
                      border border-slate-200
                      bg-slate-50 p-4
                      transition-all duration-300
                      hover:border-cyan-300
                      hover:bg-cyan-50
                      dark:border-white/10
                      dark:bg-black/30
                      dark:hover:border-cyan-400/20
                      dark:hover:bg-cyan-500/[0.03]
                    "
                  >
                    <Checkbox
                      label={item.label}
                      checked={watch(
                        `lookingFor.${item.key}` as
                          | 'lookingFor.remote'
                          | 'lookingFor.fullTime'
                          | 'lookingFor.contract'
                          | 'lookingFor.internship'
                      )}
                      onCheckedChange={(
                        checked
                      ) =>
                        setValue(
                          `lookingFor.${item.key}` as
                            | 'lookingFor.remote'
                            | 'lookingFor.fullTime'
                            | 'lookingFor.contract'
                            | 'lookingFor.internship',
                          checked
                        )
                      }
                    />
                  </div>
                ))}

                <Input
                  type="number"
                  placeholder="Minimum Salary"
                  register={register(
                    'lookingFor.salaryMin',
                    {
                      valueAsNumber: true,
                    }
                  )}
                />

                <Input
                  type="number"
                  placeholder="Maximum Salary"
                  register={register(
                    'lookingFor.salaryMax',
                    {
                      valueAsNumber: true,
                    }
                  )}
                />
              </div>
            </section>

            {/* AUTHORIZATION */}
            <section
              className="
                rounded-[2rem]
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/[0.04] p-6
                backdrop-blur-xl
                shadow-sm dark:shadow-none
              "
            >
              <h2 
                className="
                  text-2xl font-semibold text-zinc-900 dark:text-white
                "
              >
                Work Authorization
              </h2>

              <div className="mt-6">
                <Controller
                  control={control}
                  name="workAuthorization"
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value}
                      onValueChange={
                        field.onChange
                      }
                      options={[
                        {
                          label:
                            'Authorized to work',
                          value:
                            'Authorized to work',
                        },
                        {
                          label:
                            'Requires sponsorship',
                          value:
                            'Requires sponsorship',
                        },
                        {
                          label:
                            'Open to relocation',
                          value:
                            'Open to relocation',
                        },
                      ]}
                    />
                  )}
                />
              </div>
            </section>

            <button
              type="submit"
              className="
                flex w-full items-center justify-center gap-3
                rounded-[1.4rem] px-5 py-4
                font-semibold text-white bg-cyan-600
                shadow-[0_10px_25px_rgba(6,182,212,0.18)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-cyan-700
                hover:shadow-[0_14px_30px_rgba(6,182,212,0.22)]
                active:scale-[0.98]
                dark:bg-cyan-500 dark:text-black
                dark:shadow-[0_0_25px_rgba(6,182,212,0.32)]
                dark:hover:bg-cyan-400
                dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]
                focus:outline-none focus:ring-2
                focus:ring-cyan-400/40
                focus:ring-offset-2
                dark:focus:ring-offset-[#0A0A0F]
              "
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {showCropper && imageSrc && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/80 p-6
          "
        >
          <div
            className="
              w-full max-w-2xl
              rounded-[2rem] border border-slate-200
              bg-white p-6
              dark:border-white/10 dark:bg-[#0B1120]
            "
          >
            <div
              className="
                relative h-[400px] w-full
                overflow-hidden rounded-2xl
              "
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={
                  onCropComplete
                }
              />
            </div>

            <div className="mt-6">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) =>
                  setZoom(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowCropper(false)
                }
                className="
                  rounded-2xl border border-slate-200
                  px-5 py-3 text-slate-700
                  dark:border-white/10 dark:text-white
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveCroppedImage}
                className="
                  rounded-2xl bg-cyan-500
                  px-5 py-3 font-bold text-white
                "
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;

type InputProps = {
  placeholder: string;
  register: UseFormRegisterReturn;
  type?: string;
};

function Input({
  placeholder,
  register,
  type = 'text',
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...register}
      className="
        w-full rounded-[1.5rem] border border-slate-200
        bg-slate-50 p-4 text-slate-900
        outline-none transition
        placeholder:text-slate-400 focus:border-cyan-400
        dark:border-white/10
        dark:bg-black/20 dark:text-white
        dark:placeholder:text-white/40
      "
    />
  );
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  const image = new window.Image();

  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas =
    document.createElement('canvas');

  const ctx =
    canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
}