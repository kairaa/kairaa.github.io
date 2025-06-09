import React from 'react';
import { getBlogPosts } from '../_lib/blogApi';
import type { BlogPost } from '../_types/blog';
import BlogPageClient from './BlogPageClient';

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Blog | Kaira',
    description: 'Thoughts, stories and ideas from Kaira',
    openGraph: {
      title: 'Blog | Kaira',
      description: 'Thoughts, stories and ideas from Kaira',
    },
  };
}

export default async function BlogPage() {
  let initialPosts: BlogPost[] = [];
  
  try {
    // Fetch initial posts on server-side for SSG
    initialPosts = await getBlogPosts(1, 10);
  } catch (error) {
    console.error('Error fetching initial blog posts:', error);
    // If API fails during build, use empty array - client will fallback to dummy data
    initialPosts = [];
  }

  // Pass initial posts to client component for pagination
  return <BlogPageClient initialPosts={initialPosts} />;
}
