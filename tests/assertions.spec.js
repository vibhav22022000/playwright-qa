// tests/assertions.spec.js

import { test, expect } from '@playwright/test';

test.describe('Learning Assertions', () => {

    test('All common assertions', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        const input = page.getByPlaceholder('What needs to be done?');
        await input.fill('Test assertion item');
        await input.press('Enter');

        const todoItem = page.getByText('Test assertion item');

        // ── IS IT VISIBLE? ──
        await expect(todoItem).toBeVisible();

        // ── IS IT HIDDEN? ──
        // await expect(element).toBeHidden();

        // ── DOES IT HAVE TEXT? ──
        await expect(todoItem).toHaveText('Test assertion item');
        await expect(todoItem).toContainText('assertion');  // partial match

        // ── COUNT ──
        const allTodos = page.locator('.todo-list li');
        await expect(allTodos).toHaveCount(1);

        // ── PAGE LEVEL ──
        await expect(page).toHaveURL(/todomvc/);
        await expect(page).toHaveTitle(/TodoMVC/);

        // ── CHECKBOX STATE ──
        const checkbox = page.locator('.toggle').first();
        await expect(checkbox).not.toBeChecked();  // not checked yet

        await checkbox.click();
        await expect(checkbox).toBeChecked();       // now it's checked ✅

        // ── INPUT VALUE ──
        // await expect(input).toHaveValue('some text');

        // ── ELEMENT EXISTS (in DOM but maybe not visible) ──
        // await expect(element).toBeAttached();

        console.log('All assertions passed! ✅');
    });

});