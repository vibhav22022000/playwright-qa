// pages/PostsAPI.js

import { expect } from "@playwright/test";

export class PostsAPI {
  constructor(request) {
    this.request = request;
    this.baseURL = "https://jsonplaceholder.typicode.com";
  }

  async getAllPosts() {
    const response = await this.request.get(this.baseURL + "/posts", {
      baseURL: undefined, // ← override config's baseURL
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async getPostById(id) {
    const response = await this.request.get(this.baseURL + `/posts/${id}`, {
      baseURL: undefined,
    });
    return {
      status: response.status(),
      data: await response.json(),
    };
  }

  async createPost(postData) {
    const response = await this.request.post(this.baseURL + "/posts", {
      baseURL: undefined,
      data: postData,
    });
    return {
      status: response.status(),
      data: await response.json(),
    };
  }

  async deletePost(id) {
    const response = await this.request.delete(this.baseURL + `/posts/${id}`, {
      baseURL: undefined,
    });
    return response.status();
  }
}
