// tests/data-driven-search.spec.js

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');

const searchData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../test-data/search-data.json'), 'utf-8')
);

test.describe('Data-Driven Search Tests', () => {

  searchData.forEach(({ description, searchTerm, expectedTitle }) => {

    test(`Search: ${description}`, async ({ page }) => {

      // books.toscrape.com is built for automation practice
      // It never blocks bots — perfect for CI environments
      await page.goto('https://books.toscrape.com');

      // Find the search input and type the search term
      // The search box has name="q" on this site too
      await page.fill('input[name="q"]', searchTerm);

      // Submit the search form
      await page.press('input[name="q"]', 'Enter');

      // Wait for results page to load
      await page.waitForLoadState('domcontentloaded');

      // Assert the URL contains the search term
      // books.toscrape.com search URL looks like:
      // https://books.toscrape.com/catalogue/search.html?q=travel
      await expect(page).toHaveURL(new RegExp(searchTerm));

    });
  });

});