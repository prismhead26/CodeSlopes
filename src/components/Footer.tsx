'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/firebase/categories';
import { getSettings } from '@/lib/firebase/settings';
import { Category, SiteSettings } from '@/types';

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesResult, settingsResult] = await Promise.all([
        getCategories(),
        getSettings()
      ]);
      setCategories(categoriesResult.categories);
      if (settingsResult.settings) {
        setSettings(settingsResult.settings);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CodeSlopes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Documenting the journey of a Software Engineer navigating tech, AI, and Colorado adventures.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Tech Tutorials
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/blog?category=${category.slug}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                    >
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/blog?category=tech" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                      Tech
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=ai" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                      AI
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=lifestyle" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                      Lifestyle
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              {settings?.social?.github && (
                <li>
                  <a
                    href={settings.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    GitHub
                  </a>
                </li>
              )}
              {settings?.social?.linkedin && (
                <li>
                  <a
                    href={settings.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {settings?.social?.twitter && (
                <li>
                  <a
                    href={settings.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Twitter / X
                  </a>
                </li>
              )}
              {!settings?.social?.github && !settings?.social?.linkedin && !settings?.social?.twitter && (
                <li className="text-gray-500 dark:text-gray-500 italic">
                  No social links configured
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} CodeSlopes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
