// tests/fixtures.spec.js

const { test, expect } = require('../fixtures/base.js');
// Importing from OUR fixtures file, not from '@playwright/test'
// This gives us access to loggedInPage and apiContext fixtures

test.describe('Fixture Tests', () => {

  // TEST 1: loggedInPage fixture handles login automatically
  // No beforeEach, no login code here — fixture does it all
  test('logged in page shows welcome content @smoke', async ({ loggedInPage }) => {
    await expect(loggedInPage.locator('.post-title'))
      .toHaveText('Logged In Successfully');
  });

  // TEST 2: Same fixture, different assertion — fresh login for each test
  test('logged in page has correct URL @regression', async ({ loggedInPage }) => {
    await expect(loggedInPage).toHaveURL(/logged-in-successfully/);
  });

  // TEST 3: apiContext fixture gives pre-configured API client
  test('API returns list of posts @smoke @api', async ({ apiContext }) => {
    const response = await apiContext.get('/posts');
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts.length).toBe(100);
  });

  // TEST 4: Both fixtures together — UI and API in one test
  test('UI and API work together @regression', async ({ loggedInPage, apiContext }) => {
    const response = await apiContext.get('/posts/1');
    const post = await response.json();

    // API check
    expect(post).toHaveProperty('title');
    expect(post.id).toBe(1);

    // UI check
    await expect(loggedInPage).toHaveURL(/logged-in-successfully/);
    console.log(`API post title: ${post.title}`);
  });

});