import TutorialClient from './TutorialClient';

// Allow dynamic routes - tutorials are fetched client-side from Firestore
export const dynamic = 'force-dynamic';

export default function TutorialPage() {
  return <TutorialClient />;
}
