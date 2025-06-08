'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './_components/ThemeToggle';

export default function NotFound() {
  // Set page title
  useEffect(() => {
    document.title = "Page Not Found | Kaira";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))] flex items-center justify-center p-4">
      <ThemeToggle />
      
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[rgb(var(--foreground-rgb))] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-[rgb(var(--foreground-rgb))] mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Terminal
          </Link>
          
          <div className="text-center">
            <Link 
              href="/blog" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Or visit the Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
