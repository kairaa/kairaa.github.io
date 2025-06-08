'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../_contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 z-50"
        aria-label="Loading theme toggle"
      >
        <Sun className="w-5 h-5 text-gray-700" />
      </button>
    );
  }

  return <ThemeToggleClient />;
}

function ThemeToggleClient() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 z-50"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}
