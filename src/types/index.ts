export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string | null;
  category: string;
  categoryName?: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  authorPhoto?: string | null;
  readingTime: number; // in minutes
  views: number;
  likes: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto?: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // for nested comments
  likes: number;
  approved: boolean; // for comment moderation
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postCount: number;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: Date;
}

export interface AIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface Analytics {
  id?: string;
  postId?: string;
  postTitle?: string;
  event: 'view' | 'like' | 'comment' | 'share' | 'login' | 'signup';
  timestamp: Date;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhoto?: string;
  metadata?: Record<string, unknown>;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  lastActive: Date;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  joinedAt: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string | null;
  category: 'networking' | 'linux' | 'windows' | 'security' | 'devops' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  authorPhoto?: string | null;
  readingTime: number;
  views: number;
  likes: number;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  author: {
    name: string;
    email: string;
    bio: string;
    photo?: string;
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  seo: {
    metaDescription: string;
    keywords: string[];
  };
  updatedAt: Date;
}
