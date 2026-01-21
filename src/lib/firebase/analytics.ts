import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  increment,
} from 'firebase/firestore';
import { db } from './config';
import { Analytics, UserActivity } from '@/types';
import { getPosts } from './posts';

const analyticsCollection = collection(db, 'analytics');
const userActivityCollection = collection(db, 'userActivity');

// Convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): Analytics => {
  return {
    ...data,
    timestamp: data.timestamp?.toDate() || new Date(),
  } as Analytics;
};

const convertUserActivity = (data: DocumentData): UserActivity => {
  return {
    ...data,
    lastActive: data.lastActive?.toDate() || new Date(),
    joinedAt: data.joinedAt?.toDate() || new Date(),
  } as UserActivity;
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

// Track user activity
export const trackUserActivity = async (
  user: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null },
  event: Analytics['event'],
  postId?: string,
  postTitle?: string
) => {
  try {
    // Log analytics event with user info
    await addDoc(analyticsCollection, {
      event,
      postId,
      postTitle,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userEmail: user.email || '',
      userPhoto: user.photoURL || null,
      timestamp: Timestamp.now(),
    });

    // Update user activity record
    const userActivityRef = doc(db, 'userActivity', user.uid);
    const userActivityDoc = await getDoc(userActivityRef);

    if (userActivityDoc.exists()) {
      // Update existing record
      const updateData: Record<string, unknown> = {
        lastActive: Timestamp.now(),
        userName: user.displayName || 'Anonymous',
        userEmail: user.email || '',
        userPhoto: user.photoURL || null,
      };

      // Increment counters based on event
      if (event === 'view') updateData.totalViews = increment(1);
      if (event === 'like') updateData.totalLikes = increment(1);
      if (event === 'comment') updateData.totalComments = increment(1);

      await updateDoc(userActivityRef, updateData);
    } else {
      // Create new record
      await setDoc(userActivityRef, {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email || '',
        userPhoto: user.photoURL || null,
        lastActive: Timestamp.now(),
        joinedAt: Timestamp.now(),
        totalViews: event === 'view' ? 1 : 0,
        totalLikes: event === 'like' ? 1 : 0,
        totalComments: event === 'comment' ? 1 : 0,
      });
    }

    return { error: null };
  } catch (error) {
    console.error('Error tracking user activity:', error);
    return { error: error as Error };
  }
};

// Get recent activity feed
export const getRecentActivity = async (limitCount: number = 20) => {
  try {
    const q = query(
      analyticsCollection,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return { activities, error: null };
  } catch (error) {
    return { activities: [], error: error as Error };
  }
};

// Get all user activities
export const getUserActivities = async (limitCount: number = 50) => {
  try {
    const q = query(
      userActivityCollection,
      orderBy('lastActive', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc =>
      convertUserActivity({ id: doc.id, ...doc.data() })
    );

    return { users, error: null };
  } catch (error) {
    return { users: [], error: error as Error };
  }
};

// Get activity for a specific user
export const getUserActivityById = async (userId: string) => {
  try {
    const userActivityRef = doc(db, 'userActivity', userId);
    const userActivityDoc = await getDoc(userActivityRef);

    if (!userActivityDoc.exists()) {
      return { userActivity: null, error: new Error('User activity not found') };
    }

    const userActivity = convertUserActivity({ id: userActivityDoc.id, ...userActivityDoc.data() });
    return { userActivity, error: null };
  } catch (error) {
    return { userActivity: null, error: error as Error };
  }
};

// Get user's recent activities
export const getUserRecentActivities = async (userId: string, limitCount: number = 10) => {
  try {
    const q = query(
      analyticsCollection,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return { activities, error: null };
  } catch (error) {
    return { activities: [], error: error as Error };
  }
};
