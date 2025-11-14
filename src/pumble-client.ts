const BASE_URL = "https://pumble-api-keys.addons.marketplace.cake.com";

export class PumbleApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "PumbleApiError";
  }
}

export class PumbleApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = apiKey;
    this.baseUrl = BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Api-Key": this.apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new PumbleApiError(
          errorData.error || `API request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof PumbleApiError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new PumbleApiError(`Network error: ${error.message}`);
      }
      throw new PumbleApiError("Unknown error occurred");
    }
  }

  async listChannels(): Promise<{ channels: unknown[] }> {
    return this.request<{ channels: unknown[] }>("/listChannels");
  }

  async listUsers(): Promise<{ users: unknown[] }> {
    return this.request<{ users: unknown[] }>("/listUsers");
  }

  async sendMessage(params: {
    text: string;
    channel?: string;
    channelId?: string;
    asBot?: boolean;
  }): Promise<unknown> {
    return this.request("/sendMessage", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async sendReply(params: {
    text: string;
    channel?: string;
    channelId?: string;
    messageId: string;
    asBot?: boolean;
  }): Promise<unknown> {
    return this.request("/sendReply", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async addReaction(params: {
    messageId: string;
    reaction: string;
  }): Promise<unknown> {
    return this.request("/addReaction", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async createChannel(params: {
    name: string;
    type: "PUBLIC" | "PRIVATE";
    description?: string;
  }): Promise<unknown> {
    return this.request("/createChannel", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async deleteMessage(params: {
    messageId: string;
    channel?: string;
    channelId?: string;
  }): Promise<unknown> {
    const queryParams = new URLSearchParams();
    queryParams.set("messageId", params.messageId);
    if (params.channel) {
      queryParams.set("channel", params.channel);
    }
    if (params.channelId) {
      queryParams.set("channelId", params.channelId);
    }
    return this.request(`/deleteMessage?${queryParams.toString()}`, {
      method: "DELETE",
    });
  }

  async listMessages(params: {
    channel?: string;
    channelId?: string;
    cursor?: string;
    limit?: number;
  }): Promise<unknown> {
    const queryParams = new URLSearchParams();
    if (params.channel) {
      queryParams.set("channel", params.channel);
    }
    if (params.channelId) {
      queryParams.set("channelId", params.channelId);
    }
    if (params.cursor) {
      queryParams.set("cursor", params.cursor);
    }
    if (params.limit) {
      queryParams.set("limit", params.limit.toString());
    }
    return this.request(`/listMessages?${queryParams.toString()}`);
  }
}

