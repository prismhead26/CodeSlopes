import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CopeSlopes
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
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} CopeSlopes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
