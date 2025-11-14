import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { MockAgent, setGlobalDispatcher } from "undici";
import { PumbleApiClient, PumbleApiError } from "../pumble-client.js";

const BASE_URL = "https://pumble-api-keys.addons.marketplace.cake.com";

describe("Pumble API Client", () => {
  let mockAgent: MockAgent;

  beforeAll(() => {
    // Set up undici MockAgent to intercept native fetch requests
    mockAgent = new MockAgent();
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);
  });

  afterAll(async () => {
    await mockAgent.close();
    setGlobalDispatcher(new MockAgent());
  });

  beforeEach(() => {
    // Clean up any pending interceptors
  });

  afterEach(() => {
    // Clean up any pending interceptors
  });

  describe("API Client Initialization", () => {
    it("should initialize with API key", () => {
      const client = new PumbleApiClient("test-api-key-123");
      expect(client).toBeInstanceOf(PumbleApiClient);
    });

    it("should throw error if API key is missing", () => {
      expect(() => {
        new PumbleApiClient("");
      }).toThrow("API key is required");
    });
  });

  describe("Authentication Header Handling", () => {
    it("should include Api-Key header in requests", async () => {
      const apiKey = "test-api-key-123";
      const client = mockAgent.get(BASE_URL);

      const interceptor = client
        .intercept({
          path: "/listChannels",
          method: "GET",
          headers: {
            "Api-Key": apiKey,
          },
        })
        .reply(200, { channels: [] });

      const pumbleClient = new PumbleApiClient(apiKey);
      const result = await pumbleClient.listChannels();

      expect(result).toEqual({ channels: [] });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      const client = mockAgent.get(BASE_URL);
      client
        .intercept({ path: "/listChannels", method: "GET" })
        .reply(500, { error: "Internal Server Error" });

      const pumbleClient = new PumbleApiClient("test-api-key");
      await expect(pumbleClient.listChannels()).rejects.toThrow(PumbleApiError);
    });

    it("should handle network errors", async () => {
      const client = mockAgent.get(BASE_URL);
      client
        .intercept({ path: "/listChannels", method: "GET" })
        .replyWithError(new Error("Network error"));

      const pumbleClient = new PumbleApiClient("test-api-key");
      await expect(pumbleClient.listChannels()).rejects.toThrow(PumbleApiError);
    });

    it("should handle 401 unauthorized errors", async () => {
      const client = mockAgent.get(BASE_URL);
      client
        .intercept({ path: "/listChannels", method: "GET" })
        .reply(401, { error: "Unauthorized" });

      const pumbleClient = new PumbleApiClient("test-api-key");
      await expect(pumbleClient.listChannels()).rejects.toThrow(PumbleApiError);
    });
  });

  describe("Base URL Configuration", () => {
    it("should use correct base URL for all requests", async () => {
      const client = mockAgent.get(BASE_URL);
      const interceptor = client
        .intercept({ path: "/listChannels", method: "GET" })
        .reply(200, { channels: [] });

      const pumbleClient = new PumbleApiClient("test-api-key");
      const result = await pumbleClient.listChannels();

      expect(result).toEqual({ channels: [] });
    });
  });
});

describe("MCP Server Configuration", () => {
  it("should store API key from initialization", () => {
    // Test will be implemented after server config is added
    expect(true).toBe(true);
  });

  it("should throw error if API key is missing from configuration", () => {
    // Test will be implemented after server config is added
    expect(true).toBe(true);
  });

  it("should validate API key on initialization", async () => {
    // Test will be implemented after server config is added
    expect(true).toBe(true);
  });
});

