'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPost, updatePost, calculateReadingTime } from '@/lib/firebase/posts';
import { getCategories } from '@/lib/firebase/categories';
import { Category } from '@/types';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import toast from 'react-hot-toast';

export default function EditPostClient() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/signin');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (postId && user && isAdmin) {
      loadPost();
    }
  }, [postId, user, isAdmin]);

  const loadCategories = async () => {
    const { categories: fetchedCategories, error } = await getCategories();
    if (error) {
      toast.error('Error loading categories');
    } else {
      setCategories(fetchedCategories);
    }
  };

  const loadPost = async () => {
    setLoading(true);
    const { post, error } = await getPost(postId);

    if (error || !post) {
      toast.error('Post not found');
      router.push('/admin/posts');
      return;
    }

    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setTags(post.tags.join(', '));
    setCoverImage(post.coverImage || '');
    setPublished(post.published);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user) {
      toast.error('You must be signed in');
      setSubmitting(false);
      return;
    }

    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const readingTime = calculateReadingTime(content);

    const postData = {
      title,
      slug,
      content,
      excerpt,
      category,
      tags: tagArray,
      coverImage: coverImage || null,
      published,
      readingTime,
    };

    const { error } = await updatePost(postId, postData);

    if (error) {
      toast.error(`Error updating post: ${error.message}`);
    } else {
      toast.success('Post updated successfully!');
      router.push('/admin/posts');
    }

    setSubmitting(false);
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner text="Loading post..." />
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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Edit Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                Slug *
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL-friendly version of the title
              </p>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                >
                  {categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.icon} {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, typescript, nextjs"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cover Image
              </label>
              <ImageUpload
                currentImage={coverImage}
                onUploadComplete={setCoverImage}
                folder="posts"
              />
              {coverImage && (
                <div className="mt-2">
                  <label htmlFor="coverImageUrl" className="block text-xs text-gray-500 mb-1">
                    Or paste URL directly:
                  </label>
                  <input
                    id="coverImageUrl"
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Post'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/posts')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
