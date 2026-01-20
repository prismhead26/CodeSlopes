import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">About CodeSlopes</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl mb-6">
              Welcome to CodeSlopes - where technology meets lifestyle in the beautiful Colorado landscape.
            </p>

            <h2>Who I Am</h2>
            <p>
              I&apos;m a Software and IT Engineer passionate about building innovative solutions,
              exploring the frontiers of AI, and documenting the journey. This blog serves as my
              digital canvas where I share technical insights, tutorials, and life experiences.
            </p>

            <h2>What You&apos;ll Find Here</h2>
            <ul>
              <li>
                <strong>Tech Tutorials:</strong> Deep dives into software engineering, web development,
                and modern technologies
              </li>
              <li>
                <strong>AI Explorations:</strong> Experiments with AI, machine learning, and how these
                technologies are shaping our future
              </li>
              <li>
                <strong>Career Insights:</strong> Lessons learned, career advice, and professional
                development tips
              </li>
              <li>
                <strong>Lifestyle:</strong> Adventures in Colorado, outdoor activities, and finding
                balance in the tech world
              </li>
            </ul>

            <h2>The Mission</h2>
            <p>
              CodeSlopes is more than just a blog - it&apos;s a platform for learning, sharing, and
              growing together. Whether you&apos;re a fellow developer, AI enthusiast, or someone
              curious about tech, you&apos;ll find valuable content here.
            </p>

            <h2>Connect With Me</h2>
            <p>
              I love connecting with readers and fellow technologists. Feel free to reach out
              through social media or leave comments on posts. Let&apos;s learn and grow together!
            </p>

            <div className="flex gap-4 mt-4 not-prose">
              <a
                href="https://github.com/prismhead26/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/aiden-wahed-a78539227"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/Count_Spockula"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                Twitter / X
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
