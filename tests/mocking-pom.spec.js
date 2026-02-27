// tests/mocking-pom.spec.js
// Clean tests using PostsPage POM — all mock logic hidden inside the class

const { test, expect } = require("@playwright/test");
const PostsPage = require("../pages/PostPage"); // Import our POM

test.describe("Mocking with Page Object Model", () => {
  // ─────────────────────────────────────────────
  // TEST 1: Empty posts
  // ─────────────────────────────────────────────
  test("should return empty posts list", async ({ page }) => {
    const postsPage = new PostsPage(page); // Create POM instance

    await postsPage.mockEmptyPosts(); // Set up mock — ONE LINE
    await postsPage.goto(); // Navigate — ONE LINE

    const posts = await postsPage.fetchPosts(); // Fetch posts — ONE LINE

    expect(posts.length).toBe(0); // Assert empty
    console.log("✅ Posts count:", posts.length);
  });

  // ─────────────────────────────────────────────
  // TEST 2: Limited posts
  // ─────────────────────────────────────────────
  test("should return only 5 posts", async ({ page }) => {
    const postsPage = new PostsPage(page);

    await postsPage.mockLimitedPosts(5); // Limit to 5 posts — ONE LINE
    await postsPage.goto();

    const posts = await postsPage.fetchPosts();

    expect(posts.length).toBe(5); // Assert only 5 came back
    console.log("✅ Posts count:", posts.length);
  });

  // ─────────────────────────────────────────────
  // TEST 3: Server error
  // ─────────────────────────────────────────────
  test("should handle server error", async ({ page }) => {
    const postsPage = new PostsPage(page);

    await postsPage.mockServerError(); // Mock 500 error — ONE LINE
    await postsPage.goto();

    const result = await postsPage.fetchPostsWithStatus(); // Get status + body

    expect(result.status).toBe(500); // Assert 500 status
    expect(result.body.message).toBe("Something went wrong"); // Assert error message
    console.log("✅ Status:", result.status);
  });

  // ─────────────────────────────────────────────
  // TEST 4: Unauthorized
  // ─────────────────────────────────────────────
  test("should handle unauthorized error", async ({ page }) => {
    const postsPage = new PostsPage(page);

    await postsPage.mockUnauthorized(); // Mock 401 error — ONE LINE
    await postsPage.goto();

    const result = await postsPage.fetchPostsWithStatus();

    expect(result.status).toBe(401); // Assert 401 status
    expect(result.body.message).toBe("Please log in first"); // Assert message
    console.log("✅ Status:", result.status);
  });

  // ─────────────────────────────────────────────
  // TEST 5: Post Limit - 10 & Post
  // ─────────────────────────────────────────────

  test("should return only 10 posts", async ({ page }) => {
    const postPage = new PostsPage(page);

    await postPage.mockLimitedPosts(10);
    await postPage.goto();
    const posts = await postPage.fetchPosts();
    expect(posts.length).toBe(10);

    console.log("Posts Count:", posts.length);
  });
});
