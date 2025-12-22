/**
 * Validation Utilities
 */

import { ValidationError } from './errors';

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL validation
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Password strength validation
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Required field validation
 */
export function validateRequired<T>(
  value: T,
  fieldName: string
): void {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

/**
 * String length validation
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value.length < min) {
    throw new ValidationError(
      `${fieldName} must be at least ${min} characters long`
    );
  }

  if (value.length > max) {
    throw new ValidationError(
      `${fieldName} must not exceed ${max} characters`
    );
  }
}

/**
 * Blog post validation
 */
export interface BlogPostInput {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  slug?: string;
}

export function validateBlogPost(post: BlogPostInput): void {
  const errors: Record<string, string> = {};

  // Title validation
  if (!post.title || post.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (post.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (post.title.length > 200) {
    errors.title = 'Title must not exceed 200 characters';
  }

  // Content validation
  if (!post.content || post.content.trim().length === 0) {
    errors.content = 'Content is required';
  } else if (post.content.length < 10) {
    errors.content = 'Content must be at least 10 characters long';
  } else if (post.content.length > 100000) {
    errors.content = 'Content must not exceed 100,000 characters';
  }

  // Excerpt validation (optional)
  if (post.excerpt && post.excerpt.length > 500) {
    errors.excerpt = 'Excerpt must not exceed 500 characters';
  }

  // Category validation (optional)
  if (post.category && post.category.length > 50) {
    errors.category = 'Category name must not exceed 50 characters';
  }

  // Tags validation (optional)
  if (post.tags) {
    if (post.tags.length > 10) {
      errors.tags = 'Maximum 10 tags allowed';
    }

    post.tags.forEach((tag, index) => {
      if (tag.length > 30) {
        errors[`tag_${index}`] = `Tag "${tag}" must not exceed 30 characters`;
      }
    });
  }

  // Slug validation (optional)
  if (post.slug) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(post.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validate file upload
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): void {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  } = options;

  // Size validation
  if (file.size > maxSize) {
    throw new ValidationError(
      `File size must not exceed ${(maxSize / 1024 / 1024).toFixed(2)}MB`
    );
  }

  // Type validation
  if (!allowedTypes.includes(file.type)) {
    throw new ValidationError(
      `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    );
  }

  // Extension validation
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new ValidationError(
      `File extension ${extension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
    );
  }
}
