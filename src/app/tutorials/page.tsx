'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTutorials } from '@/lib/firebase/tutorials';
import { Tutorial } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const categoryIcons: Record<string, string> = {
  networking: '🌐',
  linux: '🐧',
  windows: '🪟',
  security: '🔒',
  devops: '⚙️',
  general: '💻',
};

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  useEffect(() => {
    loadTutorials();
  }, [selectedCategory, selectedDifficulty]);

  const loadTutorials = async () => {
    setLoading(true);
    const { tutorials: fetchedTutorials, error } = await getTutorials({
      published: true,
      category: selectedCategory || undefined,
      difficulty: selectedDifficulty || undefined,
    });

    if (!error) {
      setTutorials(fetchedTutorials);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tech Tutorials</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hands-on guides for networking, Linux, IT administration, and more.
              Learn with practical terminal commands and real-world examples.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="">All Categories</option>
              <option value="networking">🌐 Networking</option>
              <option value="linux">🐧 Linux</option>
              <option value="windows">🪟 Windows</option>
              <option value="security">🔒 Security</option>
              <option value="devops">⚙️ DevOps</option>
              <option value="general">💻 General</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Tutorials Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tutorials...</p>
            </div>
          ) : tutorials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No tutorials found. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {tutorial.coverImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={tutorial.coverImage}
                        alt={tutorial.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{categoryIcons[tutorial.category] || '💻'}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${difficultyColors[tutorial.difficulty]}`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">{tutorial.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {tutorial.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{tutorial.readingTime} min read</span>
                      <span>👁️ {tutorial.views}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
