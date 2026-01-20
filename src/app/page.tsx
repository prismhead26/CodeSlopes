import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome to CodeSlopes
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
            A tech and lifestyle blog documenting the journey of a Software and IT Engineer
            navigating the intersection of code, AI, and Colorado&apos;s outdoor adventures.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link
              href="/blog"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Read Blog
            </Link>
            <Link
              href="/tutorials"
              className="px-8 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
            >
              Tech Tutorials
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors font-semibold"
            >
              About Me
            </Link>
          </div>

          {/* Blog Categories */}
          <h2 className="text-2xl font-bold mt-16 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/blog?category=tech"
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Tech</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Software engineering, web development, and cutting-edge technology
              </p>
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg font-semibold text-sm">
                View Tech Posts →
              </span>
            </Link>
            <Link
              href="/blog?category=ai"
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-purple-500"
            >
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">AI</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Artificial intelligence, machine learning, and the future of tech
              </p>
              <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg font-semibold text-sm">
                View AI Posts →
              </span>
            </Link>
            <Link
              href="/blog?category=lifestyle"
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
            >
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">Lifestyle</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Adventures, experiences, and life in beautiful Colorado
              </p>
              <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold text-sm">
                View Lifestyle Posts →
              </span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
