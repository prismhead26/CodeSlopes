import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });

    // Create user document in Firestore
    const userData: Omit<User, 'uid'> = {
      email: result.user.email!,
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', result.user.uid), userData);

    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Create or update user document
    const userRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData: Omit<User, 'uid'> = {
        email: result.user.email!,
        displayName: result.user.displayName || 'Anonymous',
        photoURL: result.user.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(userRef, userData);
    }

    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const checkIsAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
