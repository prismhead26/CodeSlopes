import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function initializeAdmin() {
  // Check if already initialized
  if (adminApp) return;

  // Check if required env vars are present
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin SDK credentials not configured');
    return;
  }

  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  adminDb = getFirestore(adminApp);
  adminAuth = getAuth(adminApp);
}

// Lazy getters that initialize on first use
export function getAdminApp(): App {
  initializeAdmin();
  if (!adminApp) throw new Error('Firebase Admin not initialized');
  return adminApp;
}

export function getAdminDb(): Firestore {
  initializeAdmin();
  if (!adminDb) throw new Error('Firebase Admin not initialized');
  return adminDb;
}

export function getAdminAuth(): Auth {
  initializeAdmin();
  if (!adminAuth) throw new Error('Firebase Admin not initialized');
  return adminAuth;
}

// For backwards compatibility - these will throw if accessed before env vars are ready
export { adminApp, adminDb, adminAuth };
