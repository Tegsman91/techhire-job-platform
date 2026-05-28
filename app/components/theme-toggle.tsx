'use client';

import dynamic from 'next/dynamic';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

function ThemeToggleInner() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(
          resolvedTheme === 'dark'
            ? 'light'
            : 'dark'
        )
      }
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl border border-black/10
        bg-white text-slate-700
        shadow-sm backdrop-blur-xl
        transition-all duration-300
        hover:bg-slate-100
        dark:border-white/10
        dark:bg-white/5
        dark:text-white
        dark:hover:bg-white/10
      "
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}

const ThemeToggle = dynamic(
  async () => ThemeToggleInner,
  {
    ssr: false,
  }
);

export default ThemeToggle;