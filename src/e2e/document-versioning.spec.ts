import { test, expect } from '@playwright/test';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';

test.describe('Document Versioning', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to document repository
    await page.goto('/client-dashboard/documents');
    await page.waitForLoadState('networkidle');
  });

  test('creates a new document version', async ({ page }) => {
    // Create a temporary test file
    const testFilePath = join(tmpdir(), 'test-document.pdf');
    writeFileSync(testFilePath, 'Test content');

    // Click create version button
    await page.click('button:has-text("Create Version")');

    // Upload new file
    await page.setInputFiles('input[type="file"]', testFilePath);

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
    // Create a large test file (10MB)
    const testFilePath = join(tmpdir(), 'large-test-document.pdf');
    const content = Buffer.alloc(10 * 1024 * 1024, 'a');
    writeFileSync(testFilePath, content);

    // Upload large file
    await page.setInputFiles('input[type="file"]', testFilePath);

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