'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
      className="
        flex items-center justify-center
        h-10 w-10 rounded-xl
        border border-black/10 dark:border-white/10
        bg-white dark:bg-zinc-900
        text-black dark:text-white
        transition
      "
    >
      {theme === 'dark' ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}