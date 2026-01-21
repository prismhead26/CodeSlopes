'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPosts } from '@/lib/firebase/posts';
import { getCategories } from '@/lib/firebase/categories';
import { BlogPost, Category } from '@/types';
import BlogCard from '@/components/BlogCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch posts and categories in parallel
      const [postsResult, categoriesResult] = await Promise.all([
        getPosts({ published: true, limitCount: 50 }),
        getCategories()
      ]);

      if (postsResult.error) {
        setError(postsResult.error.message);
      } else {
        setPosts(postsResult.posts);
        setFilteredPosts(postsResult.posts);
      }

      if (!categoriesResult.error) {
        setCategories(categoriesResult.categories);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.content.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory]);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(selectedCategory === slug ? '' : slug);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Exploring technology, AI, and life adventures
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800 text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow'
                }`}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </button>
            ))}
            {(selectedCategory || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              {selectedCategory && ` in ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                No posts found matching your criteria.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
