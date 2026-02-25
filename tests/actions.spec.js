// tests/actions.spec.js

import { test, expect } from '@playwright/test';

test.describe('Learning Actions', () => {

    test('All common actions', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        const input = page.getByPlaceholder('What needs to be done?');

        // ── TYPING ──
        await input.fill('First task');          // clears then types
        await input.press('Enter');

        await input.fill('Second task');
        await input.press('Enter');

        await input.fill('Third task');
        await input.press('Enter');

        // ── CLICKING ──
        // Click the first todo item's checkbox to complete it
        await page.locator('.todo-list li').first().locator('.toggle').click();

        // ── DOUBLE CLICK ──
        // await element.dblclick();

        // ── HOVER ──
        // await element.hover();

        // ── KEYBOARD SHORTCUTS ──
        // await page.keyboard.press('Control+A');  // select all
        // await page.keyboard.press('Escape');     // press escape

        // ── WAITING (Playwright auto-waits, but sometimes you need manual wait) ──
        await page.waitForTimeout(1000);            // wait 1 second (use sparingly)
        await page.waitForSelector('.todo-count'); // wait until element appears

        // ── TAKING SCREENSHOT manually ──
        await page.screenshot({ path: 'my-screenshot.png' });
        console.log('📸 Screenshot saved!');

    });

});