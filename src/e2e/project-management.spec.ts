import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Add auth setup here
  });

  test('creates and manages project tasks', async ({ page }) => {
    await test.step('Create new task', async () => {
      await page.click('button:text("New Task")');
      await page.fill('[name="title"]', 'Test Task');
      await page.click('button:text("Create")');
      await expect(page.locator('text=Test Task')).toBeVisible();
    });

    await test.step('Update task status', async () => {
      await page.dragAndDrop('[data-testid="task-card"]', '[data-testid="in-progress-column"]');
      await expect(page.locator('text=In Progress')).toBeVisible();
    });
  });

  test('manages project milestones', async ({ page }) => {
    await test.step('Create milestone', async () => {
      await page.click('button:text("Add Milestone")');
      await page.fill('[name="title"]', 'Test Milestone');
      await page.click('button:text("Save")');
      await expect(page.locator('text=Test Milestone')).toBeVisible();
    });

    await test.step('Track milestone progress', async () => {
      await page.click('[data-testid="milestone-progress"]');
      await expect(page.locator('text=Progress Updated')).toBeVisible();
    });
  });
});