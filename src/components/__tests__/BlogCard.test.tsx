import { render, screen } from '@testing-library/react';
import BlogCard from '../BlogCard';
import { BlogPost } from '@/types';

const mockPost: BlogPost = {
  id: '1',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  content: '<p>This is test content</p>',
  excerpt: 'This is a test excerpt',
  category: 'tech',
  tags: ['test', 'react', 'typescript'],
  published: true,
  publishedAt: new Date('2024-01-15'),
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  authorId: 'user123',
  authorName: 'John Doe',
  readingTime: 5,
  views: 100,
  likes: 10,
};

describe('BlogCard', () => {
  it('renders blog post title', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
  });

  it('renders blog post excerpt', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('tech')).toBeInTheDocument();
  });

  it('renders reading time', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
  });

  it('renders published date', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });
});
