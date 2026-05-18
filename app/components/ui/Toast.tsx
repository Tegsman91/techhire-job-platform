'use client';

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import toast from "react-hot-toast";

type ToastType = "success" | "error" | "info" | "warning";

const styles = {
  success: "border-[#10B981] shadow-[0_0_15px_#10B98133]",
  error: "border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)]",
  info: "border-[#06B6D4] shadow-[0_0_15px_#06B6D433]",
  warning: "border-[#F97316] shadow-[0_0_15px_#F9731633]",
};

const icons = {
  success: <CheckCircle className="text-[#10B981]" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-[#06B6D4]" />,
  warning: <AlertTriangle className="text-[#F97316]" />,
};

const ShowToast = (message: string, type: ToastType = "info") => {
  toast.custom(
    (t) => (
      <div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl 
          bg-[#0A0A0F]/90 backdrop-blur-md border 
          ${styles[type]}
          animate-slideInBounce
          pointer-events-auto
        `}
        style={{
          opacity: t.visible ? 1 : 0,
          transform: t.visible
            ? "translateX(0)"
            : "translateX(100%)",
          transition: "all 0.3s ease",
        }}
      >
        {icons[type]}

        <span className="text-sm text-white">{message}</span>

        <button
          onClick={() => toast.dismiss(t.id)}
          aria-label="Dismiss notification"
          className="ml-auto text-white/60 hover:text-white pointer-events-auto z-10 relative"
        >
          <X size={16} />
        </button>

        <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-white/20 pointer-events-none" />
        <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-white/20 pointer-events-none" />
      </div>
    ),
    { duration: 4000 }
  );
}

export default ShowToast
