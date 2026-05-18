'use client';

import { useForm } from 'react-hook-form';
import { Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';

import {
  ResumeCertification,
  useResumeStore,
} from '@/lib/store';

type Props = {
  certifications: ResumeCertification[];
};

const CertificationsEditor = ({
  certifications,
}: Props) => {
  const resume = useResumeStore(
    (state) => state.resume
  );

  const saveResume = useResumeStore(
    (state) => state.saveResume
  );

  const { watch, setValue } = useForm({
    defaultValues: {
      certifications,
    },
  });

  const values = watch('certifications');

  const updateCertifications = (
    updated: ResumeCertification[]
  ) => {
    setValue('certifications', updated);

    saveResume({
      ...resume,
      certifications: updated,
    });
  };

  const addCertification = () => {
    updateCertifications([
      ...values,
      {
        id: crypto.randomUUID(),
        name: '',
        issuer: '',
        date: '',
      },
    ]);
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Certifications
        </h2>

        <button
          type="button"
          onClick={addCertification}
          className="rounded-xl bg-cyan-400 p-2 text-black"
        >
          <Plus size={18} />
        </button>
      </div>

      <Reorder.Group
        axis="y"
        values={values}
        onReorder={updateCertifications}
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
                  Certification {index + 1}
                </p>
              </div>

              <button
                onClick={() =>
                  updateCertifications(
                    values.filter(
                      (cert) =>
                        cert.id !== item.id
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
                placeholder="Certification Name"
                value={item.name}
                onChange={(value) => {
                  const updated = [
                    ...values,
                  ];

                  updated[index].name =
                    value;

                  updateCertifications(
                    updated
                  );
                }}
              />

              <Input
                placeholder="Issuer"
                value={item.issuer}
                onChange={(value) => {
                  const updated = [
                    ...values,
                  ];

                  updated[index].issuer =
                    value;

                  updateCertifications(
                    updated
                  );
                }}
              />

              <Input
                placeholder="Date"
                value={item.date}
                onChange={(value) => {
                  const updated = [
                    ...values,
                  ];

                  updated[index].date =
                    value;

                  updateCertifications(
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

export default CertificationsEditor;

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

