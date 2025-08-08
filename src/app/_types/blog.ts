export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cleanContent?: string;
  image: string;
  authorId: number;
  createdAt: string;
  tags: string[];
  isPublished?: boolean;
}

export interface BlogPostDetail extends BlogPost {
  cleanContent: string;
  isPublished: boolean;
}

export interface BlogPostsResponse {
  isSuccess: boolean;
  errors: any;
  data: BlogPost[];
  statusCode: number;
}

export interface BlogPostDetailResponse {
  isSuccess: boolean;
  errors: any;
  data: BlogPostDetail;
  statusCode: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
 