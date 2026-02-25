// tests/api-pom.spec.js ← use the API class

import { test, expect } from "@playwright/test";
import { PostsAPI } from "../pages/PostsAPI.js";

test.describe("Posts API — Using API Page Object", () => {
  let postsAPI;

  test.beforeEach(async ({ request }) => {
    postsAPI = new PostsAPI(request); // clean instance per test
  });

  test("Get all posts", async () => {
    const posts = await postsAPI.getAllPosts();
    expect(posts).toHaveLength(100);
  });

  test("Get post by ID", async () => {
    const { status, data } = await postsAPI.getPostById(1);
    expect(status).toBe(200);
    expect(data.id).toBe(1);
  });

  test("Get non-existent post", async () => {
    const { status } = await postsAPI.getPostById(99999);
    expect(status).toBe(404);
  });

  test("Create and verify post", async () => {
    const newPost = {
      title: "QA Automation Post",
      body: "Created by Playwright API test",
      userId: 1,
    };

    const { status, data } = await postsAPI.createPost(newPost);

    expect(status).toBe(201);
    expect(data.title).toBe(newPost.title);
    expect(data.id).toBeDefined();

    console.log(`✅ Post created with ID: ${data.id}`);
  });
});
