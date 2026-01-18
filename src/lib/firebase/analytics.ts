import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { Analytics, BlogPost } from '@/types';
import { getPosts } from './posts';

const analyticsCollection = collection(db, 'analytics');

// Convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): Analytics => {
  return {
    ...data,
    timestamp: data.timestamp?.toDate() || new Date(),
  } as Analytics;
};

export const logAnalyticsEvent = async (eventData: Omit<Analytics, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(analyticsCollection, {
      ...eventData,
      timestamp: Timestamp.now(),
    });

    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error as Error };
  }
};

export const getAnalyticsByPostId = async (postId: string, dateRange?: { start: Date; end: Date }) => {
  try {
    let q = query(analyticsCollection, where('postId', '==', postId));

    if (dateRange) {
      q = query(
        q,
        where('timestamp', '>=', Timestamp.fromDate(dateRange.start)),
        where('timestamp', '<=', Timestamp.fromDate(dateRange.end))
      );
    }

    q = query(q, orderBy('timestamp', 'desc'));

    const querySnapshot = await getDocs(q);
    const analytics = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return { analytics, error: null };
  } catch (error) {
    return { analytics: [], error: error as Error };
  }
};

export const getAnalyticsByEvent = async (
  event: 'view' | 'like' | 'comment' | 'share',
  dateRange?: { start: Date; end: Date }
) => {
  try {
    let q = query(analyticsCollection, where('event', '==', event));

    if (dateRange) {
      q = query(
        q,
        where('timestamp', '>=', Timestamp.fromDate(dateRange.start)),
        where('timestamp', '<=', Timestamp.fromDate(dateRange.end))
      );
    }

    q = query(q, orderBy('timestamp', 'desc'));

    const querySnapshot = await getDocs(q);
    const analytics = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return { analytics, error: null };
  } catch (error) {
    return { analytics: [], error: error as Error };
  }
};

export const getTopPostsByViews = async (limitCount: number = 5) => {
  try {
    const { posts, error } = await getPosts({ published: true, limitCount: 100 });
    if (error) return { posts: [], error };

    const sortedPosts = posts.sort((a, b) => b.views - a.views);
    return { posts: sortedPosts.slice(0, limitCount), error: null };
  } catch (error) {
    return { posts: [], error: error as Error };
  }
};

export const getTopPostsByEngagement = async (limitCount: number = 5) => {
  try {
    const { posts, error } = await getPosts({ published: true, limitCount: 100 });
    if (error) return { posts: [], error };

    const sortedPosts = posts.sort((a, b) => {
      const engagementA = a.views + a.likes * 2;
      const engagementB = b.views + b.likes * 2;
      return engagementB - engagementA;
    });

    return { posts: sortedPosts.slice(0, limitCount), error: null };
  } catch (error) {
    return { posts: [], error: error as Error };
  }
};

export const getCategoryAnalytics = async () => {
  try {
    const { posts, error } = await getPosts({ published: true });
    if (error) return { categoryStats: [], error };

    const categoryMap = new Map<string, { name: string; views: number; likes: number; count: number }>();

    posts.forEach(post => {
      const existing = categoryMap.get(post.category) || { name: post.category, views: 0, likes: 0, count: 0 };
      categoryMap.set(post.category, {
        name: post.category,
        views: existing.views + post.views,
        likes: existing.likes + post.likes,
        count: existing.count + 1,
      });
    });

    const categoryStats = Array.from(categoryMap.values());
    return { categoryStats, error: null };
  } catch (error) {
    return { categoryStats: [], error: error as Error };
  }
};

export const getAnalyticsSummary = async (dateRange?: { start: Date; end: Date }) => {
  try {
    const { posts, error } = await getPosts({ published: true });
    if (error) return { summary: null, error };

    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const avgReadingTime = posts.length > 0
      ? Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length)
      : 0;

    const summary = {
      totalPosts: posts.length,
      totalViews,
      totalLikes,
      avgReadingTime,
      publishedPosts: posts.filter(p => p.published).length,
    };

    return { summary, error: null };
  } catch (error) {
    return { summary: null, error: error as Error };
  }
};
