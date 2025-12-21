'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/signin');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/posts/new"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-xl font-bold mb-2">Create New Post</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Write and publish a new blog post
              </p>
            </Link>

            <Link
              href="/admin/posts"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-xl font-bold mb-2">Manage Posts</h2>
              <p className="text-gray-600 dark:text-gray-400">
                View, edit, and delete existing posts
              </p>
            </Link>

            <Link
              href="/admin/categories"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">🏷️</div>
              <h2 className="text-xl font-bold mb-2">Categories</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage blog categories and tags
              </p>
            </Link>

            <Link
              href="/admin/analytics"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-xl font-bold mb-2">Analytics</h2>
              <p className="text-gray-600 dark:text-gray-400">
                View site statistics and performance
              </p>
            </Link>

            <Link
              href="/admin/comments"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-xl font-bold mb-2">Comments</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Moderate and manage comments
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-xl font-bold mb-2">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure site settings and preferences
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
