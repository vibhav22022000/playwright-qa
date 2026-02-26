// tests/data-driven-search.spec.js
// Renamed purpose: data-driven login tests using practicetestautomation.com
// This site works reliably in CI — no bot blocking

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');

// Read search-data.json — we reuse this file but change what's in it
const searchData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../test-data/search-data.json'), 'utf-8')
);

test.describe('Data-Driven Tests — Practice Automation Site', () => {

  searchData.forEach(({ description, username, password, expectSuccess }) => {

    test(`Login: ${description}`, async ({ page }) => {

      // Navigate to the login page — same site that works in all your other tests
      await page.goto('https://practicetestautomation.com/practice-test-login/');

      // Fill in credentials from the current test row
      await page.fill('#username', username);
      await page.fill('#password', password);
      await page.click('#submit');

      if (expectSuccess) {
        // Successful login shows this heading
        await expect(page.locator('.post-title')).toHaveText('Logged In Successfully');
      } else {
        // Failed login shows error message
        await expect(page.locator('#error')).toBeVisible();
      }

    });
  });

});