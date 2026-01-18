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
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { Category } from '@/types';

const categoriesCollection = collection(db, 'categories');

// Convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): Category => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Category;
};

export const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'postCount'>) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(categoriesCollection, {
      ...categoryData,
      createdAt: now,
      postCount: 0,
    });

    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error as Error };
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>) => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, categoryData);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'categories', id));
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getCategory = async (id: string) => {
  try {
    const categoryDoc = await getDoc(doc(db, 'categories', id));
    if (!categoryDoc.exists()) {
      return { category: null, error: new Error('Category not found') };
    }

    const category = convertTimestamp({ id: categoryDoc.id, ...categoryDoc.data() });
    return { category, error: null };
  } catch (error) {
    return { category: null, error: error as Error };
  }
};

export const getCategoryBySlug = async (slug: string) => {
  try {
    const q = query(categoriesCollection, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { category: null, error: new Error('Category not found') };
    }

    const categoryDoc = querySnapshot.docs[0];
    const category = convertTimestamp({ id: categoryDoc.id, ...categoryDoc.data() });
    return { category, error: null };
  } catch (error) {
    return { category: null, error: error as Error };
  }
};

export const getCategories = async () => {
  try {
    const q = query(categoriesCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return { categories, error: null };
  } catch (error) {
    return { categories: [], error: error as Error };
  }
};

export const updateCategoryPostCount = async (categoryId: string, count: number) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, { postCount: count });
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};
