'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../_contexts/AuthContext';
import ThemeToggle from '../../../_components/ThemeToggle';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { getAdminBlogPost, updateBlogPost } from '../../../_lib/blogApi';
import type { BlogPost } from '../../../_types/blog';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface PostFormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  tags: string;
  isPublished: boolean;
}

export default function EditPostPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    imageUrl: '',
    tags: '',
    isPublished: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || !isAuthenticated) return;

      try {
        setLoadingPost(true);
        const blogPost = await getAdminBlogPost(postId);
        if (blogPost) {
          setPost(blogPost);
          setFormData({
            title: blogPost.title,
            slug: blogPost.slug,
            summary: blogPost.summary,
            content: blogPost.content,
            imageUrl: blogPost.image || '',
            tags: blogPost.tags?.join(', ') || '',
            isPublished: blogPost.isPublished,
          });
        } else {
          router.push('/admin/posts');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/admin/posts');
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [postId, isAuthenticated, router]);

  // Set dynamic page title based on post
  useEffect(() => {
    if (post) {
      document.title = `Edit: ${post.title} | Kaira Admin`;
    } else if (loadingPost) {
      document.title = "Loading Post... | Kaira Admin";
    } else {
      document.title = "Edit Post | Kaira Admin";
    }
  }, [post, loadingPost]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setIsSubmitting(true);

    try {
      const updates: Partial<BlogPost> = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        content: formData.content,
        image: formData.imageUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPublished: formData.isPublished,
      };

      await updateBlogPost(post.id, updates);
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || loadingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-600">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !post) {
    return null;
  }

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'script', 'color', 'background',
    'align', 'link', 'image', 'code-block'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))]">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">
                Edit Post
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Update your blog post content and settings
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/posts" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Posts
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  URL path: /blog/{formData.slug}
                </p>
              </div>

              {/* Summary */}
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Summary *
                </label>
                <textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the post..."
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="react, nextjs, programming (comma separated)"
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Content *
                </label>
                <div className="bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    modules={modules}
                    formats={formats}
                    className="prose-editor dark:prose-editor-dark"
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </div>

              {/* Publishing Options */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-[rgb(var(--foreground-rgb))]">
                  Publish this post (make it visible to readers)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Updating...' : 'Update Post'}
                </button>
                
                <Link
                  href="/admin/posts"
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
