import { AIRequest, AIResponse } from '@/types';

export const generateAISuggestion = async (
  prompt: string,
  context?: string
): Promise<AIResponse> => {
  try {
    const response = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI suggestion');
    }

    return await response.json();
  } catch (error) {
    console.error('AI suggestion error:', error);
    throw error;
  }
};

export const summarizeContent = async (content: string): Promise<AIResponse> => {
  try {
    const response = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to summarize content');
    }

    return await response.json();
  } catch (error) {
    console.error('AI summarization error:', error);
    throw error;
  }
};

export const improveWriting = async (text: string): Promise<AIResponse> => {
  return generateAISuggestion(
    'Improve the following text for better clarity, engagement, and flow. Keep the same meaning but make it more polished.',
    text
  );
};

export const generateTitle = async (content: string): Promise<AIResponse> => {
  return generateAISuggestion(
    'Based on the following content, suggest 3 compelling blog post titles that are SEO-friendly and engaging.',
    content
  );
};

export const generateTags = async (content: string): Promise<AIResponse> => {
  return generateAISuggestion(
    'Based on the following content, suggest relevant tags (keywords) for this blog post. Return them as a comma-separated list.',
    content
  );
};
