import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from './config';

// Initialize Firebase Functions
const functions = getFunctions(app);

// Connect to emulator in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

/**
 * Calls the AI suggest Cloud Function to get content suggestions
 * @param prompt - The prompt for the AI
 * @returns Promise with the suggestion
 */
export const callAISuggest = async (prompt: string): Promise<string> => {
  const suggestFn = httpsCallable<{ prompt: string }, { suggestion: string }>(functions, 'suggest');

  try {
    const result = await suggestFn({ prompt });
    return result.data.suggestion || '';
  } catch (error) {
    console.error('AI Suggest error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestion';
    throw new Error(errorMessage);
  }
};

/**
 * Calls the AI summarize Cloud Function to generate content summaries
 * @param content - The content to summarize
 * @returns Promise with the summary
 */
export const callAISummarize = async (content: string): Promise<string> => {
  const summarizeFn = httpsCallable<{ content: string }, { summary: string }>(functions, 'summarize');

  try {
    const result = await summarizeFn({ content });
    return result.data.summary || '';
  } catch (error) {
    console.error('AI Summarize error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
    throw new Error(errorMessage);
  }
};

export { functions };
