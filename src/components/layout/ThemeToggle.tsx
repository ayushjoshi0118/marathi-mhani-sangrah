'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial state from html element or localStorage
    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('marathi_theme') === 'dark';

    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    const handleThemeChange = () => {
      const currentDark = document.documentElement.classList.contains('dark');
      setTheme(currentDark ? 'dark' : 'light');
    };

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('marathi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('marathi_theme', 'light');
    }

    window.dispatchEvent(new Event('theme-changed'));
  };

  if (!mounted) {
    // Return placeholder with same dimensions to prevent layout shift
    return (
      <div className={`p-2 rounded-xl text-ink-600 ${className}`} aria-hidden="true">
        <Moon className="w-5 h-5 opacity-40" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'दिवस मोड सुरू करा (Switch to light mode)' : 'रात्र मोड सुरू करा (Switch to dark background)'}
      title={isDark ? 'दिवस मोड (Light Mode)' : 'रात्र मोड (Dark Background)'}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
        isDark
          ? 'bg-ink-800 text-amber-300 hover:bg-ink-700 hover:text-amber-200 border border-ink-700'
          : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200 hover:text-saffron-600 border border-ivory-300'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-amber-300" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-ink-700" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold font-mukta">
          {isDark ? 'दिवस मोड' : 'रात्र मोड'}
        </span>
      )}
    </button>
  );
}
