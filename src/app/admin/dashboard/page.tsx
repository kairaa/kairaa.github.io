'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../_contexts/AuthContext';
import ThemeToggle from '../../_components/ThemeToggle';
import Link from 'next/link';
import { LogOut, Plus, FileText, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))]">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your blog posts and content
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/blog" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                View Blog
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))] mb-2">
                    Total Posts
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">4</p>
                </div>
                <FileText className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))] mb-2">
                    Published
                  </h3>
                  <p className="text-3xl font-bold text-green-600">4</p>
                </div>
                <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))] mb-2">
                    Drafts
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600">0</p>
                </div>
                <FileText className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/posts/new">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Plus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-2">
                    Create New Post
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Write and publish a new blog post
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/admin/posts">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-2">
                    Manage Posts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Edit, delete, or update existing posts
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Posts */}
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-[rgb(var(--foreground-rgb))]">
                  Recent Posts
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-[rgb(var(--foreground-rgb))]">
                        Getting Started with Next.js 13
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Published on Jan 15, 2024
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                      Published
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-[rgb(var(--foreground-rgb))]">
                        TypeScript Best Practices in 2024
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Published on Jan 20, 2024
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                      Published
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
