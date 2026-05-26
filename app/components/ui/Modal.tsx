'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import { ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  size?: Size;
}

const sizeStyles: Record<Size, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[600px]",
  lg: "max-w-[900px]",
  xl: "max-w-[1200px]",
  full: "w-full h-full !translate-x-0 !translate-y-0 !top-0 !left-0",
};

const Modal = ({
  open,
  onOpenChange,
  children,
  size = "md",
}: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && (
            <>
              {/* OVERLAY */}
              <Dialog.Overlay asChild>
                <motion.div
                  className="
                    fixed inset-0 z-50
                    bg-black/70 dark:bg-black/85
                    backdrop-blur-sm
                  "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              {/* MODAL */}
              <Dialog.Content asChild>
                <motion.div
                  className={clsx(
                    "fixed z-50 max-h-[95vh]",
                    size === "full"
                      ? "inset-0 w-full h-full"
                      : "top-1/2 left-1/2 w-[95%] sm:w-auto -translate-x-1/2 -translate-y-1/2",
                    sizeStyles[size]
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* OUTER GLOW */}
                  <div
                    className="
                      absolute inset-0 rounded-none sm:rounded-2xl
                      bg-[linear-gradient(120deg,#06B6D4,#A855F7,#EC4899)]
                      opacity-70 dark:opacity-80
                    "
                  />

                  {/* CONTENT */}
                  <div
                    className="
                      relative rounded-none sm:rounded-2xl
                      max-h-[90vh] overflow-y-auto
                      p-4 sm:p-6 no-scrollbar
                      backdrop-blur-md
                      bg-white dark:bg-[#0A0A0F]
                      border border-zinc-200
                      dark:border-white/10
                      text-zinc-900 dark:text-white
                      shadow-xl dark:shadow-none
                    "
                  >
                    {/* LIGHT MODE HEADER GLOW */}
                    <div
                      className="
                        absolute inset-0 rounded-none sm:rounded-2xl
                        bg-gradient-to-br
                        from-cyan-500/5
                        via-purple-500/5
                        to-transparent
                        dark:from-cyan-500/10
                        dark:via-purple-500/5
                        pointer-events-none
                      "
                    />

                    {/* CLOSE BUTTON */}
                    <Dialog.Close asChild>
                      <button
                        className="
                          absolute top-4 right-4 z-20
                          rounded-lg p-1.5
                          transition-all duration-200
                          text-zinc-500
                          hover:text-zinc-900
                          hover:bg-zinc-300
                          dark:text-white/60
                          dark:hover:text-white
                          dark:hover:bg-white/10
                          dark:hover:shadow-[0_0_10px_#06B6D4]
                        "
                        aria-label="Close modal"
                      >
                        <X size={18} />
                      </button>
                    </Dialog.Close>

                    <div className="relative z-10">
                      {children}
                    </div>
                  </div>

                  {/* DECORATIVE CORNERS */}
                  <motion.span
                    className="
                      absolute top-2 left-3
                      w-4 h-4
                      border-t border-l
                      border-zinc-300 dark:border-white/20
                      pointer-events-none
                    "
                    initial={{ opacity: 0, scale: 0.5, x: -5, y: -5 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />

                  <motion.span
                    className="
                      absolute bottom-2 right-3
                      w-4 h-4
                      border-b border-r
                      border-zinc-300 dark:border-white/20
                      pointer-events-none
                    "
                    initial={{ opacity: 0, scale: 0.5, x: 5, y: 5 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;

export function ModalHeader({ children }: { children: ReactNode }) {
  return (
    <>
      <Dialog.Title
        className="
          mb-4 text-xl font-semibold
          text-zinc-900 dark:text-white
        "
      >
        {children}
      </Dialog.Title>

      <Dialog.Description className="sr-only">
        Dialog description for screen readers
      </Dialog.Description>
    </>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm text-zinc-600 dark:text-zinc-400">
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      {children}
    </div>
  );
}