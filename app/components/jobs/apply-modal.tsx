"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function ApplyModal({ jobTitle }: { jobTitle: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="w-full rounded-2xl py-4 bg-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.35)]">
          Apply Now
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[#0A0A0F] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold text-white">
              Apply for {jobTitle}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button className="p-2 rounded-full bg-white/5">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Submit your application details for this role.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}