import { test, expect } from '@playwright/test';

test.describe('Document Versioning', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to document repository
    await page.goto('/client-dashboard/documents');
    await page.waitForLoadState('networkidle');
  });

  test('creates a new document version', async ({ page }) => {
    // Click create version button
    await page.click('button:has-text("Create Version")');

    // Upload new file
    await page.setInputFiles('input[type="file"]', 'path/to/test-document.pdf');

    // Wait for upload to complete
    await expect(page.locator('.toast-success')).toBeVisible();

    // Verify new version appears in list
    await expect(page.locator('.version-list')).toContainText('v2');
  });

  test('switches between versions', async ({ page }) => {
    // Click on previous version
    await page.click('button:has-text("v1")');

    // Verify version switch
    await expect(page.locator('.current-version')).toContainText('v1');

    // Check diff viewer appears
    await expect(page.locator('.diff-viewer')).toBeVisible();
  });

  test('reverts to previous version', async ({ page }) => {
    // Click revert button
    await page.click('button:has-text("Revert")');

    // Confirm revert
    await page.click('button:has-text("Confirm")');

    // Verify revert success
    await expect(page.locator('.toast-success')).toContainText('reverted');
    await expect(page.locator('.current-version')).toContainText('v1');
  });

  test('handles large documents', async ({ page }) => {
    // Upload large test file (10MB)
    const largeFile = await generateLargeTestFile(10 * 1024 * 1024);
    await page.setInputFiles('input[type="file"]', largeFile);

    // Verify upload completes within reasonable time
    const startTime = Date.now();
    await expect(page.locator('.toast-success')).toBeVisible();
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(30000); // Should complete within 30 seconds

    // Verify version switching remains responsive
    await page.click('button:has-text("v1")');
    await expect(page.locator('.diff-viewer')).toBeVisible();
    expect(Date.now() - startTime).toBeLessThan(1000); // Should switch within 1 second
  });
});

async function generateLargeTestFile(size: number): Promise<Blob> {
  const content = new Array(size).fill('a').join('');
  return new Blob([content], { type: 'application/pdf' });
}