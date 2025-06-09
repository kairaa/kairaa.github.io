// Token storage utilities
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    // For server-side, try to get from environment
    return process.env.NEXT_PUBLIC_API_TOKEN || null;
  }
  
  // First try localStorage, then fallback to environment
  const localToken = localStorage.getItem('admin_token');
  return localToken || process.env.NEXT_PUBLIC_API_TOKEN || null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};