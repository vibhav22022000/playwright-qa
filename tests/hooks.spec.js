// tests/hooks.spec.js

import { test, expect } from '@playwright/test';

test.describe('Learning Hooks', () => {

    // ── beforeAll: runs ONCE before ALL tests in this describe block ──
    // Like Python's setUpClass
    test.beforeAll(async () => {
        console.log('🚀 Starting test suite — runs once');
        // Good for: creating test data, setting up DB connections
    });

    // ── afterAll: runs ONCE after ALL tests finish ──
    test.afterAll(async () => {
        console.log('🏁 Test suite done — runs once');
        // Good for: cleaning up test data, closing DB connections
    });

    // ── beforeEach: runs before EVERY single test ──
    // Like Python's setUp
    test.beforeEach(async ({ page }) => {
        console.log('▶ Setting up for next test...');
        await page.goto('https://demo.playwright.dev/todomvc');
        // Every test starts fresh on the todo page
    });

    // ── afterEach: runs after EVERY single test ──
    test.afterEach(async ({ page }) => {
        console.log('🧹 Cleaning up after test...');
        // Good for: taking screenshots, clearing cookies, resetting state
    });

    // Now the actual tests — each one starts fresh because of beforeEach
    test('Can add a todo item', async ({ page }) => {
        await page.getByPlaceholder('What needs to be done?').fill('Task 1');
        await page.keyboard.press('Enter');
        await expect(page.getByText('Task 1')).toBeVisible();
    });

    test('Can complete a todo item', async ({ page }) => {
        const input = page.getByPlaceholder('What needs to be done?');
        await input.fill('Task to complete');
        await input.press('Enter');
        await page.locator('.toggle').click();
        await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
    });

});