import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializeRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { PumbleApiClient, PumbleApiError } from "./pumble-client.js";

let apiClient: PumbleApiClient | null = null;

export function createServer(): Server {
  const server = new Server(
    {
      name: "pumble-mcp-server",
      version: "1.0.3",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle initialization
  server.setRequestHandler(InitializeRequestSchema, async (request) => {
    const params = request.params as {
      initializationOptions?: { apiKey?: string };
      [key: string]: unknown;
    };

    const apiKey =
      params.initializationOptions?.apiKey ||
      (params as { apiKey?: string }).apiKey ||
      process.env.PUMBLE_API_KEY;

    if (apiKey) {
      try {
        apiClient = new PumbleApiClient(apiKey);
      } catch (error) {
        console.error("Failed to initialize Pumble API client:", error);
      }
    }

    return {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: "pumble-mcp-server",
        version: "1.0.2",
      },
    };
  });

  function getApiClient(): PumbleApiClient {
    if (!apiClient) {
      throw new Error(
        "API key not configured. Please initialize the server with an API key."
      );
    }
    return apiClient;
  }

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "pumble_validate_api_key",
          description: "Validate the Pumble API key by making a test API call",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "pumble_send_message",
          description: "Send a message to a Pumble channel",
          inputSchema: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "The message text to send",
              },
              channel: {
                type: "string",
                description:
                  "The channel name (use either channel or channelId)",
              },
              channelId: {
                type: "string",
                description: "The channel ID (use either channel or channelId)",
              },
              asBot: {
                type: "boolean",
                description:
                  "Whether to send the message as a bot (default: true)",
                default: true,
              },
            },
            required: ["text"],
          },
        },
        {
          name: "pumble_send_reply",
          description: "Reply to a specific message in a Pumble channel",
          inputSchema: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "The reply text",
              },
              messageId: {
                type: "string",
                description: "The ID of the message to reply to",
              },
              channel: {
                type: "string",
                description:
                  "The channel name (use either channel or channelId)",
              },
              channelId: {
                type: "string",
                description: "The channel ID (use either channel or channelId)",
              },
              asBot: {
                type: "boolean",
                description:
                  "Whether to send the reply as a bot (default: true)",
                default: true,
              },
            },
            required: ["text", "messageId"],
          },
        },
        {
          name: "pumble_add_reaction",
          description: "Add an emoji reaction to a message",
          inputSchema: {
            type: "object",
            properties: {
              messageId: {
                type: "string",
                description: "The ID of the message to react to",
              },
              reaction: {
                type: "string",
                description: "The emoji reaction code (e.g., ':grin:')",
              },
            },
            required: ["messageId", "reaction"],
          },
        },
        {
          name: "pumble_create_channel",
          description: "Create a new channel in Pumble",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The name of the channel",
              },
              type: {
                type: "string",
                enum: ["PUBLIC", "PRIVATE"],
                description: "The channel type",
              },
              description: {
                type: "string",
                description: "Optional channel description",
              },
            },
            required: ["name", "type"],
          },
        },
        {
          name: "pumble_delete_message",
          description: "Delete a message from a Pumble channel",
          inputSchema: {
            type: "object",
            properties: {
              messageId: {
                type: "string",
                description: "The ID of the message to delete",
              },
              channel: {
                type: "string",
                description:
                  "The channel name (use either channel or channelId)",
              },
              channelId: {
                type: "string",
                description: "The channel ID (use either channel or channelId)",
              },
            },
            required: ["messageId"],
          },
        },
        {
          name: "pumble_list_messages",
          description: "List messages in a Pumble channel",
          inputSchema: {
            type: "object",
            properties: {
              channel: {
                type: "string",
                description:
                  "The channel name (use either channel or channelId)",
              },
              channelId: {
                type: "string",
                description: "The channel ID (use either channel or channelId)",
              },
              cursor: {
                type: "string",
                description: "Optional cursor for pagination",
              },
              limit: {
                type: "number",
                description: "Optional limit for number of messages",
              },
            },
          },
        },
        {
          name: "pumble_list_channels",
          description: "List all channels and DMs in the workspace",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "pumble_list_users",
          description: "List all users in the workspace",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const client = getApiClient();

    try {
      switch (name) {
        case "pumble_validate_api_key": {
          await client.listChannels();
          return {
            content: [
              {
                type: "text",
                text: "API key is valid and working correctly.",
              },
            ],
          };
        }

        case "pumble_send_message": {
          const {
            text,
            channel,
            channelId,
            asBot = true,
          } = args as {
            text: string;
            channel?: string;
            channelId?: string;
            asBot?: boolean;
          };

          if (!channel && !channelId) {
            throw new Error("Either 'channel' or 'channelId' must be provided");
          }

          const result = await client.sendMessage({
            text,
            channel,
            channelId,
            asBot,
          });

          return {
            content: [
              {
                type: "text",
                text: `Message sent successfully: ${JSON.stringify(result)}`,
              },
            ],
          };
        }

        case "pumble_send_reply": {
          const {
            text,
            messageId,
            channel,
            channelId,
            asBot = true,
          } = args as {
            text: string;
            messageId: string;
            channel?: string;
            channelId?: string;
            asBot?: boolean;
          };

          if (!channel && !channelId) {
            throw new Error("Either 'channel' or 'channelId' must be provided");
          }

          const result = await client.sendReply({
            text,
            messageId,
            channel,
            channelId,
            asBot,
          });

          return {
            content: [
              {
                type: "text",
                text: `Reply sent successfully: ${JSON.stringify(result)}`,
              },
            ],
          };
        }

        case "pumble_add_reaction": {
          const { messageId, reaction } = args as {
            messageId: string;
            reaction: string;
          };

          const result = await client.addReaction({ messageId, reaction });

          return {
            content: [
              {
                type: "text",
                text: `Reaction added successfully: ${JSON.stringify(result)}`,
              },
            ],
          };
        }

        case "pumble_create_channel": {
          const { name, type, description } = args as {
            name: string;
            type: "PUBLIC" | "PRIVATE";
            description?: string;
          };

          const result = await client.createChannel({
            name,
            type,
            description,
          });

          return {
            content: [
              {
                type: "text",
                text: `Channel created successfully: ${JSON.stringify(result)}`,
              },
            ],
          };
        }

        case "pumble_delete_message": {
          const { messageId, channel, channelId } = args as {
            messageId: string;
            channel?: string;
            channelId?: string;
          };

          if (!channel && !channelId) {
            throw new Error("Either 'channel' or 'channelId' must be provided");
          }

          const result = await client.deleteMessage({
            messageId,
            channel,
            channelId,
          });

          return {
            content: [
              {
                type: "text",
                text: `Message deleted successfully: ${JSON.stringify(result)}`,
              },
            ],
          };
        }

        case "pumble_list_messages": {
          const { channel, channelId, cursor, limit } = args as {
            channel?: string;
            channelId?: string;
            cursor?: string;
            limit?: number;
          };

          if (!channel && !channelId) {
            throw new Error("Either 'channel' or 'channelId' must be provided");
          }

          const result = await client.listMessages({
            channel,
            channelId,
            cursor,
            limit,
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case "pumble_list_channels": {
          const result = await client.listChannels();

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case "pumble_list_users": {
          const result = await client.listUsers();

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      if (error instanceof PumbleApiError) {
        return {
          content: [
            {
              type: "text",
              text: `Pumble API error: ${error.message}${
                error.statusCode ? ` (Status: ${error.statusCode})` : ""
              }`,
            },
          ],
          isError: true,
        };
      }

      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Unknown error occurred: ${String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
