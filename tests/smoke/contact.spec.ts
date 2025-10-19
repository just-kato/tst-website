import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow Smoke Tests', () => {
  test('main contact page renders', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    
    // Should have form fields
    const hasNameField = await page.locator('input[name*="name"], input[placeholder*="name"]').isVisible();
    const hasEmailField = await page.locator('input[type="email"], input[name*="email"]').isVisible();
    const hasMessageField = await page.locator('textarea, input[name*="message"]').isVisible();
    const hasSubmitButton = await page.locator('button[type="submit"], input[type="submit"]').isVisible();
    
    expect(hasNameField && hasEmailField && hasMessageField && hasSubmitButton).toBeTruthy();
  });

  // Business queries test removed - now handled via mailto link in footer

  test('contact form has proper validation', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    const submitButton = await page.locator('button[type="submit"], input[type="submit"]').first();
    await submitButton.click();
    
    // Should show validation errors or prevent submission
    const hasValidationErrors = await page.locator('.error, [role="alert"], .invalid').isVisible().catch(() => false);
    const hasRequiredFields = await page.locator('input[required], textarea[required]').count();
    
    // Either has validation errors or required field attributes
    expect(hasValidationErrors || hasRequiredFields > 0).toBeTruthy();
  });

  test('contact form can be filled out', async ({ page }) => {
    await page.goto('/contact');
    
    // Find and fill form fields
    const nameField = page.locator('input[name*="name"], input[placeholder*="name"]').first();
    const emailField = page.locator('input[type="email"], input[name*="email"]').first();
    const messageField = page.locator('textarea, input[name*="message"]').first();
    
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await messageField.fill('This is a test message');
    
    // Form should accept input without errors
    await expect(nameField).toHaveValue('Test User');
    await expect(emailField).toHaveValue('test@example.com');
    await expect(messageField).toHaveValue('This is a test message');
  });

  test('thank you page renders', async ({ page }) => {
    await page.goto('/thank-you');
    
    await expect(page.getByText(/thank you/i)).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    
    // Should have some next steps or confirmation content
    const hasNextSteps = await page.getByText(/next|contact|hear from/i).isVisible();
    const hasHomeLink = await page.locator('a[href="/"]').isVisible();
    
    expect(hasNextSteps || hasHomeLink).toBeTruthy();
  });

  test('contact pages have proper navigation', async ({ page }) => {
    await page.goto('/contact');
    
    // Should have navigation back to main site
    const hasNavigation = await page.locator('nav').isVisible();
    const hasHomeLink = await page.locator('a[href="/"]').isVisible();
    const hasLogo = await page.locator('[data-testid="logo"], img[alt*="logo"]').isVisible();
    
    expect(hasNavigation || hasHomeLink || hasLogo).toBeTruthy();
  });
});