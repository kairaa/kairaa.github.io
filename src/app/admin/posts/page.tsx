'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../_contexts/AuthContext';
import ThemeToggle from '../../_components/ThemeToggle';
import Link from 'next/link';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { getAdminBlogPosts, deleteBlogPost } from '../../_lib/blogApi';
import type { BlogPost } from '../../_types/blog';

export default function ManagePostsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = "Manage Posts | Kaira Admin";
  }, []);

  const handleDeletePost = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    try {
      await deleteBlogPost(post.id);
      setPosts(posts.filter(p => p.id !== post.id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await getAdminBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

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
                Manage Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Edit, delete, or update your blog posts
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/posts/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Link>
              <Link 
                href="/admin/dashboard" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            {loadingPosts ? (
              <div className="p-8 text-center">
                <div className="animate-pulse text-gray-600">Loading posts...</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))] mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first blog post to get started.
                </p>
                <Link 
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create First Post
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-[rgb(var(--foreground-rgb))]">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              /{post.slug}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.isPublished 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Post"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/posts/${post.id}`}
                              className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                              title="Edit Post"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete Post"
                              onClick={() => handleDeletePost(post)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
