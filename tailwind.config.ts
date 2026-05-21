import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: "#06B6D4",
        secondary: "#A855F7",
        accent: "#EC4899",
        success: "#10B981",
        warning: "#F97316",
        background: "#0A0A0F",
        surface: "#18181B",
        text: "#FFFFFF",
        muted: "#E4E4E7",
      },
      boxShadow: {
        neon: "0 0 10px #06B6D4, 0 0 20px #06B6D4",
        "neon-pink": "0 0 10px #EC4899",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        slideInBounce: {
          "0%": {
            transform: "translateX(120%) scale(0.95)",
            opacity: "0",
          },
          "60%": {
            transform: "translateX(-10%) scale(1.02)",
            opacity: "1",
          },
          "80%": {
            transform: "translateX(5%) scale(0.98)",
          },
          "100%": {
            transform: "translateX(0) scale(1)",
          },
        },
      },
      animation: {
        scan: "scan 2s linear infinite",
        slideInBounce: "slideInBounce 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;