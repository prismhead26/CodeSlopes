'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getSettings, updateSettings, resetSettings } from '@/lib/firebase/settings';
import { SiteSettings } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import toast from 'react-hot-toast';

type Tab = 'general' | 'author' | 'social' | 'seo';

export default function SettingsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [formData, setFormData] = useState<Partial<SiteSettings>>({
    siteName: '',
    tagline: '',
    description: '',
    logoUrl: '',
    author: {
      name: '',
      email: '',
      bio: '',
      photo: '',
    },
    social: {
      github: '',
      linkedin: '',
      twitter: '',
    },
    seo: {
      metaDescription: '',
      keywords: [],
    },
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/signin');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      loadSettings();
    }
  }, [user, isAdmin]);

  const loadSettings = async () => {
    setLoading(true);
    const { settings, error } = await getSettings();

    if (error) {
      toast.error('Error loading settings');
    } else if (settings) {
      setFormData(settings);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSubmitting(true);
    const { error } = await updateSettings(formData);
    setSubmitting(false);

    if (error) {
      toast.error(`Error saving settings: ${error.message}`);
    } else {
      toast.success('Settings saved successfully');
    }
  };

  const handleReset = async () => {
    setResetting(true);
    const { error } = await resetSettings();
    setResetting(false);

    if (error) {
      toast.error(`Error resetting settings: ${error.message}`);
    } else {
      toast.success('Settings reset to defaults');
      setResetDialogOpen(false);
      await loadSettings();
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner text="Loading settings..." />
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'author', label: 'Author', icon: '👤' },
    { id: 'social', label: 'Social', icon: '🔗' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Site Settings</h1>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Name</label>
                    <input
                      type="text"
                      value={formData.siteName || ''}
                      onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Logo URL</label>
                    <input
                      type="url"
                      value={formData.logoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Author Tab */}
              {activeTab === 'author' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.author?.name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author!, name: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.author?.email || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author!, email: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={formData.author?.bio || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author!, bio: e.target.value },
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Photo URL</label>
                    <input
                      type="url"
                      value={formData.author?.photo || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author!, photo: e.target.value },
                        })
                      }
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Social Tab */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    <input
                      type="url"
                      value={formData.social?.github || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social: { ...formData.social!, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.social?.linkedin || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social: { ...formData.social!, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <input
                      type="url"
                      value={formData.social?.twitter || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social: { ...formData.social!, twitter: e.target.value },
                        })
                      }
                      placeholder="https://twitter.com/username"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>

                  </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                      value={formData.seo?.metaDescription || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo!, metaDescription: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                      placeholder="Brief description of your site for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.seo?.keywords?.join(', ') || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: {
                            ...formData.seo!,
                            keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k),
                          },
                        })
                      }
                      placeholder="blog, tech, programming"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setResetDialogOpen(true)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </main>
      <Footer />

      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleReset}
        title="Reset Settings"
        message="Are you sure you want to reset all settings to defaults? This will overwrite your current settings."
        confirmText="Reset"
        variant="warning"
        loading={resetting}
      />
    </>
  );
}
