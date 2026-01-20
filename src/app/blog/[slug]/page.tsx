import BlogPostClient from './BlogPostClient';

// Allow dynamic routes - blog posts are fetched client-side from Firestore
export const dynamic = 'force-dynamic';

export default function BlogPostPage() {
  return <BlogPostClient />;
}
