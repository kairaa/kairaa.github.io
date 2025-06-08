export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  isPublished: boolean;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
