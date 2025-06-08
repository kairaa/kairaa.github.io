import { MetadataRoute } from 'next'
import { getBlogPosts } from './_lib/blogApi'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kaira.me'
  
  // Get all blog posts for dynamic URLs
  const posts = await getBlogPosts()
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]
  
  // Dynamic blog post pages
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [...staticPages, ...blogPages]
}
