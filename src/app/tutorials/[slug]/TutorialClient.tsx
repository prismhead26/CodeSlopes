'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getTutorialBySlug, incrementTutorialViews } from '@/lib/firebase/tutorials';
import { Tutorial } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const categoryLabels: Record<string, string> = {
  networking: '🌐 Networking',
  linux: '🐧 Linux',
  windows: '🪟 Windows',
  security: '🔒 Security',
  devops: '⚙️ DevOps',
  general: '💻 General',
};

export default function TutorialClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorial = async () => {
      setLoading(true);
      const { tutorial, error } = await getTutorialBySlug(slug);

      if (error) {
        setError(error.message);
      } else if (tutorial) {
        setTutorial(tutorial);
        // Increment view count
        await incrementTutorialViews(tutorial.id);
      }

      setLoading(false);
    };

    if (slug) {
      fetchTutorial();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tutorial...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !tutorial) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">
                {error || 'Tutorial not found'}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          {tutorial.coverImage && (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={tutorial.coverImage}
                alt={tutorial.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {categoryLabels[tutorial.category] || tutorial.category}
            </span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${difficultyColors[tutorial.difficulty]}`}>
              {tutorial.difficulty}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {tutorial.readingTime} min read
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              👁️ {tutorial.views} views
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{tutorial.title}</h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {tutorial.authorPhoto && (
                <Image
                  src={tutorial.authorPhoto}
                  alt={tutorial.authorName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold">{tutorial.authorName}</p>
                <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={tutorial.publishedAt?.toISOString()}>
                  {tutorial.publishedAt && format(tutorial.publishedAt, 'MMMM dd, yyyy')}
                </time>
              </div>
            </div>
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-blue-600 dark:prose-code:text-blue-400"
            dangerouslySetInnerHTML={{ __html: tutorial.content }}
          />

          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            {tutorial.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
