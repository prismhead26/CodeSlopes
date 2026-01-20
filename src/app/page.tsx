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
            Welcome to CopeSlopes
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
              href="/about"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors font-semibold"
            >
              About Me
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-2">Tech Tutorials</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Deep dives into software engineering, AI, and cutting-edge technology
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Exploring the future with AI-powered content and insights
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-bold mb-2">Lifestyle</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Adventures, experiences, and life in beautiful Colorado
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
