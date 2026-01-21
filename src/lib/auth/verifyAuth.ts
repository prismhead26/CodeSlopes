import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export interface AuthResult {
  authenticated: boolean;
  isAdmin: boolean;
  userId?: string;
  error?: string;
}

/**
 * Verify Firebase authentication from request headers
 * Expects: Authorization: Bearer <idToken>
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, isAdmin: false, error: 'Missing or invalid authorization header' };
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      return { authenticated: false, isAdmin: false, error: 'Missing token' };
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user is admin
    const adminDoc = await adminDb.collection('admins').doc(userId).get();
    const isAdmin = adminDoc.exists;

    return {
      authenticated: true,
      isAdmin,
      userId,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false, isAdmin: false, error: 'Invalid or expired token' };
  }
}

/**
 * Simple rate limiting using in-memory store
 * For production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetIn: record.resetTime - now };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute
