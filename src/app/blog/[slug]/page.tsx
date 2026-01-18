import BlogPostClient from './BlogPostClient';

// Required for static export
export const dynamic = 'force-static';
export const dynamicParams = false;

// Dynamic routes need generateStaticParams for static export
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Return empty array - blog posts will be loaded client-side from Firestore
  return [];
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
