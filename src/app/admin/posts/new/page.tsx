'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../_contexts/AuthContext';
import ThemeToggle from '../../../_components/ThemeToggle';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { createBlogPost, uploadImageToImgur } from '../../../_lib/blogApi';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface PostFormData {
  title: string;
  summary: string;
  content: string;
  image: string;
  tags: string;
  isPublished: boolean;
}

export default function NewPostPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    summary: '',
    content: '',
    image: '',
    tags: '',
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Set page title
  useEffect(() => {
    document.title = "Create New Post | Kaira Admin";
  }, []);

  const handleInputChange = (field: keyof PostFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setImageUploading(true);
    setError('');

    try {
      const imageUrl = await uploadImageToImgur(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      setSaving(false);
      return;
    }

    if (!formData.summary.trim()) {
      setError('Summary is required');
      setSaving(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      setSaving(false);
      return;
    }

    if (!formData.image.trim()) {
      setError('Featured image is required');
      setSaving(false);
      return;
    }

    try {
      const postData = {
        title: formData.title,
        slug: formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim(),
        summary: formData.summary,
        content: formData.content,
        image: formData.image,
        authorId: 1, // Default author ID - could be dynamic based on auth
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPublished: formData.isPublished,
      };
      
      await createBlogPost(postData);
      router.push('/admin/posts');
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image', 'align'
  ];

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">
                Create New Post
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Write and publish a new blog post
              </p>
            </div>
            
            <Link 
              href="/admin/dashboard" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))]"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Summary *
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))]"
                  placeholder="Brief summary of the post"
                  rows={3}
                  required
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Featured Image *
                </label>
                
                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                      disabled={imageUploading || saving}
                    />
                    {imageUploading && (
                      <div className="text-blue-600 text-sm">
                        Uploading...
                      </div>
                    )}
                  </div>

                  {/* Image URL Input (for manual entry or editing) */}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))]"
                    placeholder="https://example.com/image.jpg"
                    required
                  />

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                      <div className="relative w-full h-48 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <Image
                          src={formData.image}
                          alt="Featured image preview"
                          fill
                          className="object-cover"
                          onError={() => setError('Invalid image URL')}
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Upload an image file (max 5MB) or enter an image URL manually
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-[rgb(var(--foreground-rgb))]"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--foreground-rgb))] mb-2">
                  Content *
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => handleInputChange('content', content)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog post content here..."
                    style={{ 
                      backgroundColor: 'var(--quill-bg, white)',
                      color: 'var(--quill-color, black)'
                    }}
                  />
                </div>
              </div>

              {/* Published Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-[rgb(var(--foreground-rgb))]">
                  Publish immediately
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link
                  href="/admin/dashboard"
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving || imageUploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : imageUploading ? 'Uploading Image...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
