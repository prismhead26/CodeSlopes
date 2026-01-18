import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Verifies that the user is authenticated and is an admin
 * @param context - The callable context from the function call
 * @returns true if user is an admin
 * @throws HttpsError if user is not authenticated or not an admin
 */
export const verifyAdmin = async (context: functions.https.CallableContext): Promise<boolean> => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Check if user is an admin
  const db = admin.firestore();
  const adminDoc = await db.collection('admins').doc(context.auth.uid).get();

  if (!adminDoc.exists) {
    throw new functions.https.HttpsError('permission-denied', 'User is not an admin');
  }

  return true;
};
