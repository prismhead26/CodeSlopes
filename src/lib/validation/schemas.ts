import { z } from 'zod';

/**
 * Validation schema for blog posts
 */
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be 200 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be 50000 characters or less'),
  excerpt: z.string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be 500 characters or less'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  coverImage: z.string().url('Invalid image URL').optional(),
  published: z.boolean(),
});

export type Post = z.infer<typeof postSchema>;

/**
 * Validation schema for comments
 */
export const commentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  content: z.string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be 1000 characters or less'),
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string()
    .min(1, 'User name is required')
    .max(100, 'User name must be 100 characters or less'),
  userEmail: z.string().email('Invalid email address'),
  userPhoto: z.string().url('Invalid photo URL').optional(),
});

export type Comment = z.infer<typeof commentSchema>;

/**
 * Validation schema for categories
 */
export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be 50 characters or less'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be 50 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code (e.g., #FF5733)'),
  icon: z.string().max(10, 'Icon must be 10 characters or less'),
});

export type Category = z.infer<typeof categorySchema>;
