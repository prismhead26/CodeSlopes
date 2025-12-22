import {
  validateEmail,
  validateUrl,
  validatePassword,
  validateBlogPost,
  sanitizeHtml,
} from '../validation';
import { ValidationError } from '../errors';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
      expect(validateUrl('https://sub.domain.example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('//invalid')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should require minimum length', () => {
      const result = validatePassword('Short1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should require uppercase letter', () => {
      const result = validatePassword('lowercase123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should require lowercase letter', () => {
      const result = validatePassword('UPPERCASE123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should require number', () => {
      const result = validatePassword('NoNumbers');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });
  });

  describe('validateBlogPost', () => {
    const validPost = {
      title: 'Test Blog Post',
      content: 'This is a valid blog post content with sufficient length.',
      excerpt: 'Short excerpt',
      category: 'Tech',
      tags: ['javascript', 'testing'],
      slug: 'test-blog-post',
    };

    it('should validate a correct blog post', () => {
      expect(() => validateBlogPost(validPost)).not.toThrow();
    });

    it('should reject post without title', () => {
      const invalidPost = { ...validPost, title: '' };
      expect(() => validateBlogPost(invalidPost)).toThrow(ValidationError);
    });

    it('should reject post with title too short', () => {
      const invalidPost = { ...validPost, title: 'AB' };
      expect(() => validateBlogPost(invalidPost)).toThrow(ValidationError);
    });

    it('should reject post without content', () => {
      const invalidPost = { ...validPost, content: '' };
      expect(() => validateBlogPost(invalidPost)).toThrow(ValidationError);
    });

    it('should reject post with too many tags', () => {
      const invalidPost = {
        ...validPost,
        tags: Array(15).fill('tag'),
      };
      expect(() => validateBlogPost(invalidPost)).toThrow(ValidationError);
    });

    it('should reject post with invalid slug', () => {
      const invalidPost = { ...validPost, slug: 'Invalid Slug!' };
      expect(() => validateBlogPost(invalidPost)).toThrow(ValidationError);
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<p>Safe content</p><script>alert("XSS")</script>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Safe content</p>');
    });

    it('should remove javascript: protocol', () => {
      const html = '<a href="javascript:alert(\'XSS\')">Link</a>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('javascript:');
    });

    it('should remove inline event handlers', () => {
      const html = '<button onclick="alert(\'XSS\')">Click</button>';
      const sanitized = sanitizeHtml(html);
      expect(sanitized).not.toContain('onclick=');
    });
  });
});
