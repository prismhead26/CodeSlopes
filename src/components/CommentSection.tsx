'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Comment } from '@/types';
import { getCommentsByPost, createComment } from '@/lib/firebase/comments';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    const { comments: fetchedComments, error } = await getCommentsByPost(postId);
    if (error) {
      console.error('Error loading comments:', error);
    } else {
      setComments(fetchedComments);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be signed in to comment');
      return;
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSubmitting(true);

    const commentData = {
      postId,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userPhoto: user.photoURL || null,
      content: content.trim(),
      approved: false,
    };

    const { id, error } = await createComment(commentData);

    if (error) {
      toast.error('Error posting comment');
    } else if (id) {
      toast.success('Comment submitted! It will appear after approval.');
      setContent('');
    }

    setSubmitting(false);
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User'}
                width={40}
                height={40}
                className="rounded-full h-10 w-10"
              />
            )}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">{content.length}/1000</span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.userPhoto ? (
                <Image
                  src={comment.userPhoto}
                  alt={comment.userName}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.userName}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(comment.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
