import EditPostClient from './EditPostClient';

// Allow dynamic routes - posts are fetched client-side from Firestore
export const dynamic = 'force-dynamic';

export default function EditPostPage() {
  return <EditPostClient />;
}
