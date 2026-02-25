// tests/data-driven-api.spec.js

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');

const postsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../test-data/post-data.json'), 'utf-8')
);

test.describe('Data-Driven API Tests — POST /posts', () => {

  for (const { description, payload, expectedStatus } of postsData) {
    test(`POST /posts: ${description}`, async ({ request }) => {
      // 'request' is Playwright's API testing context — same as in your api-basics.spec.js

      const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: payload,  // send the current test row's payload as the request body
      });

      // Assert the status code matches what we expect for this test case
      expect(response.status()).toBe(expectedStatus);

      const body = await response.json(); // parse response body

      // If the post succeeded, the response should echo back our title
      if (expectedStatus === 201) {
        expect(body).toHaveProperty('id'); // every created post gets an id
        console.log(`Created post ID: ${body.id} for test: ${description}`);
      }
    });
  }

});