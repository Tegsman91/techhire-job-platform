'use client';

import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

export const showLoadingToast = (message: string) => {
  return toast.custom(
    (t) => (
      <div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl 
          bg-[#0A0A0F]/90 backdrop-blur-md border border-[#06B6D4]
          shadow-[0_0_15px_#06B6D433]
          animate-slideInBounce
        `}
        style={{
          opacity: t.visible ? 1 : 0,
          transform: t.visible ? "translateX(0)" : "translateX(100%)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Spinner */}
        <Loader2 className="animate-spin text-[#06B6D4]" />

        {/* Message */}
        <span className="text-sm text-white/40">{message}</span>

        {/* Close button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-auto text-white/60 hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Corner brackets */}
        <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-white/20 pointer-events-none" />
        <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-white/20 pointer-events-none" />
      </div>
    ),
    {
      duration: Infinity, // stays until manually dismissed
    }
  );
};