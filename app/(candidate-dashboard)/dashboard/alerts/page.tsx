'use client';

import { Bell, Trash2, Pencil, Briefcase, } from 'lucide-react';
import { Controller, useForm, } from 'react-hook-form';
import { useState, } from 'react';
import { JobAlert, useJobAlertsStore, } from '@/lib/store';

type FormValues = {
  keywords: string;
  location: string;
  jobTypes: string[];
  salaryRange: number;
  frequency: 'Daily' | 'Weekly';
};

const jobTypeOptions = [
  'Remote',
  'Hybrid',
  'On-Site',
  'Full-Time',
  'Part-Time',
  'Contract',
];

const AlertPage = () => {
  const {
    alerts,
    addAlert,
    updateAlert,
    deleteAlert,
    emailNotifications,
    pushNotifications,
    toggleEmailNotifications,
    togglePushNotifications,
  } = useJobAlertsStore();

  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      keywords: '',
      location: '',
      jobTypes: [],
      salaryRange: 1500000,
      frequency: 'Daily',
    },
  });

  const salaryValue = watch('salaryRange');

  const onSubmit = (
    data: FormValues
  ) => {
    if (editingId) {
      updateAlert(editingId, data);

      setEditingId(null);
    } else {
      addAlert({
        id: crypto.randomUUID(),

        ...data,

        createdAt:
          new Date().toISOString(),
      });
    }

    reset({
      keywords: '',
      location: '',
      jobTypes: [],
      salaryRange: 1500000,
      frequency: 'Daily',
    });
  };

  const handleEdit = (
    alert: JobAlert
  ) => {
    setEditingId(alert.id);

    reset({
      keywords: alert.keywords,
      location: alert.location,
      jobTypes: alert.jobTypes,
      salaryRange:
        alert.salaryRange,
      frequency: alert.frequency,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#070B14] px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Bell className="text-cyan-400" />

                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                  Job Alerts
                </p>
              </div>

              <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Smart Job Notifications
              </h1>

              <p className="mt-4 max-w-2xl text-white/60">
                Create custom alerts and receive notifications when jobs match your preferences.
              </p>
            </div>

            <div className="w-full rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-6 text-center sm:w-fit sm:min-w-[180px]">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
                Active Alerts
              </p>

              <h2 className="mt-3 text-5xl font-black text-cyan-300">
                {alerts.length}
              </h2>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Briefcase className="text-cyan-400" />

            <h2 className="text-2xl font-bold">
              {editingId
                ? 'Edit Alert'
                : 'Create Alert'}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="mt-8 space-y-8"
          >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-medium text-white/70">
                  Job Title / Keywords
                </label>

                <input
                  {...register(
                    'keywords'
                  )}
                  placeholder="Frontend Engineer"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-white/70">
                  Location
                </label>

                <input
                  {...register(
                    'location'
                  )}
                  placeholder="Remote or Lagos"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 outline-none transition focus:border-cyan-400"
                />
              </div>
            </div>

            {/* JOB TYPES */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-white">
                Job Types
              </p>

              <div className="grid grid-cols-2 gap-3">
                {jobTypeOptions.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={type}
                      checked={watch('jobTypes').includes(type)}
                      onChange={(e) => {
                        const current =
                          watch('jobTypes');

                        if (e.target.checked) {
                          setValue('jobTypes', [
                            ...current,
                            type,
                          ]);
                        } else {
                          setValue(
                            'jobTypes',
                            current.filter(
                              (item) =>
                                item !== type
                            )
                          );
                        }
                      }}
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <span className="text-sm text-white">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* SALARY */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">
                  Salary Range
                </label>

                <span className="font-bold text-cyan-300">
                  ₦
                  {salaryValue.toLocaleString()}
                </span>
              </div>

              <Controller
                control={control}
                name="salaryRange"
                render={({
                  field,
                }) => (
                  <input
                    type="range"
                    min={100000}
                    max={5000000}
                    step={100000}
                    {...field}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-400/20"
                  />
                )}
              />
            </div>

            {/* FREQUENCY */}
            <div>
              <label className="mb-4 block text-sm font-medium text-white/70">
                Frequency
              </label>

              <div className="flex gap-4">
                {[
                  'Daily',
                  'Weekly',
                ].map((freq) => (
                  <label
                    key={freq}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
                  >
                    <input
                      type="radio"
                      value={freq}
                      {...register(
                        'frequency'
                      )}
                    />

                    {freq}
                  </label>
                ))}
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="grid gap-5 lg:grid-cols-2">
              <button
                type="button"
                onClick={
                  toggleEmailNotifications
                }
                className={`rounded-[1.5rem] border px-6 py-5 text-left transition-all duration-300 ${
                  emailNotifications
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-white/10 bg-white/[0.04]'
                }`}
              >
                <p className="font-bold">
                  Email Notifications
                </p>

                <p className="mt-2 text-sm text-white/60">
                  {emailNotifications
                    ? 'Enabled'
                    : 'Disabled'}
                </p>
              </button>

              <button
                type="button"
                onClick={
                  togglePushNotifications
                }
                className={`rounded-[1.5rem] border px-6 py-5 text-left transition-all duration-300 ${
                  pushNotifications
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-white/10 bg-white/[0.04]'
                }`}
              >
                <p className="font-bold">
                  Push Notifications
                </p>

                <p className="mt-2 text-sm text-white/60">
                  {pushNotifications
                    ? 'Enabled'
                    : 'Disabled'}
                </p>
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full rounded-[1.5rem] bg-cyan-400 px-6 py-5 font-black text-black transition-all duration-300 hover:scale-[1.01]"
            >
              {editingId
                ? 'Update Alert'
                : 'Save Alert'}
            </button>
          </form>
        </section>

        {/* ALERT LIST */}
        <section className="mt-8">
          <div className="grid gap-5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-2xl font-black">
                      {
                        alert.keywords
                      }
                    </h3>

                    <p className="mt-2 text-white/60">
                      {
                        alert.location
                      }
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {alert.jobTypes.map(
                        (type) => (
                          <span
                            key={type}
                            className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"
                          >
                            {type}
                          </span>
                        )
                      )}
                    </div>

                    <p className="mt-5 text-sm text-white/50">
                      Frequency:{' '}
                      {
                        alert.frequency
                      }
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleEdit(
                          alert
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 transition hover:border-cyan-400/40"
                    >
                      <Pencil size={18} />

                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteAlert(
                          alert.id
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-300 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={18} />

                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {alerts.length === 0 && (
            <div className="mt-8 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
              <h3 className="text-2xl font-black">
                No alerts created yet
              </h3>

              <p className="mt-3 text-white/60">
                Create your first alert to start receiving matching opportunities.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AlertPage