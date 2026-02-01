import bcrypt from 'bcryptjs';
import { UserService } from '@/lib/database';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    created_at: string;
  };
}

export interface AuthError {
  code: 'VALIDATION_ERROR' | 'INVALID_CREDENTIALS' | 'INTERNAL_ERROR';
  message: string;
}

export const validateLoginInput = (input: LoginRequest): AuthError | null => {
  if (!input.email || !input.password) {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Email and password are required'
    };
  }

  if (typeof input.email !== 'string' || typeof input.password !== 'string') {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Email and password must be strings'
    };
  }

  if (input.email.trim() === '' || input.password.trim() === '') {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Email and password cannot be empty'
    };
  }

  return null;
};

export const authenticateUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const validationError = validateLoginInput({ email, password });
    if (validationError) {
      return {
        success: false,
        message: validationError.message
      };
    }

    const user = await UserService.verifyCredentials(email.trim(), password);

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Internal server error'
    };
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
