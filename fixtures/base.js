// fixtures/base.js

const { test: baseTest, expect } = require('@playwright/test');
// Import base test and extend it with our own fixtures
// Like Python class inheritance: class OurTest(PlaywrightTest)

const test = baseTest.extend({

  // FIXTURE 1: loggedInPage
  // Automatically logs in before the test, cleans up after
  loggedInPage: async ({ page }, use) => {
    // --- SETUP ---
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.fill('#username', 'student');
    await page.fill('#password', 'Password123');
    await page.click('#submit');
    await page.waitForURL('**/logged-in-successfully/**');
    // 'use' = yield in Python fixtures — hands page to the test
    await use(page);
    // --- TEARDOWN (runs automatically after test) ---
    // Playwright closes page automatically
  },

  // FIXTURE 2: apiContext
  // Pre-configured API client — like requests.Session() in Python
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    await use(context);
    // Cleanup after test finishes
    await context.dispose();
  },

});

// Export so test files can import from here
module.exports = { test, expect };