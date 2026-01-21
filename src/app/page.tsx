'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategories } from '@/lib/firebase/categories';
import { Category } from '@/types';

// Default colors for categories
const categoryColors: Record<string, { border: string; text: string; bg: string; bgDark: string; textColor: string; textColorDark: string }> = {
  tech: { border: 'hover:border-blue-500', text: 'group-hover:text-blue-600', bg: 'bg-blue-100', bgDark: 'dark:bg-blue-900', textColor: 'text-blue-600', textColorDark: 'dark:text-blue-400' },
  ai: { border: 'hover:border-purple-500', text: 'group-hover:text-purple-600', bg: 'bg-purple-100', bgDark: 'dark:bg-purple-900', textColor: 'text-purple-600', textColorDark: 'dark:text-purple-400' },
  lifestyle: { border: 'hover:border-green-500', text: 'group-hover:text-green-600', bg: 'bg-green-100', bgDark: 'dark:bg-green-900', textColor: 'text-green-600', textColorDark: 'dark:text-green-400' },
};

const defaultColors = { border: 'hover:border-cyan-500', text: 'group-hover:text-cyan-600', bg: 'bg-cyan-100', bgDark: 'dark:bg-cyan-900', textColor: 'text-cyan-600', textColorDark: 'dark:text-cyan-400' };

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { categories: fetchedCategories } = await getCategories();
      setCategories(fetchedCategories);
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome to CodeSlopes
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
            A tech and lifestyle blog documenting the journey of a Software and IT Engineer
            navigating the intersection of code, AI, and Colorado&apos;s outdoor adventures.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link
              href="/blog"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Read Blog
            </Link>
            <Link
              href="/tutorials"
              className="px-8 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
            >
              Tech Tutorials
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors font-semibold"
            >
              About Me
            </Link>
          </div>

          {/* Blog Categories */}
          {categories.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mt-16 mb-8">Browse by Category</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const colors = categoryColors[category.slug] || defaultColors;
                  return (
                    <Link
                      key={category.id}
                      href={`/blog?category=${category.slug}`}
                      className={`group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent ${colors.border}`}
                    >
                      <div className="text-5xl mb-4">{category.icon || '📁'}</div>
                      <h3 className={`text-xl font-bold mb-2 transition-colors ${colors.text}`}>
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {category.description || `Browse ${category.name} posts`}
                      </p>
                      <span className={`inline-block px-4 py-2 ${colors.bg} ${colors.bgDark} ${colors.textColor} ${colors.textColorDark} rounded-lg font-semibold text-sm`}>
                        View {category.name} Posts →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
