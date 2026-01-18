/**
 * Custom Error Classes for Better Error Handling
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

/**
 * Error Handler Utility
 */
export function handleError(error: unknown): { message: string; code?: string } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNEXPECTED_ERROR',
  };
}

/**
 * Async Error Handler for API Routes
 */
export function asyncHandler<T, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<T>
): (...args: TArgs) => Promise<T | { error: string }> {
  return async (...args: TArgs) => {
    try {
      return await fn(...args);
    } catch (error) {
      const { message, code } = handleError(error);
      console.error(`[${code}] ${message}`, error);
      return { error: message };
    }
  };
}

/**
 * Log errors in production to external service
 */
export function logError(error: Error, context?: Record<string, unknown>) {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    if (context) {
      console.error('Context:', context);
    }
    return;
  }

  // In production, send to error tracking service
  // TODO: Integrate with Sentry, LogRocket, or similar
  try {
    // Example: Sentry.captureException(error, { extra: context });
    console.error('Production error:', error, context);
  } catch (loggingError) {
    // Fallback if logging fails
    console.error('Failed to log error:', loggingError);
  }
}
