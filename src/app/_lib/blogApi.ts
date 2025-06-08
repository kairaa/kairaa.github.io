import axios from 'axios';
import type { BlogPost, BlogPostsResponse, ApiResponse } from '../_types/blog';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BLOG_API_URL || 'https://api.example.com/blog';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'; // Default to true

// Axios instance
const blogApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens if needed
blogApi.interceptors.request.use(
  (config) => {
    // Add auth token here when API is ready
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
blogApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Dummy data for development
const DUMMY_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 13',
    slug: 'getting-started-with-nextjs-13',
    summary: 'Learn how to build modern web applications with Next.js 13 and the new app directory structure.',
    content: `
      <h2>Introduction</h2>
      <p>Next.js 13 introduces a revolutionary new way of building React applications with the app directory structure. This new paradigm brings improved performance, better developer experience, and more intuitive routing.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li><strong>App Directory:</strong> A new file-system based router built on React Server Components</li>
        <li><strong>Layouts:</strong> Easily create shared UI between routes</li>
        <li><strong>Server Components:</strong> Render components on the server by default</li>
        <li><strong>Streaming:</strong> Progressively render UI from the server</li>
      </ul>

      <h2>Getting Started</h2>
      <p>To create a new Next.js 13 project with the app directory, run:</p>
      <pre><code>npx create-next-app@latest my-app --experimental-app</code></pre>

      <h2>Project Structure</h2>
      <p>The new app directory structure looks like this:</p>
      <pre><code>
app/
  layout.tsx          // Root layout
  page.tsx           // Home page
  loading.tsx        // Loading UI
  error.tsx          // Error UI
  not-found.tsx      // 404 UI
  about/
    page.tsx         // About page
  blog/
    page.tsx         // Blog listing
    [slug]/
      page.tsx       // Blog post
      </code></pre>

      <h2>Conclusion</h2>
      <p>Next.js 13 represents a significant leap forward in React development, offering unprecedented performance and developer experience improvements.</p>
    `,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    author: 'Kayra Cakiroglu',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    tags: ['nextjs', 'react', 'web-development'],
    isPublished: true,
  },
  {
    id: '2',
    title: 'Building Scalable APIs with Node.js',
    slug: 'building-scalable-apis-with-nodejs',
    summary: 'Best practices for creating robust and scalable REST APIs using Node.js and Express.',
    content: `
      <h2>Introduction</h2>
      <p>Building scalable APIs is crucial for modern web applications. Node.js provides an excellent foundation for creating high-performance APIs that can handle thousands of concurrent requests.</p>

      <h2>Architecture Principles</h2>
      <ul>
        <li><strong>Separation of Concerns:</strong> Keep your routes, controllers, and business logic separate</li>
        <li><strong>Error Handling:</strong> Implement comprehensive error handling strategies</li>
        <li><strong>Validation:</strong> Always validate input data</li>
        <li><strong>Authentication:</strong> Secure your endpoints properly</li>
      </ul>

      <h2>Performance Optimization</h2>
      <p>Here are some key strategies for optimizing API performance:</p>
      <ul>
        <li>Use connection pooling for database connections</li>
        <li>Implement caching strategies (Redis, in-memory)</li>
        <li>Use compression middleware</li>
        <li>Implement rate limiting</li>
        <li>Monitor and profile your application</li>
      </ul>

      <h2>Code Example</h2>
      <pre><code>
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
      </code></pre>

      <h2>Conclusion</h2>
      <p>By following these best practices, you can build APIs that are not only scalable but also maintainable and secure.</p>
    `,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    author: 'Kayra Cakiroglu',
    publishedAt: '2024-01-10T08:00:00Z',
    tags: ['nodejs', 'api', 'backend', 'scalability'],
    isPublished: true,
  },
  {
    id: '3',
    title: 'Modern CSS Techniques for Better UX',
    slug: 'modern-css-techniques-better-ux',
    summary: 'Explore cutting-edge CSS features and techniques that can dramatically improve user experience.',
    content: `
      <h2>Introduction</h2>
      <p>CSS has evolved tremendously in recent years, introducing powerful features that enable developers to create stunning user interfaces with better performance and accessibility.</p>

      <h2>CSS Grid and Flexbox</h2>
      <p>Modern layout systems provide unprecedented control over element positioning:</p>
      <pre><code>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
      </code></pre>

      <h2>CSS Custom Properties</h2>
      <p>Variables in CSS enable dynamic theming and better maintainability:</p>
      <pre><code>
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --spacing-unit: 1rem;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
}
      </code></pre>

      <h2>Advanced Animations</h2>
      <p>CSS animations and transitions can create engaging user experiences:</p>
      <ul>
        <li>Use <code>transform</code> for smooth animations</li>
        <li>Implement <code>will-change</code> for performance optimization</li>
        <li>Leverage <code>@media (prefers-reduced-motion)</code> for accessibility</li>
      </ul>

      <h2>Container Queries</h2>
      <p>The future of responsive design allows components to respond to their container size:</p>
      <pre><code>
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    display: flex;
    gap: 1rem;
  }
}
      </code></pre>

      <h2>Conclusion</h2>
      <p>These modern CSS techniques enable developers to create more responsive, accessible, and visually appealing web applications.</p>
    `,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    author: 'Kayra Cakiroglu',
    publishedAt: '2024-01-05T12:00:00Z',
    tags: ['css', 'frontend', 'ux', 'design'],
    isPublished: true,
  },
  {
    id: '4',
    title: 'TypeScript Best Practices in 2024',
    slug: 'typescript-best-practices-2024',
    summary: 'Essential TypeScript patterns and practices for writing maintainable and type-safe code.',
    content: `
      <h2>Introduction</h2>
      <p>TypeScript continues to evolve, bringing new features and improved developer experience. Let's explore the best practices for writing robust TypeScript code in 2024.</p>

      <h2>Strict Configuration</h2>
      <p>Always use strict TypeScript configuration for better type safety:</p>
      <pre><code>
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
      </code></pre>

      <h2>Utility Types</h2>
      <p>Leverage TypeScript's built-in utility types for better code reuse:</p>
      <pre><code>
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Pick only needed properties
type UserSummary = Pick&lt;User, 'id' | 'name'&gt;;

// Make all properties optional
type PartialUser = Partial&lt;User&gt;;

// Omit sensitive information
type PublicUser = Omit&lt;User, 'email'&gt;;
      </code></pre>

      <h2>Generic Constraints</h2>
      <p>Use generic constraints to create flexible yet type-safe functions:</p>
      <pre><code>
function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}

// Usage
const user = { id: '1', name: 'John', age: 30 };
const name = getProperty(user, 'name'); // Type: string
      </code></pre>

      <h2>Branded Types</h2>
      <p>Create more specific types to prevent errors:</p>
      <pre><code>
type UserId = string & { readonly brand: unique symbol };
type EmailAddress = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function sendEmail(email: EmailAddress, userId: UserId) {
  // Implementation
}
      </code></pre>

      <h2>Conclusion</h2>
      <p>By following these TypeScript best practices, you can write more maintainable, type-safe, and robust applications.</p>
    `,
    image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=400&fit=crop',
    author: 'Kayra Cakiroglu',
    publishedAt: '2024-01-20T16:00:00Z',
    tags: ['typescript', 'javascript', 'programming', 'best-practices'],
    isPublished: true,
  },
];

