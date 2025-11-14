# Pumble MCP Server

A Model Context Protocol (MCP) server for Pumble, built with TypeScript using Test-Driven Development (TDD).

## Overview

This MCP server provides integration with Pumble's API, allowing you to send messages, manage channels, react to messages, and interact with your Pumble workspace through MCP-compatible clients.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (install with `npm install -g pnpm`)
- A Pumble API key (see [API Key Setup](#api-key-setup))

## Installation

```bash
pnpm install
```

## API Key Setup

To use this MCP server, you need a Pumble API key. Generate one by:

1. Installing the API app in your Pumble workspace
2. Typing `/api-keys generate` in any Pumble channel
3. Copying the generated API key from the ephemeral message

### Configuration

The API key can be provided in two ways:

1. **MCP Server Configuration** (Recommended): Provide the API key in your MCP client configuration:
   ```json
   {
     "mcpServers": {
       "pumble": {
         "command": "node",
         "args": ["path/to/pumble-mcp-server/dist/index.js"],
         "initializationOptions": {
           "apiKey": "your-api-key-here"
         }
       }
     }
   }
   ```

2. **Environment Variable**: Set the `PUMBLE_API_KEY` environment variable:
   ```bash
   export PUMBLE_API_KEY="your-api-key-here"
   ```

## Development

```bash
# Run in development mode with hot reload
pnpm dev

# Build the project
pnpm build

# Run the built server
pnpm start

# Watch mode for building
pnpm watch

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Testing with MCP Inspector

You can test the MCP server interactively using the MCP Inspector. To run it with your API key:

**Option 1: Inline (single command)**
```bash
PUMBLE_API_KEY="your-api-key-here" npx @modelcontextprotocol/inspector -- tsx src/index.ts
```

**Option 2: Export first, then run**
```bash
export PUMBLE_API_KEY="your-api-key-here"
npx @modelcontextprotocol/inspector -- tsx src/index.ts
```

**Option 3: Using dotenv-cli**

Create a `.env` file in your project root:
```bash
PUMBLE_API_KEY=your-api-key-here
```

Then run:
```bash
# Install dotenv-cli if needed: pnpm add -D dotenv-cli
npx dotenv-cli npx @modelcontextprotocol/inspector -- tsx src/index.ts
```

The inspector will open a web interface at `http://localhost:6274` where you can:
- View all available tools
- Test tool calls interactively
- See request/response details
- Debug API interactions

**Note:** Replace `"your-api-key-here"` with your actual Pumble API key (generated with `/api-keys generate` in Pumble).

## Testing

This project uses Test-Driven Development (TDD) with Vitest. Tests are located in `src/__tests__/`.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### TDD Workflow

The project follows the Red-Green-Refactor cycle:

1. **Red**: Write tests first that define the desired functionality
2. **Green**: Implement minimal code to make tests pass
3. **Refactor**: Improve code while keeping tests green

## Available Tools

### `pumble_validate_api_key`

Validates the Pumble API key by making a test API call.

**Parameters:** None

**Example:**
```json
{
  "tool": "pumble_validate_api_key",
  "arguments": {}
}
```

### `pumble_send_message`

Send a message to a Pumble channel.

**Parameters:**
- `text` (string, required): The message text to send
- `channel` (string, optional): The channel name (use either `channel` or `channelId`)
- `channelId` (string, optional): The channel ID (use either `channel` or `channelId`)
- `asBot` (boolean, optional): Whether to send the message as a bot (default: `true`)

**Example:**
```json
{
  "tool": "pumble_send_message",
  "arguments": {
    "text": "Hello from MCP!",
    "channel": "general",
    "asBot": true
  }
}
```

### `pumble_send_reply`

Reply to a specific message in a Pumble channel.

**Parameters:**
- `text` (string, required): The reply text
- `messageId` (string, required): The ID of the message to reply to
- `channel` (string, optional): The channel name (use either `channel` or `channelId`)
- `channelId` (string, optional): The channel ID (use either `channel` or `channelId`)

**Example:**
```json
{
  "tool": "pumble_send_reply",
  "arguments": {
    "text": "This is a reply",
    "messageId": "65c4ba025f3c124940579c7f",
    "channel": "general"
  }
}
```

### `pumble_add_reaction`

Add an emoji reaction to a message.

**Parameters:**
- `messageId` (string, required): The ID of the message to react to
- `reaction` (string, required): The emoji reaction code (e.g., `:grin:`)

**Example:**
```json
{
  "tool": "pumble_add_reaction",
  "arguments": {
    "messageId": "65c4a8ab99f15a6b2150e0f0",
    "reaction": ":grin:"
  }
}
```

### `pumble_create_channel`

Create a new channel in Pumble.

**Parameters:**
- `name` (string, required): The name of the channel
- `type` (string, required): The channel type (`PUBLIC` or `PRIVATE`)
- `description` (string, optional): Optional channel description

**Example:**
```json
{
  "tool": "pumble_create_channel",
  "arguments": {
    "name": "my-new-channel",
    "type": "PUBLIC",
    "description": "A new channel created via MCP"
  }
}
```

### `pumble_delete_message`

Delete a message from a Pumble channel.

**Parameters:**
- `messageId` (string, required): The ID of the message to delete
- `channel` (string, optional): The channel name (use either `channel` or `channelId`)
- `channelId` (string, optional): The channel ID (use either `channel` or `channelId`)

**Example:**
```json
{
  "tool": "pumble_delete_message",
  "arguments": {
    "messageId": "65c4ba025f3c124940579c7f",
    "channel": "general"
  }
}
```

### `pumble_list_messages`

List messages in a Pumble channel.

**Parameters:**
- `channel` (string, optional): The channel name (use either `channel` or `channelId`)
- `channelId` (string, optional): The channel ID (use either `channel` or `channelId`)
- `cursor` (string, optional): Optional cursor for pagination
- `limit` (number, optional): Optional limit for number of messages

**Example:**
```json
{
  "tool": "pumble_list_messages",
  "arguments": {
    "channel": "general",
    "limit": 50
  }
}
```

### `pumble_list_channels`

List all channels and DMs in the workspace.

**Parameters:** None

**Example:**
```json
{
  "tool": "pumble_list_channels",
  "arguments": {}
}
```

### `pumble_list_users`

List all users in the workspace.

**Parameters:** None

**Example:**
```json
{
  "tool": "pumble_list_users",
  "arguments": {}
}
```

## Usage

This MCP server can be used with MCP-compatible clients. Configure it in your MCP client settings to use stdio transport.

### Example MCP Client Configuration

For Claude Desktop or other MCP clients, add this to your configuration:

```json
{
  "mcpServers": {
    "pumble": {
      "command": "node",
      "args": ["/path/to/pumble-mcp-server/dist/index.js"],
      "initializationOptions": {
        "apiKey": "your-pumble-api-key"
      }
    }
  }
}
```

## Project Structure

```
.
├── src/
│   ├── index.ts           # Main server entry point
│   ├── pumble-client.ts   # Pumble API client
│   └── __tests__/
│       └── index.test.ts  # Test suite
├── dist/                  # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── vitest.config.ts      # Vitest configuration
└── README.md
```

## Error Handling

The server provides comprehensive error handling:

- **Missing API Key**: Clear error message if API key is not configured
- **API Errors**: Detailed error messages with status codes from Pumble API
- **Network Errors**: Handles network failures gracefully
- **Invalid Parameters**: Validates required parameters and provides helpful error messages

## API Reference

This server integrates with the Pumble API Addon. For more information about the Pumble API, see the [official documentation](https://pumble.com/help/integrations/automation-workflow-integrations/api-keys-integration/).

**Base URL:** `https://pumble-api-keys.addons.marketplace.cake.com`

**Authentication:** All requests use the `Api-Key` header with your generated API key.

## License

MIT
