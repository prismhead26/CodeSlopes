import { NextRequest, NextResponse } from 'next/server';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

// Minimum score threshold (0.0 to 1.0, higher is more likely human)
const MIN_SCORE_THRESHOLD = 0.5;

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Skip verification if secret key not configured
    if (!RECAPTCHA_SECRET_KEY) {
      return NextResponse.json({ verified: true, skipped: true });
    }

    const { token, action } = await request.json();

    if (!token) {
      return NextResponse.json(
        { verified: false, error: 'Missing reCAPTCHA token' },
        { status: 400 }
      );
    }

    // Verify token with Google
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.warn('reCAPTCHA verification failed:', data['error-codes']);
      return NextResponse.json(
        { verified: false, error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Check action matches (prevents token reuse across different actions)
    if (action && data.action !== action) {
      console.warn(`reCAPTCHA action mismatch: expected ${action}, got ${data.action}`);
      return NextResponse.json(
        { verified: false, error: 'Action mismatch' },
        { status: 400 }
      );
    }

    // Check score threshold
    if (data.score !== undefined && data.score < MIN_SCORE_THRESHOLD) {
      console.warn(`reCAPTCHA score too low: ${data.score}`);
      return NextResponse.json(
        { verified: false, error: 'Suspicious activity detected' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      score: data.score,
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { verified: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
