import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyAuth, checkRateLimit } from '@/lib/auth/verifyAuth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication - only admins can use AI features
    const auth = await verifyAuth(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Rate limiting - 20 requests per minute per user
    const rateLimit = checkRateLimit(`ai-suggest-${auth.userId}`, 20, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before making more requests.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetIn),
          },
        }
      );
    }

    const { prompt, context } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Limit input sizes to prevent abuse
    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 2000 characters.' },
        { status: 400 }
      );
    }

    if (context && context.length > 5000) {
      return NextResponse.json(
        { error: 'Context too long. Maximum 5000 characters.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for a tech blog. Help generate creative and engaging content suggestions, improve writing, and provide relevant technical insights.',
        },
        {
          role: 'user',
          content: context ? `Context: ${context}\n\nRequest: ${prompt}` : prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    return NextResponse.json(
      {
        content,
        model: completion.model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestion' },
      { status: 500 }
    );
  }
}
