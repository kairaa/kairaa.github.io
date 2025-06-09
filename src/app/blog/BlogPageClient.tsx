'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '../_lib/blogApi';
import type { BlogPost } from '../_types/blog';

interface BlogPageClientProps {
  initialPosts: BlogPost[];
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length === 10);
  const pageSize = 10;

  // Set page title
  useEffect(() => {
    document.title = "Blog | Kaira";
  }, []);

  // Only fetch more posts if we don't have initial data
  useEffect(() => {
    if (initialPosts.length === 0) {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          const blogPosts = await getBlogPosts(1, pageSize);
          setPosts(blogPosts);
          setHasMore(blogPosts.length === pageSize);
        } catch (error) {
          console.error('Error fetching blog posts:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [initialPosts.length, pageSize]);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const morePosts = await getBlogPosts(nextPage, pageSize);
      setPosts(prev => [...prev, ...morePosts]);
      setPage(nextPage);
      setHasMore(morePosts.length === pageSize);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading blog posts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Thoughts, stories and ideas
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Post Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.summary}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && posts.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Load More Posts
              </button>
            </div>
          )}

          {/* Empty State */}
          {posts.length === 0 && !loading && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
