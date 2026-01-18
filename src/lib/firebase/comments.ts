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
  increment,
} from 'firebase/firestore';
import { db } from './config';
import { Comment } from '@/types';

const commentsCollection = collection(db, 'comments');

// Convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): Comment => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Comment;
};

export const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(commentsCollection, {
      ...commentData,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      approved: false, // Comments start as unapproved
    });

    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error as Error };
  }
};

export const updateComment = async (id: string, commentData: Partial<Comment>) => {
  try {
    const commentRef = doc(db, 'comments', id);
    const updateData: DocumentData = {
      ...commentData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(commentRef, updateData);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const deleteComment = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'comments', id));
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getComment = async (id: string) => {
  try {
    const commentDoc = await getDoc(doc(db, 'comments', id));
    if (!commentDoc.exists()) {
      return { comment: null, error: new Error('Comment not found') };
    }

    const comment = convertTimestamp({ id: commentDoc.id, ...commentDoc.data() });
    return { comment, error: null };
  } catch (error) {
    return { comment: null, error: error as Error };
  }
};

export const getComments = async (options?: {
  postId?: string;
  userId?: string;
  approved?: boolean;
  limitCount?: number;
}) => {
  try {
    let q = query(commentsCollection);

    if (options?.postId) {
      q = query(q, where('postId', '==', options.postId));
    }

    if (options?.userId) {
      q = query(q, where('userId', '==', options.userId));
    }

    if (options?.approved !== undefined) {
      q = query(q, where('approved', '==', options.approved));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc =>
      convertTimestamp({ id: doc.id, ...doc.data() })
    );

    return { comments, error: null };
  } catch (error) {
    return { comments: [], error: error as Error };
  }
};

export const getCommentsByPost = async (postId: string) => {
  return getComments({ postId, approved: true });
};

export const approveComment = async (id: string) => {
  return updateComment(id, { approved: true });
};

export const incrementCommentLikes = async (commentId: string) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      likes: increment(1),
    });
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};
