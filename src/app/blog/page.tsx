import React from 'react';
import BlogPageClient from './BlogPageClient';
import type { Metadata } from 'next';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Blog | Kaira',
  description: 'Thoughts, stories and ideas from Kaira',
  openGraph: {
    title: 'Blog | Kaira',
    description: 'Thoughts, stories and ideas from Kaira',
  },
};

export default function BlogPage() {
  // No server-side data fetching - let client component handle everything
  return <BlogPageClient />;
}
