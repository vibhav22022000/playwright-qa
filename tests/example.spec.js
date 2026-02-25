// tests/example.spec.js

import { test, expect } from '@playwright/test';

// "test.describe" = a GROUP of related tests (like a test suite)
// Think of it as a folder that holds related tests together
test.describe('My First Playwright Suite', () => {

    // "test" = a single test case
    // Always async because every browser action takes time
    test('Page title is correct', async ({ page }) => {
        //                                  ↑
        //                         "page" is Playwright's magic object
        //                         It represents the browser tab
        //                         Playwright injects it automatically

        // NAVIGATE to a URL
        await page.goto('https://playwright.dev');

        // GET the page title
        const title = await page.title();
        console.log('Page title is:', title);

        // ASSERT — this is where QA happens
        // expect() checks if something is true
        // If it's not true → test FAILS with a clear message
        await expect(page).toHaveTitle(/Playwright/);
        //                              ↑
        //                    /Playwright/ is a regex
        //                    means "title must CONTAIN the word Playwright"
    });

});