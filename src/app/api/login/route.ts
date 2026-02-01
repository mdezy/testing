import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/services/auth.service';

function createJsonResponse(data: any, status: number) {
  return NextResponse.json(data, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return createJsonResponse(
        { success: false, message: 'Invalid request body' },
        400
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return createJsonResponse(
        { success: false, message: 'Email and password are required' },
        400
      );
    }

    const result = await authenticateUser(email, password);

    const statusCode = result.success ? 200 :
      result.message.includes('required') ? 400 : 401;

    return createJsonResponse(result, statusCode);

  } catch (error) {
    console.error('Login API error:', error);
    return createJsonResponse(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ?
          (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      500
    );
  }
}