// API Functions
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return DUMMY_POSTS.filter(post => post.isPublished);
  }

  try {
    const response = await blogApi.get<ApiResponse<BlogPostsResponse>>('/posts');
    return response.data.data.posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback to dummy data if API fails
    return DUMMY_POSTS.filter(post => post.isPublished);
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const post = DUMMY_POSTS.find(post => post.slug === slug && post.isPublished);
    return post || null;
  }

  try {
    const response = await blogApi.get<ApiResponse<BlogPost>>(`/posts/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    // Fallback to dummy data if API fails
    const post = DUMMY_POSTS.find(post => post.slug === slug && post.isPublished);
    return post || null;
  }
}

// Get all posts for admin (including drafts)
export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return DUMMY_POSTS;
  }

  try {
    const response = await blogApi.get<ApiResponse<BlogPostsResponse>>('/admin/posts');
    return response.data.data.posts;
  } catch (error) {
    console.error('Error fetching admin blog posts:', error);
    return DUMMY_POSTS;
  }
}

// Get a single post for editing (admin only)
export async function getAdminBlogPost(id: string): Promise<BlogPost | null> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const post = DUMMY_POSTS.find(post => post.id === id);
    return post || null;
  }

  try {
    const response = await blogApi.get<ApiResponse<BlogPost>>(`/admin/posts/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching admin blog post:', error);
    const post = DUMMY_POSTS.find(post => post.id === id);
    return post || null;
  }
}

// Additional API functions for when the real API is ready
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> {
  if (USE_MOCK_DATA) {
    // Simulate creating post in mock mode
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPost: BlogPost = {
      ...post,
      id: (DUMMY_POSTS.length + 1).toString(),
      publishedAt: new Date().toISOString(),
    };
    DUMMY_POSTS.push(newPost);
    return newPost;
  }

  const response = await blogApi.post<ApiResponse<BlogPost>>('/posts', post);
  return response.data.data;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const postIndex = DUMMY_POSTS.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    const updatedPost = { ...DUMMY_POSTS[postIndex], ...updates };
    DUMMY_POSTS[postIndex] = updatedPost;
    return updatedPost;
  }

  const response = await blogApi.put<ApiResponse<BlogPost>>(`/posts/${id}`, updates);
  return response.data.data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const postIndex = DUMMY_POSTS.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    DUMMY_POSTS.splice(postIndex, 1);
    return;
  }

  await blogApi.delete(`/posts/${id}`);
}
