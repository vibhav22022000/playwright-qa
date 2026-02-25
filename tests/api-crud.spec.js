// tests/api-crud.spec.js

import { test, expect } from "@playwright/test";

test.describe("API CRUD Operations", () => {
  // ── CREATE ──
  test("POST — Create a new post", async ({ request }) => {
    const newPost = {
      title: "Playwright API Testing",
      body: "This post was created by an automated test",
      userId: 1,
    };

    const response = await request.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        data: newPost, // request body — like Postman's Body tab
        headers: {
          "Content-Type": "application/json", // tell server we're sending JSON
        },
      },
    );

    // POST should return 201 Created
    expect(response.status()).toBe(201);

    const created = await response.json();

    // Server returns the created object with a new ID
    expect(created.id).toBeDefined(); // id should exist
    expect(created.title).toBe(newPost.title);
    expect(created.body).toBe(newPost.body);
    expect(created.userId).toBe(newPost.userId);

    console.log("Created post with ID:", created.id);
  });

  // ── UPDATE ──
  test("PUT — Update an existing post", async ({ request }) => {
    const updatedPost = {
      id: 1,
      title: "Updated Title",
      body: "Updated body content",
      userId: 1,
    };

    const response = await request.put(
      "https://jsonplaceholder.typicode.com/posts/1",
      { data: updatedPost },
    );

    expect(response.status()).toBe(200);

    const updated = await response.json();
    expect(updated.title).toBe("Updated Title");

    console.log("Updated post:", updated);
  });

  // ── PARTIAL UPDATE ──
  test("PATCH — Update only one field", async ({ request }) => {
    const response = await request.patch(
      "https://jsonplaceholder.typicode.com/posts/1",
      { data: { title: "Only title changed" } }, // only send what changed
    );

    expect(response.status()).toBe(200);

    const patched = await response.json();
    expect(patched.title).toBe("Only title changed");
  });

  // ── DELETE ──
  test("DELETE — Remove a post", async ({ request }) => {
    const response = await request.delete(
      "https://jsonplaceholder.typicode.com/posts/1",
    );

    // DELETE returns 200 with empty body
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual({}); // empty object — post is gone

    console.log("Post deleted successfully");
  });
});
