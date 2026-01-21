'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createCategory, updateCategory, deleteCategory, recalculateCategoryPostCounts } from '@/lib/firebase/categories';
import { getPosts } from '@/lib/firebase/posts';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { Category } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import EmptyState from '@/components/admin/EmptyState';
import CategoryForm from '@/components/categories/CategoryForm';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ManageCategoriesPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/signin');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    setLoading(true);

    // Set up real-time listener for categories
    const categoriesQuery = query(
      collection(db, 'categories'),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const categoriesData: Category[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return ({
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          } as unknown) as Category;
        });
        setCategories(categoriesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading categories:', error);
        toast.error(`Error loading categories: ${error.message}`);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleCreateClick = () => {
    setCategoryToEdit(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setFormModalOpen(true);
  };

  const handleDeleteClick = async (category: Category) => {
    // Check if category has posts
    const { posts, error } = await getPosts({ category: category.slug });

    if (error) {
      toast.error('Error checking category usage');
      return;
    }

    if (posts.length > 0) {
      toast.error(`Cannot delete category with ${posts.length} post(s). Please reassign or delete those posts first.`);
      return;
    }

    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Category, 'id' | 'createdAt' | 'postCount'>) => {
    setSubmitting(true);

    if (categoryToEdit) {
      const { error } = await updateCategory(categoryToEdit.id, data);
      if (error) {
        toast.error(`Error updating category: ${error.message}`);
      } else {
        toast.success('Category updated successfully');
        setCategories(categories.map(c =>
          c.id === categoryToEdit.id ? { ...c, ...data } : c
        ));
        setFormModalOpen(false);
        setCategoryToEdit(null);
      }
    } else {
      const { id, error } = await createCategory(data);
      if (error) {
        toast.error(`Error creating category: ${error.message}`);
      } else if (id) {
        toast.success('Category created successfully');
        setFormModalOpen(false);
      }
    }

    setSubmitting(false);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);
    const { error } = await deleteCategory(categoryToDelete.id);
    setDeleting(false);

    if (error) {
      toast.error(`Error deleting category: ${error.message}`);
    } else {
      toast.success('Category deleted successfully');
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleRecalculateCounts = async () => {
    setRecalculating(true);
    const { updated, error } = await recalculateCategoryPostCounts();
    setRecalculating(false);

    if (error) {
      toast.error(`Error recalculating counts: ${error.message}`);
    } else {
      toast.success(`Post counts updated for ${updated} ${updated === 1 ? 'category' : 'categories'}`);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner text="Loading categories..." />
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Manage Categories</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRecalculateCounts}
                disabled={recalculating}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowPathIcon className={`h-5 w-5 ${recalculating ? 'animate-spin' : ''}`} />
                {recalculating ? 'Recalculating...' : 'Recalculate Counts'}
              </button>
              <button
                onClick={handleCreateClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Category
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Categories</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{categories.length}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Most Used</div>
              <div className="text-xl font-bold text-blue-600">
                {categories.length > 0
                  ? categories.reduce((max, c) => c.postCount > max.postCount ? c : max, categories[0]).name
                  : 'N/A'}
              </div>
            </div>
          </div>

          {/* Categories List */}
          {categories.length === 0 ? (
            <EmptyState
              icon="🏷️"
              title="No categories yet"
              description="Create your first category to organize your blog posts."
              actionLabel="Create Category"
              onAction={handleCreateClick}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      >
                        {category.icon || '📁'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="flex-1 px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setCategoryToEdit(null);
        }}
        title={categoryToEdit ? 'Edit Category' : 'Create Category'}
      >
        <CategoryForm
          category={categoryToEdit}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormModalOpen(false);
            setCategoryToEdit(null);
          }}
          submitting={submitting}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
