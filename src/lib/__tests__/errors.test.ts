import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  handleError,
} from '../errors';

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create error with message and code', () => {
      const error = new AppError('Test error', 'TEST_CODE', 500);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('AppError');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Validation failed', {
        email: 'Invalid email',
      });
      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.fields).toEqual({ email: 'Invalid email' });
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error with default message', () => {
      const error = new AuthenticationError();
      expect(error.message).toBe('Authentication required');
      expect(error.code).toBe('AUTH_ERROR');
      expect(error.statusCode).toBe(401);
    });

    it('should create authentication error with custom message', () => {
      const error = new AuthenticationError('Invalid token');
      expect(error.message).toBe('Invalid token');
    });
  });

  describe('AuthorizationError', () => {
    it('should create authorization error', () => {
      const error = new AuthorizationError();
      expect(error.message).toBe('Insufficient permissions');
      expect(error.code).toBe('FORBIDDEN');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error', () => {
      const error = new NotFoundError('User');
      expect(error.message).toBe('User not found');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError();
      expect(error.message).toBe('Network request failed');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.statusCode).toBe(0);
    });
  });

  describe('handleError', () => {
    it('should handle AppError', () => {
      const error = new AppError('Test error', 'TEST_CODE');
      const result = handleError(error);
      expect(result.message).toBe('Test error');
      expect(result.code).toBe('TEST_CODE');
    });

    it('should handle standard Error', () => {
      const error = new Error('Standard error');
      const result = handleError(error);
      expect(result.message).toBe('Standard error');
      expect(result.code).toBe('UNKNOWN_ERROR');
    });

    it('should handle unknown error', () => {
      const result = handleError('string error');
      expect(result.message).toBe('An unexpected error occurred');
      expect(result.code).toBe('UNEXPECTED_ERROR');
    });
  });
});
