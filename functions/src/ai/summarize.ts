import * as functions from 'firebase-functions';
import OpenAI from 'openai';
import { verifyAdmin } from '../middleware/auth';
import { checkRateLimit } from '../middleware/rateLimit';

/**
 * AI Summarize Function - Generates content summaries using OpenAI
 * @param data - Request data containing the content to summarize
 * @param context - Callable context with auth information
 * @returns Object containing the AI-generated summary
 */
export const aiSummarize = async (
  data: { content: string },
  context: functions.https.CallableContext
) => {
  try {
    // Verify authentication and admin status
    await verifyAdmin(context);

    // Check rate limit
    await checkRateLimit(context.auth!.uid, 'ai_summarize');

    // Validate input
    if (!data.content || typeof data.content !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'Content is required and must be a string');
    }

    if (data.content.length > 10000) {
      throw new functions.https.HttpsError('invalid-argument', 'Content must be 10000 characters or less');
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

    // Generate summary
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise, engaging summaries for blog posts. Keep summaries under 200 words.',
        },
        {
          role: 'user',
          content: `Please summarize the following content:\n\n${data.content}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    return {
      summary: completion.choices[0].message.content,
    };
  } catch (error) {
    // Re-throw HttpsErrors as-is
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // Log unexpected errors
    console.error('AI Summarize error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate summary');
  }
};
