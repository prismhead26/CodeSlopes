'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { approveComment, deleteComment } from '@/lib/firebase/comments';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { Comment, BlogPost } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/admin/SearchBar';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import EmptyState from '@/components/admin/EmptyState';
import toast from 'react-hot-toast';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ManageCommentsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [bulkActionInProgress, setBulkActionInProgress] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/signin');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    setLoading(true);

    // Set up real-time listener for comments
    const commentsQuery = query(
      collection(db, 'comments'),
      orderBy('createdAt', 'desc')
    );

    const commentsUnsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const commentsData: Comment[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          } as Comment;
        });
        setComments(commentsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading comments:', error);
        toast.error(`Error loading comments: ${error.message}`);
        setLoading(false);
      }
    );

    // Set up real-time listener for posts
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const postsUnsubscribe = onSnapshot(
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
      },
      (error) => {
        console.error('Error loading posts:', error);
        toast.error(`Error loading posts: ${error.message}`);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      commentsUnsubscribe();
      postsUnsubscribe();
    };
  }, [user, isAdmin]);

  const filteredComments = useMemo(() => {
    return comments.filter(comment => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.userName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'approved' && comment.approved) ||
        (filterStatus === 'pending' && !comment.approved);

      return matchesSearch && matchesStatus;
    });
  }, [comments, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: comments.length,
      approved: comments.filter(c => c.approved).length,
      pending: comments.filter(c => !c.approved).length,
    };
  }, [comments]);

  const getPostTitle = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.title || 'Unknown Post';
  };

  const getPostSlug = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.slug || '';
  };

  const handleApprove = async (comment: Comment) => {
    const { error } = await approveComment(comment.id);

    if (error) {
      toast.error(`Error approving comment: ${error.message}`);
    } else {
      toast.success('Comment approved');
      setComments(comments.map(c => c.id === comment.id ? { ...c, approved: true } : c));
    }
  };

  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    setDeleting(true);
    const { error } = await deleteComment(commentToDelete.id);
    setDeleting(false);

    if (error) {
      toast.error(`Error deleting comment: ${error.message}`);
    } else {
      toast.success('Comment deleted');
      setComments(comments.filter(c => c.id !== commentToDelete.id));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedComments.size === filteredComments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(filteredComments.map(c => c.id)));
    }
  };

  const handleSelectComment = (commentId: string) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
  };

  const handleBulkApprove = async () => {
    if (selectedComments.size === 0) return;

    setBulkActionInProgress(true);
    let successCount = 0;

    for (const commentId of selectedComments) {
      const { error } = await approveComment(commentId);
      if (!error) successCount++;
    }

    setBulkActionInProgress(false);
    setSelectedComments(new Set());

    if (successCount > 0) {
      toast.success(`Approved ${successCount} comment(s)`);
      setComments(comments.map(c => selectedComments.has(c.id) ? { ...c, approved: true } : c));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedComments.size === 0) return;

    if (!confirm(`Delete ${selectedComments.size} comment(s)? This cannot be undone.`)) {
      return;
    }

    setBulkActionInProgress(true);
    let successCount = 0;
    let errorCount = 0;

    for (const commentId of selectedComments) {
      const { error } = await deleteComment(commentId);
      if (error) {
        errorCount++;
      } else {
        successCount++;
      }
    }

    setBulkActionInProgress(false);
    setSelectedComments(new Set());

    if (successCount > 0) {
      toast.success(`Deleted ${successCount} comment(s)`);
      setComments(comments.filter(c => !selectedComments.has(c.id)));
    }
    if (errorCount > 0) {
      toast.error(`Failed to delete ${errorCount} comment(s)`);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner text="Loading comments..." />
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Manage Comments</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Comments</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
              <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedComments.size > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {selectedComments.size} comment(s) selected
                  </span>
                  <button
                    onClick={() => setSelectedComments(new Set())}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkApprove}
                    disabled={bulkActionInProgress}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={bulkActionInProgress}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SearchBar placeholder="Search comments..." onSearch={setSearchQuery} />
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'approved' | 'pending')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {filteredComments.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No comments found"
              description="There are no comments to moderate yet."
            />
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  checked={selectedComments.size === filteredComments.length && filteredComments.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Select all
                </span>
              </div>

              {filteredComments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={selectedComments.has(comment.id)}
                        onChange={() => handleSelectComment(comment.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {comment.userPhoto ? (
                        <img
                          src={comment.userPhoto}
                          alt={comment.userName}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {comment.userName}
                          </span>
                          <span className="mx-2 text-gray-400">·</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {comment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          {comment.approved ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-4">
                        <Link
                          href={`/blog/${getPostSlug(comment.postId)}`}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          On: {getPostTitle(comment.postId)}
                        </Link>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!comment.approved && (
                        <button
                          onClick={() => handleApprove(comment)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(comment)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message={`Are you sure you want to delete this comment from ${commentToDelete?.userName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
