'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
    >
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="block dark:hidden" />
    </button>
  );
}