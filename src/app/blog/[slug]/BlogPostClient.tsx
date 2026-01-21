'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug, incrementPostViews, incrementPostLikes } from '@/lib/firebase/posts';
import { trackUserActivity } from '@/lib/firebase/analytics';
import { BlogPost } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { format } from 'date-fns';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function BlogPostClient() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { post, error } = await getPostBySlug(slug);

      if (error) {
        setError(error.message);
      } else if (post) {
        setPost(post);
        setLikeCount(post.likes || 0);

        // Check if user already liked this post (stored in localStorage)
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        if (likedPosts[post.id]) {
          setLiked(true);
        }

        // Increment view count
        await incrementPostViews(post.id);
      }

      setLoading(false);
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Track user view activity when user is available
  useEffect(() => {
    if (user && post) {
      trackUserActivity(user, 'view', post.id, post.title);
    }
  }, [user, post]);

  const handleLike = async () => {
    if (!post) return;

    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    if (liked) {
      toast('You already liked this post!', { icon: '❤️' });
      return;
    }

    setLiking(true);
    const { error } = await incrementPostLikes(post.id);

    if (error) {
      toast.error('Failed to like post');
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);

      // Track like activity
      trackUserActivity(user, 'like', post.id, post.title);

      // Store in localStorage to prevent multiple likes
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      likedPosts[post.id] = true;
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

      toast.success('Thanks for the love!');
    }

    setLiking(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">
                {error || 'Post not found'}
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
          {post.coverImage && (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {post.categoryName || post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.readingTime} min read
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              👁️ {post.views} views
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ❤️ {likeCount} likes
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {post.authorPhoto ? (
                <img
                  src={post.authorPhoto}
                  alt={post.authorName}
                  className="w-12 h-12 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold">{post.authorName}</p>
                <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={post.publishedAt?.toISOString()}>
                  {post.publishedAt && format(post.publishedAt, 'MMMM dd, yyyy')}
                </time>
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                liked
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
              } ${liking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {liked ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="font-medium">{likeCount}</span>
            </button>
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <CommentSection postId={post.id} postTitle={post.title} />
        </article>
      </main>
      <Footer />
    </>
  );
}
