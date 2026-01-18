import * as functions from 'firebase-functions';
import OpenAI from 'openai';
import { verifyAdmin } from '../middleware/auth';
import { checkRateLimit } from '../middleware/rateLimit';

/**
 * AI Suggest Function - Provides content suggestions using OpenAI
 * @param data - Request data containing the prompt
 * @param context - Callable context with auth information
 * @returns Object containing the AI suggestion
 */
export const aiSuggest = async (
  data: { prompt: string },
  context: functions.https.CallableContext
) => {
  try {
    // Verify authentication and admin status
    await verifyAdmin(context);

    // Check rate limit
    await checkRateLimit(context.auth!.uid, 'ai_suggest');

    // Validate input
    if (!data.prompt || typeof data.prompt !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'Prompt is required and must be a string');
    }

    if (data.prompt.length > 1000) {
      throw new functions.https.HttpsError('invalid-argument', 'Prompt must be 1000 characters or less');
    }

    // Get OpenAI API key from environment
    const openaiApiKey = functions.config().openai?.key;
    if (!openaiApiKey) {
      throw new functions.https.HttpsError('failed-precondition', 'OpenAI API key not configured');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Generate suggestion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for a tech and lifestyle blog. Provide creative and engaging content suggestions.',
        },
        {
          role: 'user',
          content: data.prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      suggestion: completion.choices[0].message.content,
    };
  } catch (error) {
    // Re-throw HttpsErrors as-is
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // Log unexpected errors
    console.error('AI Suggest error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate suggestion');
  }
};
