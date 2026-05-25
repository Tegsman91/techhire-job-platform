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
        flex items-center justify-center
        h-10 w-10 rounded-xl
        border border-white/10
        bg-white/5
        text-white
        backdrop-blur-xl
        transition hover:bg-white/10
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