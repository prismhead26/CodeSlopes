'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { BlogPost } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatCard from '@/components/analytics/StatCard';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import toast from 'react-hot-toast';
import { EyeIcon, HeartIcon, ChatBubbleLeftIcon, ClockIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/signin');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    setLoading(true);

    // Set up real-time listener for posts
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const postsData: BlogPost[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
            publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : (data.publishedAt ? new Date(data.publishedAt) : undefined),
          } as BlogPost;
        });
        setPosts(postsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading posts:', error);
        toast.error(`Error loading analytics: ${error.message}`);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user, isAdmin]);

  // Compute summary from real-time posts data
  const summary = useMemo(() => {
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const avgReadingTime = posts.length > 0
      ? Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length)
      : 0;

    return {
      totalPosts: posts.length,
      totalViews,
      totalLikes,
      avgReadingTime,
      publishedPosts: posts.filter(p => p.published).length,
    };
  }, [posts]);

  // Compute top posts by views from real-time data
  const topPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, [posts]);

  // Compute category stats from real-time data
  const categoryStats = useMemo(() => {
    const categoryMap = new Map<string, { name: string; views: number; likes: number; count: number }>();

    posts.forEach(post => {
      const existing = categoryMap.get(post.category) || { name: post.category, views: 0, likes: 0, count: 0 };
      categoryMap.set(post.category, {
        name: post.category,
        views: existing.views + post.views,
        likes: existing.likes + post.likes,
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.values());
  }, [posts]);

  const handleExportCSV = () => {
    try {
      // Create CSV header
      const csvLines: string[] = [];

      // Summary section
      csvLines.push('=== Analytics Summary ===');
      csvLines.push('Metric,Value');
      csvLines.push(`Total Posts,${summary.totalPosts}`);
      csvLines.push(`Published Posts,${summary.publishedPosts}`);
      csvLines.push(`Total Views,${summary.totalViews}`);
      csvLines.push(`Total Likes,${summary.totalLikes}`);
      csvLines.push(`Average Reading Time,${summary.avgReadingTime} min`);
      csvLines.push(`Like Rate,${summary.totalViews > 0 ? (summary.totalLikes / summary.totalViews * 100).toFixed(1) : 0}%`);
      csvLines.push(`Avg Views per Post,${summary.totalPosts > 0 ? Math.round(summary.totalViews / summary.totalPosts) : 0}`);
      csvLines.push(`Avg Likes per Post,${summary.totalPosts > 0 ? Math.round(summary.totalLikes / summary.totalPosts) : 0}`);
      csvLines.push('');

      // Top Posts section
      csvLines.push('=== Top Posts by Views ===');
      csvLines.push('Rank,Title,Category,Views,Likes,Reading Time (min),Published Date');
      topPosts.forEach((post, index) => {
        const title = post.title.replace(/,/g, ' ');
        const category = post.category.replace(/,/g, ' ');
        const publishedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published';
        csvLines.push(`${index + 1},"${title}","${category}",${post.views},${post.likes},${post.readingTime},"${publishedDate}"`);
      });
      csvLines.push('');

      // Category Performance section
      csvLines.push('=== Category Performance ===');
      csvLines.push('Category,Post Count,Total Views,Total Likes,Avg Views per Post,Avg Likes per Post');
      categoryStats
        .sort((a, b) => b.views - a.views)
        .forEach((category) => {
          const avgViews = category.count > 0 ? Math.round(category.views / category.count) : 0;
          const avgLikes = category.count > 0 ? Math.round(category.likes / category.count) : 0;
          csvLines.push(`"${category.name}",${category.count},${category.views},${category.likes},${avgViews},${avgLikes}`);
        });

      // Create CSV blob
      const csvContent = csvLines.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);

      toast.success('Analytics data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV');
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner text="Loading analytics..." />
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export CSV
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon="👁️"
              title="Total Views"
              value={summary.totalViews.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon="❤️"
              title="Total Likes"
              value={summary.totalLikes.toLocaleString()}
              color="red"
            />
            <StatCard
              icon="📝"
              title="Published Posts"
              value={summary.publishedPosts}
              suffix={` of ${summary.totalPosts}`}
              color="green"
            />
            <StatCard
              icon="⏱️"
              title="Avg Reading Time"
              value={summary.avgReadingTime}
              suffix=" min"
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Posts by Views */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <EyeIcon className="h-6 w-6 text-blue-600" />
                Top Posts by Views
              </h2>

              {topPosts.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No posts yet
                </p>
              ) : (
                <div className="space-y-3">
                  {topPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {post.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <EyeIcon className="h-4 w-4" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <HeartIcon className="h-4 w-4" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Category Performance
              </h2>

              {categoryStats.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No categories yet
                </p>
              ) : (
                <div className="space-y-3">
                  {categoryStats
                    .sort((a, b) => b.views - a.views)
                    .map((category) => (
                      <div
                        key={category.name}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {category.name}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {category.count} {category.count === 1 ? 'post' : 'posts'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <EyeIcon className="h-4 w-4" />
                            {category.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <HeartIcon className="h-4 w-4" />
                            {category.likes} likes
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Engagement Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Engagement Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-2xl font-bold text-blue-600">
                  {summary.totalViews > 0
                    ? (summary.totalLikes / summary.totalViews * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Like Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <div className="text-2xl font-bold text-green-600">
                  {summary.totalPosts > 0
                    ? Math.round(summary.totalViews / summary.totalPosts)
                    : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Views per Post</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.totalPosts > 0
                    ? Math.round(summary.totalLikes / summary.totalPosts)
                    : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Likes per Post</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
