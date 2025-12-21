import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from './config';
import { BlogPost } from '@/types';

const postsCollection = collection(db, 'posts');

// Convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): BlogPost => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    publishedAt: data.publishedAt?.toDate() || undefined,
  } as BlogPost;
};

export const createPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(postsCollection, {
      ...postData,
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.published ? now : null,
      views: 0,
      likes: 0,
    });

    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error as Error };
  }
};

export const updatePost = async (id: string, postData: Partial<BlogPost>) => {
  try {
    const postRef = doc(db, 'posts', id);
    const updateData = {
      ...postData,
      updatedAt: Timestamp.now(),
    };

    if (postData.published && !postData.publishedAt) {
      updateData.publishedAt = Timestamp.now();
    }

    await updateDoc(postRef, updateData);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'posts', id));
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getPost = async (id: string) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', id));
    if (!postDoc.exists()) {
      return { post: null, error: new Error('Post not found') };
    }

    const post = convertTimestamp({ id: postDoc.id, ...postDoc.data() });
    return { post, error: null };
  } catch (error) {
    return { post: null, error: error as Error };
  }
};

export const getPostBySlug = async (slug: string) => {
  try {
    const q = query(postsCollection, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { post: null, error: new Error('Post not found') };
    }

    const postDoc = querySnapshot.docs[0];
    const post = convertTimestamp({ id: postDoc.id, ...postDoc.data() });
    return { post, error: null };
  } catch (error) {
    return { post: null, error: error as Error };
  }
};

export const getPosts = async (options?: {
  published?: boolean;
  category?: string;
  tag?: string;
  limitCount?: number;
  lastDoc?: QueryDocumentSnapshot;
}) => {
  try {
    let q = query(postsCollection);

    if (options?.published !== undefined) {
      q = query(q, where('published', '==', options.published));
    }

    if (options?.category) {
      q = query(q, where('category', '==', options.category));
    }

    if (options?.tag) {
      q = query(q, where('tags', 'array-contains', options.tag));
    }

    q = query(q, orderBy('publishedAt', 'desc'));

    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    if (options?.lastDoc) {
      q = query(q, startAfter(options.lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return {
      posts,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      error: null,
    };
  } catch (error) {
    return { posts: [], lastDoc: null, error: error as Error };
  }
};

export const incrementPostViews = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      views: increment(1),
    });
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const incrementPostLikes = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
    });
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};
