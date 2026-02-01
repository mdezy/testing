import { test, expect } from '@playwright/test';

test.describe('Login Flow - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form elements', async ({ page }) => {
    await expect(page.getByText('Sign in to your account')).toBeVisible();

    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Remember me')).toBeVisible();
    await expect(page.getByText('Forgot your password?')).toBeVisible();
  });

  test('should show validation for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    const emailInput = page.getByLabel('Email address');
    const passwordInput = page.getByLabel('Password');

    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should handle successful login', async ({ page }) => {
    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('admin123');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeVisible();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/invalid email or password/i)).not.toBeVisible();
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('wrongpassword');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should handle non-existent user', async ({ page }) => {
    await page.getByLabel('Email address').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('password123');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should toggle remember me checkbox', async ({ page }) => {
    const rememberMeCheckbox = page.getByLabel('Remember me');

    await expect(rememberMeCheckbox).not.toBeChecked();

    await rememberMeCheckbox.check();
    await expect(rememberMeCheckbox).toBeChecked();

    await rememberMeCheckbox.uncheck();
    await expect(rememberMeCheckbox).not.toBeChecked();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Email address')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Password')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Remember me')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeFocused();
  });

  test('should submit form with Enter key in password field', async ({ page }) => {
    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('admin123');

    await page.getByLabel('Password').focus();
    await page.keyboard.press('Enter');

    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeVisible();

    await page.waitForTimeout(2000);
  });

  test('should have correct input types and attributes', async ({ page }) => {
    const emailInput = page.getByLabel('Email address');
    const passwordInput = page.getByLabel('Password');

    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');

    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/login', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Internal server error'
        })
      });
    });

    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('admin123');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('An error occurred. Please try again.')).toBeVisible();

    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.route('**/api/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          user: { id: 1, email: 'admin@example.com', created_at: '2023-01-01' }
        })
      });
    });

    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('admin123');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeDisabled();

    await page.waitForTimeout(2500);

    await expect(page.getByRole('button', { name: 'Signing in...' })).not.toBeVisible();
  });
});
