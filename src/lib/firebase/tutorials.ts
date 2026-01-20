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
import { Tutorial } from '@/types';

const tutorialsCollection = collection(db, 'tutorials');

// Convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): Tutorial => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    publishedAt: data.publishedAt?.toDate() || undefined,
  } as Tutorial;
};

export const createTutorial = async (tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(tutorialsCollection, {
      ...tutorialData,
      createdAt: now,
      updatedAt: now,
      publishedAt: tutorialData.published ? now : null,
      views: 0,
      likes: 0,
    });

    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error as Error };
  }
};

export const updateTutorial = async (id: string, tutorialData: Partial<Tutorial>) => {
  try {
    const tutorialRef = doc(db, 'tutorials', id);
    const updateData: DocumentData = {
      ...tutorialData,
      updatedAt: Timestamp.now(),
    };

    if (tutorialData.published && !tutorialData.publishedAt) {
      updateData.publishedAt = Timestamp.now();
    }

    await updateDoc(tutorialRef, updateData);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const deleteTutorial = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'tutorials', id));
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getTutorial = async (id: string) => {
  try {
    const tutorialDoc = await getDoc(doc(db, 'tutorials', id));
    if (!tutorialDoc.exists()) {
      return { tutorial: null, error: new Error('Tutorial not found') };
    }

    const tutorial = convertTimestamp({ id: tutorialDoc.id, ...tutorialDoc.data() });
    return { tutorial, error: null };
  } catch (error) {
    return { tutorial: null, error: error as Error };
  }
};

export const getTutorialBySlug = async (slug: string) => {
  try {
    const q = query(tutorialsCollection, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { tutorial: null, error: new Error('Tutorial not found') };
    }

    const tutorialDoc = querySnapshot.docs[0];
    const tutorial = convertTimestamp({ id: tutorialDoc.id, ...tutorialDoc.data() });
    return { tutorial, error: null };
  } catch (error) {
    return { tutorial: null, error: error as Error };
  }
};

export const getTutorials = async (options?: {
  published?: boolean;
  category?: string;
  difficulty?: string;
  tag?: string;
  limitCount?: number;
  lastDoc?: QueryDocumentSnapshot;
}) => {
  try {
    let q = query(tutorialsCollection);

    if (options?.published !== undefined) {
      q = query(q, where('published', '==', options.published));
    }

    if (options?.category) {
      q = query(q, where('category', '==', options.category));
    }

    if (options?.difficulty) {
      q = query(q, where('difficulty', '==', options.difficulty));
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
    const tutorials = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return {
      tutorials,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      error: null,
    };
  } catch (error) {
    return { tutorials: [], lastDoc: null, error: error as Error };
  }
};

export const incrementTutorialViews = async (tutorialId: string) => {
  try {
    const tutorialRef = doc(db, 'tutorials', tutorialId);
    await updateDoc(tutorialRef, {
      views: increment(1),
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
