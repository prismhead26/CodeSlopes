import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { aiSuggest } from './ai/suggest';
import { aiSummarize } from './ai/summarize';

// Initialize Firebase Admin
admin.initializeApp();

// Export Cloud Functions
export const suggest = functions.https.onCall(aiSuggest);
export const summarize = functions.https.onCall(aiSummarize);
