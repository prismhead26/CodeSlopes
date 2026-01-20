import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { SiteSettings } from '@/types';

const settingsDoc = doc(db, 'settings', 'site');

// Convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData): SiteSettings => {
  return {
    ...data,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as SiteSettings;
};

// Default settings
const defaultSettings: Omit<SiteSettings, 'id'> = {
  siteName: 'CodeSlopes',
  tagline: 'Tech & Lifestyle Blog',
  description: 'A tech and lifestyle blog documenting the journey of a Software and IT Engineer navigating the intersection of code, AI, and Colorado\'s outdoor adventures.',
  logoUrl: '',
  author: {
    name: 'CodeSlopes',
    email: 'contact@codeslopes.com',
    bio: 'Software and IT Engineer passionate about tech, AI, and outdoor adventures.',
    photo: '',
  },
  social: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  },
  seo: {
    metaDescription: 'Tech and lifestyle blog covering software engineering, AI, and Colorado adventures.',
    keywords: ['blog', 'tech', 'AI', 'software engineering', 'Colorado', 'lifestyle'],
  },
  updatedAt: new Date(),
};

export const getSettings = async () => {
  try {
    const settingsSnapshot = await getDoc(settingsDoc);

    if (!settingsSnapshot.exists()) {
      // Create default settings if they don't exist
      await setDoc(settingsDoc, {
        ...defaultSettings,
        updatedAt: Timestamp.now(),
      });

      return {
        settings: { id: 'site', ...defaultSettings },
        error: null,
      };
    }

    const settings = convertTimestamp({
      id: settingsSnapshot.id,
      ...settingsSnapshot.data(),
    });

    return { settings, error: null };
  } catch (error) {
    return { settings: null, error: error as Error };
  }
};

export const updateSettings = async (settingsData: Partial<SiteSettings>) => {
  try {
    const updateData = {
      ...settingsData,
      updatedAt: Timestamp.now(),
    };

    await setDoc(settingsDoc, updateData, { merge: true });
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const resetSettings = async () => {
  try {
    await setDoc(settingsDoc, {
      ...defaultSettings,
      updatedAt: Timestamp.now(),
    });

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};
