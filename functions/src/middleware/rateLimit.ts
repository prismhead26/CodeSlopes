import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const RATE_LIMIT = {
  AI_REQUESTS_PER_HOUR: 10,
  AI_REQUESTS_PER_DAY: 50,
};

/**
 * Checks if the user has exceeded rate limits for a specific action
 * @param userId - The user's UID
 * @param action - The action being performed (e.g., 'ai_suggest', 'ai_summarize')
 * @throws HttpsError if rate limit is exceeded
 */
export const checkRateLimit = async (userId: string, action: string): Promise<void> => {
  const db = admin.firestore();
  const now = new Date();
  const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const rateLimitRef = db.collection('rateLimits').doc(`${userId}_${action}`);
  const doc = await rateLimitRef.get();

  if (doc.exists) {
    const data = doc.data()!;

    // Check hourly limit
    if (data.hourStart?.toDate().getTime() === hourStart.getTime()) {
      if (data.hourCount >= RATE_LIMIT.AI_REQUESTS_PER_HOUR) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          `Hourly rate limit exceeded. Maximum ${RATE_LIMIT.AI_REQUESTS_PER_HOUR} requests per hour.`
        );
      }
    }

    // Check daily limit
    if (data.dayStart?.toDate().getTime() === dayStart.getTime()) {
      if (data.dayCount >= RATE_LIMIT.AI_REQUESTS_PER_DAY) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          `Daily rate limit exceeded. Maximum ${RATE_LIMIT.AI_REQUESTS_PER_DAY} requests per day.`
        );
      }
    }
  }

  // Update counters
  await rateLimitRef.set(
    {
      hourStart,
      dayStart,
      hourCount: admin.firestore.FieldValue.increment(1),
      dayCount: admin.firestore.FieldValue.increment(1),
      lastRequest: now,
    },
    { merge: true }
  );
};
