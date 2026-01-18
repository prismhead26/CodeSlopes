import type { NextConfig } from "next";

// Note: Security headers are configured in firebase.json for static export
// Static export doesn't support the headers() function in Next.js config

const nextConfig: NextConfig = {
  // Use standard build (not static export) for Firebase Hosting with SSR
  // This provides better SEO and supports dynamic routes properly

  // Images configuration
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },

  // Add trailing slashes for consistency
  trailingSlash: true,

  experimental: {
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit'],
  },
};

export default nextConfig;
