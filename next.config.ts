import type { NextConfig } from "next";

// Note: Security headers are configured in firebase.json for static export
// Static export doesn't support the headers() function in Next.js config

const nextConfig: NextConfig = {
  // Use standard build (not static export) for Firebase Hosting with SSR
  // This provides better SEO and supports dynamic routes properly

  // Images configuration - use remotePatterns for Next.js 13+
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },

  // Add trailing slashes for consistency
  trailingSlash: true,

  experimental: {
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit'],
  },

  // Exclude functions directory from Next.js build
  webpack: (config, { isServer }) => {
    // Ignore the functions directory completely
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/functions/**', '**/.git/**'],
    };
    return config;
  },
};

export default nextConfig;
