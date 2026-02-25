import { test, expect } from "@playwright/test";
import { describe } from "node:test";

test.describe("API Basics - GET Request", () => {
  test("GET all posts - check status and structure", async ({ request }) => {
    // Send a GET request to the API endpoint
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts",
    );
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse the response body as JSON
    const posts = await response.json();

    // Assert Body
    expect(posts).toHaveLength(100); // Expecting 100 posts from the API
    expect(Array.isArray(posts)).toBeTruthy(); // The response should be an array

    // Check the structure of the first post
    const firstPost = posts[0];
    expect(firstPost).toHaveProperty("id");
    expect(firstPost).toHaveProperty("title");
    expect(firstPost).toHaveProperty("body");
    expect(firstPost).toHaveProperty("userId");

    console.log("First Post:", firstPost);
  });

  test("GET single post - check status and content", async ({ request }) => {
    // Send a GET request to retrieve a single post
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/1",
    );
    expect(response.status()).toBe(200);
    const post = await response.json();

    // Assert the content of the post
    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(typeof post.title).toBe("string");
    expect(post.title.length).toBeGreaterThan(0); // Title should not be empty

    console.log("Single Post:", post);
  });

  test("GET non-existent post - check 404 status", async ({ request }) => {
    // Send a GET request for a non-existent post
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/99999",
    );
    // Assert that the response status is 404 (Not Found)
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy(); // ok() should be false for 404 responses

    console.log("Status for non-existent post:", response.status());
  });
});
