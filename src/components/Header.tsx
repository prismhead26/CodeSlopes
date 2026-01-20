'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      router.push('/');
    }
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            CodeSlopes
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Blog
            </Link>
            <Link href="/tutorials" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Tutorials
            </Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
              >
                Admin
              </Link>
            )}

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
