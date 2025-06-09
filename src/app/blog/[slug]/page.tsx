import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPost, getBlogPosts } from '../../_lib/blogApi';
import type { BlogPostDetail } from '../../_types/blog';
import { notFound } from 'next/navigation';

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array to prevent build failure
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPost(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found | Kaira',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    return {
      title: `${post.title} | Kaira`,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        images: [post.image],
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found | Kaira',
      description: 'The blog post you are looking for does not exist.',
    };
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: BlogPostDetail | null = null;
  
  try {
    post = await getBlogPost(params.slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

          {/* Article Header */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Featured Image */}
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content */}
            <div className="p-8">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <span>By Author #{post.authorId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div className="text-lg text-gray-700 dark:text-gray-300 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                {post.summary}
              </div>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
