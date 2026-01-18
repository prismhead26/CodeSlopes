import EditPostClient from './EditPostClient';

// Required for static export
export const dynamic = 'force-static';
export const dynamicParams = false;

// Dynamic routes need generateStaticParams for static export
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Return empty array - admin pages require authentication and will be loaded client-side
  return [];
}

export default function EditPostPage() {
  return <EditPostClient />;
}
