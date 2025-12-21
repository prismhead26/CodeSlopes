import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative h-48 w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {post.readingTime} min read
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {post.authorPhoto && (
              <Image
                src={post.authorPhoto}
                alt={post.authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{post.authorName}</span>
          </div>
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt && format(post.publishedAt, 'MMM dd, yyyy')}
          </time>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
