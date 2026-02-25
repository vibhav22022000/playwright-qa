// tests/locators.spec.js
// Create this new file

import { test, expect } from '@playwright/test';

test.describe('Learning Locators', () => {

    test('Different ways to find elements', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        // ── WAY 1: By placeholder text ──
        const input = page.getByPlaceholder('What needs to be done?');

        // ── WAY 2: By role (most recommended — like a real user would) ──
        const heading = page.getByRole('heading', { name: 'todos' });

        // ── WAY 3: By text content ──
        // const btn = page.getByText('Clear completed');

        // ── WAY 4: By test ID (best for automation — ask devs to add these) ──
        // const el = page.getByTestId('submit-button');

        // ── WAY 5: By CSS selector (old way, works but brittle) ──
        // const el = page.locator('.todo-input');

        // ── WAY 6: By XPath (avoid if possible) ──
        // const el = page.locator('//input[@class="new-todo"]');

        // GOLDEN RULE for locator priority:
        // getByRole > getByPlaceholder > getByText > getByTestId > CSS > XPath

        // Now USE the locator
        await input.fill('Buy groceries');       // type into input
        await input.press('Enter');              // press Enter key

        // Verify the item appeared
        await expect(page.getByText('Buy groceries')).toBeVisible();
    });

});