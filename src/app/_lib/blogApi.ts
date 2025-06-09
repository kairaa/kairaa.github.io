import axios from 'axios';
import type { BlogPost, BlogPostDetail, BlogPostsResponse, BlogPostDetailResponse } from '../_types/blog';
import { getAuthHeaders } from './tokenStorage';

// API Configuration
const API_BASE_URL = 'https://gw.kaira.me/api';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'; // Default to false for production

// File upload interface
interface FileUploadResponse {
  isSuccess: boolean;
  data: {
    files: Array<{
      fileName: string;
      imgurUrl: string;
      imgurId: string;
      deleteHash: string;
    }>;
    message: string;
  };
  statusCode: number;
}

// Blog post creation interface
interface CreateBlogPostRequest {
  title: string;
  summary: string;
  featuredImageUrl: string;
  tags?: string;
  content: string;
}

// Axios instance for blog API
const blogApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
blogApi.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
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

// Helper function to transform API response to BlogPost interface
function transformToBlogPost(data: any): BlogPost {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    image: data.image,
    authorId: data.authorId,
    createdAt: data.createdAt,
    tags: data.tags || [],
    isPublished: data.isPublished
  };
}

function transformToBlogPostDetail(data: any): BlogPostDetail {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    cleanContent: data.cleanContent || '',
    image: data.image,
    authorId: data.authorId,
    createdAt: data.createdAt,
    tags: data.tags || [],
    isPublished: data.isPublished
  };
}

// Dummy data for development/fallback
const DUMMY_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 13',
    slug: 'getting-started-with-nextjs-13',
    summary: 'Learn how to build modern web applications with Next.js 13 and the new app directory structure.',
    content: `<h2>Introduction</h2><p>Next.js 13 introduces a revolutionary new way of building React applications with the app directory structure. This new paradigm brings improved performance, better developer experience, and more intuitive routing.</p>`,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    authorId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['nextjs', 'react', 'web-development'],
    isPublished: true,
  },
  {
    id: '2',
    title: 'Building Scalable APIs with Node.js',
    slug: 'building-scalable-apis-with-nodejs',
    summary: 'Best practices for creating robust and scalable REST APIs using Node.js and Express.',
    content: `<h2>Introduction</h2><p>Building scalable APIs is crucial for modern web applications. Node.js provides an excellent foundation for creating high-performance APIs that can handle thousands of concurrent requests.</p>`,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    authorId: 1,
    createdAt: '2024-01-10T08:00:00Z',
    tags: ['nodejs', 'api', 'backend', 'scalability'],
    isPublished: true,
  }
];

// API Functions
export async function getBlogPosts(page: number = 1, pageSize: number = 10): Promise<BlogPost[]> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return DUMMY_POSTS.filter(post => post.isPublished);
  }

  try {
    const response = await blogApi.get<BlogPostsResponse>(`/blogpost/active?page=${page}&pageSize=${pageSize}`);
    
    if (response.data.isSuccess) {
      return response.data.data.map(transformToBlogPost);
    } else {
      throw new Error('API returned error');
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback to dummy data if API fails
    return DUMMY_POSTS.filter(post => post.isPublished);
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const post = DUMMY_POSTS.find(post => post.slug === slug && post.isPublished);
    if (post) {
      return {
        ...post,
        cleanContent: post.content.replace(/<[^>]*>/g, ''), // Simple HTML strip for mock
        isPublished: post.isPublished || true
      };
    }
    return null;
  }

  try {
    const response = await blogApi.get<BlogPostDetailResponse>(`/blogpost/${slug}`);
    
    if (response.data.isSuccess) {
      return transformToBlogPostDetail(response.data.data);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    // Fallback to dummy data if API fails
    const post = DUMMY_POSTS.find(post => post.slug === slug && post.isPublished);
    if (post) {
      return {
        ...post,
        cleanContent: post.content.replace(/<[^>]*>/g, ''),
        isPublished: post.isPublished || true
      };
    }
    return null;
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
    // For admin, we might need a different endpoint
    const response = await blogApi.get<BlogPostsResponse>('/admin/blogpost/all');
    if (response.data.isSuccess) {
      return response.data.data.map(transformToBlogPost);
    } else {
      throw new Error('API returned error');
    }
  } catch (error) {
    console.error('Error fetching admin blog posts:', error);
    return DUMMY_POSTS;
  }
}

// Get a single post for editing (admin only)
export async function getAdminBlogPost(id: string): Promise<BlogPostDetail | null> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const post = DUMMY_POSTS.find(post => post.id === id);
    if (post) {
      return {
        ...post,
        cleanContent: post.content.replace(/<[^>]*>/g, ''),
        isPublished: post.isPublished || true
      };
    }
    return null;
  }

  try {
    const response = await blogApi.get<BlogPostDetailResponse>(`/admin/blogpost/${id}`);
    if (response.data.isSuccess) {
      return transformToBlogPostDetail(response.data.data);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching admin blog post:', error);
    const post = DUMMY_POSTS.find(post => post.id === id);
    if (post) {
      return {
        ...post,
        cleanContent: post.content.replace(/<[^>]*>/g, ''),
        isPublished: post.isPublished || true
      };
    }
    return null;
  }
}

// Create a new blog post
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt'>): Promise<BlogPost> {
  try {
    const createBlogPostData: CreateBlogPostRequest = {
      title: post.title,
      summary: post.summary,
      featuredImageUrl: post.image,
      tags: post.tags?.join(','),
      content: post.content,
    };

    const response = await fetch(`${API_BASE_URL}/blogpost`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createBlogPostData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create blog post: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.isSuccess) {
      throw new Error(result.errors?.[0] || 'Failed to create blog post');
    }

    return transformToBlogPost(result.data);
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

// Upload image to Imgur
export async function uploadImageToImgur(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('files', file);

    const authHeaders = getAuthHeaders();
    const headers: Record<string, string> = {};
    
    if (authHeaders['Authorization']) {
      headers['Authorization'] = authHeaders['Authorization'];
    }

    const response = await fetch(`${API_BASE_URL}/file/imgur`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
    }

    const result: FileUploadResponse = await response.json();
    
    if (!result.isSuccess || !result.data.files.length) {
      throw new Error('Failed to upload image to Imgur');
    }

    return result.data.files[0].imgurUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
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

  const response = await blogApi.put(`/blogpost/${id}`, updates);
  if (response.data.isSuccess) {
    return transformToBlogPost(response.data.data);
  } else {
    throw new Error('Failed to update blog post');
  }
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

  await blogApi.delete(`/blogpost/${id}`);
}
