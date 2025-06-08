// API client utility for making authenticated requests

interface ApiResponse<T = any> {
  isSuccess: boolean;
  errors: string[] | null;
  data: T | null;
  statusCode: number;
}

class ApiClient {
  private baseURL: string;
  private useMockMode: boolean;

  constructor(baseURL: string = 'https://gw.kaira.me/api') {
    this.baseURL = baseURL;
    // Enable mock mode for development when API is not available
    this.useMockMode = process.env.NODE_ENV === 'development' || process.env.USE_MOCK_API === 'true';
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // If token is expired or invalid, clear it from localStorage
      if (data.statusCode === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
        }
        // You could also trigger a logout action here
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        isSuccess: false,
        errors: ['Network error occurred'],
        data: null,
        statusCode: 500,
      };
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; isUserHasAccount: boolean }>> {
    // Always use real API for login (not mock mode)
    console.log('=== LOGIN ATTEMPT START ===');
    console.log('Base URL:', this.baseURL);
    console.log('Full URL:', `${this.baseURL}/login`);
    console.log('Request body:', { email, password: '***' });
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    console.log('Request headers:', headers);

    try {
      console.log('Making fetch request...');
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers,
        body: JSON.stringify({ email, password }),
      });

      console.log('✅ Fetch successful!');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);
      console.log('=== LOGIN ATTEMPT END ===');
      
      return data;
    } catch (error: any) {
      console.error('❌ LOGIN FAILED');
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error object:', error);
      console.error('=== LOGIN ATTEMPT END WITH ERROR ===');
      
      // More specific CORS error detection
      const errorMessage = error?.message || '';
      const isCorsError = errorMessage.includes('CORS') || 
                         errorMessage.includes('Cross-Origin') ||
                         errorMessage.includes('blocked') ||
                         errorMessage.includes('Access-Control') ||
                         (error?.name === 'TypeError' && errorMessage.includes('fetch'));
      
      const isNetworkError = error?.name === 'TypeError' && errorMessage.includes('Failed to fetch');
      
      let errorType = 'Unknown error';
      if (isCorsError) errorType = 'CORS Policy Error';
      else if (isNetworkError) errorType = 'Network/Connection Error';
      else if (error?.name === 'TypeError') errorType = 'Request Error';
      
      return {
        isSuccess: false,
        errors: [`${errorType}: ${errorMessage}`],
        data: null,
        statusCode: 500,
      };
    }
  }

  // Blog posts API methods (to be implemented when the API is ready)
  async getBlogPosts(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/blog/posts');
  }

  async getBlogPost(slug: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/blog/posts/${slug}`);
  }

  async createBlogPost(postData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/blog/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updateBlogPost(id: string, postData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/blog/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deleteBlogPost(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/blog/posts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse };
