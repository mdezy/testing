import { validateLoginInput, authenticateUser, hashPassword, verifyPassword } from '../auth.service';

jest.mock('@/lib/database', () => ({
  UserService: {
    verifyCredentials: jest.fn()
  }
}));

const { UserService } = require('@/lib/database');

describe('AuthService - Unit Tests', () => {
  beforeEach(() => {
    UserService.verifyCredentials.mockReset();
  });
  describe('validateLoginInput', () => {
    it('should pass validation with valid input', () => {
      const result = validateLoginInput({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toBeNull();
    });

    it('should fail validation with missing email', () => {
      const result = validateLoginInput({
        email: '',
        password: 'password123'
      });

      expect(result).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required'
      });
    });

    it('should fail validation with missing password', () => {
      const result = validateLoginInput({
        email: 'test@example.com',
        password: ''
      });

      expect(result).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required'
      });
    });

    it('should fail validation with non-string values', () => {
      const result = validateLoginInput({
        email: 123 as any,
        password: 'password123'
      });

      expect(result).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Email and password must be strings'
      });
    });

    it('should fail validation with whitespace-only values', () => {
      const result = validateLoginInput({
        email: '   ',
        password: 'password123'
      });

      expect(result).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Email and password cannot be empty'
      });
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z'
      };

      UserService.verifyCredentials.mockResolvedValue(mockUser as any);

      const result = await authenticateUser('test@example.com', 'testpassword');

      expect(UserService.verifyCredentials).toHaveBeenCalledWith('test@example.com', 'testpassword');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful');
      expect(result.user).toEqual(mockUser);
    });

    it('should reject invalid credentials', async () => {
      UserService.verifyCredentials.mockResolvedValue(null);

      const result = await authenticateUser('test@example.com', 'wrongpassword');

      expect(UserService.verifyCredentials).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email or password');
      expect(result.user).toBeUndefined();
    });

    it('should reject non-existent user', async () => {
      UserService.verifyCredentials.mockResolvedValue(null);

      const result = await authenticateUser('nonexistent@example.com', 'password');

      expect(UserService.verifyCredentials).toHaveBeenCalledWith('nonexistent@example.com', 'password');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email or password');
      expect(result.user).toBeUndefined();
    });

    it('should handle validation errors', async () => {
      const result = await authenticateUser('', 'password');

      expect(UserService.verifyCredentials).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email and password are required');
      expect(result.user).toBeUndefined();
    });

    it('should trim whitespace from email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z'
      };

      UserService.verifyCredentials.mockResolvedValue(mockUser as any);

      const result = await authenticateUser('  test@example.com  ', 'testpassword');

      expect(UserService.verifyCredentials).toHaveBeenCalledWith('test@example.com', 'testpassword');
      expect(result.success).toBe(true);
    });
  });
});
