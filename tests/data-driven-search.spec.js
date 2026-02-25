// tests/data-driven-search.spec.js

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');

const searchData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../test-data/search-data.json'), 'utf-8')
);

test.describe('Data-Driven Search Tests', () => {

  searchData.forEach(({ description, searchTerm }) => {

    test(`Search: ${description}`, async ({ page }) => {

      // Step 1: Go to DuckDuckGo
      await page.goto('https://duckduckgo.com');

      // Step 2: Type the search term into the search box
      await page.fill('input[name="q"]', searchTerm);

      // Step 3: Press Enter to search
      await page.press('input[name="q"]', 'Enter');

      // Step 4: Wait for ANY navigation to complete — don't care about exact URL shape
      // waitForLoadState('domcontentloaded') means "wait until the page HTML is loaded"
      // This is more reliable than waitForURL when the URL structure is unpredictable
      await page.waitForLoadState('domcontentloaded');

      // Step 5: Assert q=searchTerm appears somewhere in the URL
      // new RegExp(searchTerm) creates a pattern like /playwright/
      // This matches any URL that contains the word "playwright" — regardless of other params
      // Python equivalent: assert search_term in page.url
      await expect(page).toHaveURL(new RegExp(`q=${searchTerm}`));

    });
  });

});