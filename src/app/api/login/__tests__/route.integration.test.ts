import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('Login API Route - Integration Tests', () => {
  describe('POST /api/login - Integration', () => {
    it('should authenticate - valid credentials', async () => {
      const request = new NextRequest('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Test Browser)',
          'X-Forwarded-For': '203.0.113.1'
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin123'
        })
      });

      const startTime = Date.now();
      const response = await POST(request);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Login successful');
      expect(data.user.email).toBe('admin@example.com');
      expect(data.user.id).toBeDefined();
      expect(data.user.created_at).toBeDefined();

      expect(responseTime).toBeLessThan(2000);
    });

    it('should reject - invalid credentials', async () => {
      const request = new NextRequest('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'wrongpassword'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Invalid email or password');
      expect(data.user).toBeUndefined();
    });

    it('should reject - non-existent user', async () => {
      const request = new NextRequest('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Invalid email or password');
      expect(data.user).toBeUndefined();
    });

    it('should handle validation errors', async () => {
      const testCases = [
        { email: '', password: 'password123' },
        { email: 'test@example.com', password: '' },
        { email: '', password: '' },
        { email: 'test@example.com' },
        { password: 'password123' }
      ];

      for (const testCase of testCases) {
        const request = new NextRequest('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase)
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Email and password are required');
        expect(data.user).toBeUndefined();
      }
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 3 }, (_, i) =>
        new NextRequest('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@example.com',
            password: 'admin123'
          })
        })
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests.map(req => POST(req)));
      const endTime = Date.now();

      expect(responses).toHaveLength(3);
      for (const response of responses) {
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
      }

      expect(endTime - startTime).toBeLessThan(3000);
    });

    it('should handle different content types', async () => {
      const request = new NextRequest('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'not json'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Internal server error');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"incomplete": json'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Internal server error');
    });
  });
});
