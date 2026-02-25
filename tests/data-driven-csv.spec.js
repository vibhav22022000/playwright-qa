// tests/data-driven-csv.spec.js

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');
const { parse } = require('csv-parse/sync'); // csv-parse's synchronous API — like csv.reader in Python

// Read the CSV file
const csvContent = fs.readFileSync(
  path.join(__dirname, '../test-data/login-data.csv'),
  'utf-8'
);

// Parse CSV into an array of objects
// columns: true  → uses the first row as key names (like a header row)
// skip_empty_lines: true  → ignores blank lines
// Python equivalent: csv.DictReader(file)
const loginData = parse(csvContent, {
  columns: true,           // use first row as object keys
  skip_empty_lines: true,  // skip blank rows
});

// CSV gives us strings for everything — "true" and "false" are strings, not booleans
// So we need to convert them: "true" → true, "false" → false
// Python equivalent: value == 'True'
const normalizedData = loginData.map(row => ({
  ...row,                                        // spread all existing fields
  expectSuccess: row.expectSuccess === 'true',  // convert string to real boolean
}));

test.describe('Data-Driven Login from CSV', () => {

  normalizedData.forEach(({ description, username, password, expectSuccess }) => {
    test(`Login: ${description}`, async ({ page }) => {

      await page.goto('https://practicetestautomation.com/practice-test-login/');

      await page.fill('#username', username);
      await page.fill('#password', password);
      await page.click('#submit');

      if (expectSuccess) {
        await expect(page.locator('.post-title')).toHaveText('Logged In Successfully');
      } else {
        await expect(page.locator('#error')).toBeVisible();
      }
    });
  });

});