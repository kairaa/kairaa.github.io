'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return <BlogPostClient slug={slug} />;
}
