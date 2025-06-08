# Blog Implementation

This blog implementation is designed to work with a future API while providing a seamless development experience using mock data.

## Features

- **Blog Post Listing**: Display all published blog posts with title, image, and summary
- **Individual Post Pages**: Full blog post content with proper formatting
- **Responsive Design**: Works on all device sizes
- **API Ready**: Configured to work with a real API when ready
- **Mock Data**: Uses dummy data during development

## Pages

1. **Blog Listing** (`/blog`): Shows all blog posts in a grid layout
2. **Blog Post Detail** (`/blog/[slug]`): Individual blog post with full content

## API Configuration

The blog uses environment variables to control API behavior:

```env
# Set to true to use mock data (development)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Your API endpoint (when ready)
NEXT_PUBLIC_BLOG_API_URL=https://api.yourdomain.com/blog
```

## Switching to Real API

When your API is ready:

1. Update `.env.local`:
   ```env
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_BLOG_API_URL=https://your-actual-api-url.com/api/v1/blog
   ```

2. Ensure your API endpoints match:
   - `GET /posts` - Returns list of blog posts
   - `GET /posts/{slug}` - Returns individual blog post

## API Response Format

The API should return data in this format:

```typescript
// For blog listing (/posts)
{
  "success": true,
  "data": {
    "posts": BlogPost[],
    "total": number,
    "page": number,
    "limit": number
  }
}

// For individual post (/posts/{slug})
{
  "success": true,
  "data": BlogPost
}
```

## Blog Post Type

```typescript
interface BlogPost {
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
```

## File Structure

```
src/app/
├── blog/
│   ├── layout.tsx          # Blog layout with navbar
│   ├── page.tsx            # Blog listing page
│   └── [slug]/
│       └── page.tsx        # Individual blog post page
├── _lib/
│   └── blogApi.ts          # API service with axios
├── _types/
│   └── blog.ts             # TypeScript types
└── _components/
    └── navbar.tsx          # Navigation component
```

## Development

The blog is currently using mock data with 4 sample posts. The mock data includes:

1. "Getting Started with Next.js 13"
2. "Building Scalable APIs with Node.js" 
3. "Modern CSS Techniques for Better UX"
4. "TypeScript Best Practices in 2024"

## Styling

The blog maintains consistency with the existing site theme:
- Uses the same color variables from globals.css
- Responsive design with Tailwind CSS
- Dark mode support
- Hover effects and transitions

## Future Enhancements

When the API is ready, you can easily add:
- Authentication for post creation/editing
- Search functionality
- Categories and tags filtering
- Pagination
- Comments system
- SEO metadata generation
