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
    const rateLimit = checkRateLimit(`ai-summarize-${auth.userId}`, 20, 60000);

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

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Limit input size to prevent abuse
    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Content too long. Maximum 50000 characters.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that creates concise, engaging summaries of blog posts. Create a summary that captures the main points in 2-3 sentences.',
        },
        {
          role: 'user',
          content: `Please summarize this blog post content:\n\n${content}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json(
      {
        content: summary,
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
    console.error('AI summarization error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
