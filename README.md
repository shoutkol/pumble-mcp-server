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

### Installation via npm (npx)

Once published to npm, users can run this MCP server directly without installing it:

```bash
npx -y pumble-mcp-server
```

Or with an API key:

```bash
PUMBLE_API_KEY="your-api-key-here" npx -y pumble-mcp-server
```

### Claude Desktop

1. **Find your Claude Desktop configuration file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add the Pumble MCP server configuration:**

**Using npx (Recommended):**
```json
{
  "mcpServers": {
    "pumble": {
      "command": "npx",
      "args": ["-y", "pumble-mcp-server"],
      "initializationOptions": {
        "apiKey": "your-pumble-api-key"
      }
    }
  }
}
```

**Using local installation:**
```json
{
  "mcpServers": {
    "pumble": {
      "command": "node",
      "args": ["/absolute/path/to/pumble-mcp-server/dist/index.js"],
      "initializationOptions": {
        "apiKey": "your-pumble-api-key"
      }
    }
  }
}
```

**Using environment variable:**
```json
{
  "mcpServers": {
    "pumble": {
      "command": "npx",
      "args": ["-y", "pumble-mcp-server"],
      "env": {
        "PUMBLE_API_KEY": "your-pumble-api-key"
      }
    }
  }
}
```

3. **Restart Claude Desktop** to load the new configuration.

4. **Verify connection:** Open Claude Desktop and check that the Pumble tools are available in the MCP tools list.

### Cline (VS Code Extension)

1. **Install Cline** from the VS Code marketplace.

2. **Open VS Code settings** (Cmd/Ctrl + ,) and search for "Cline".

3. **Add MCP server configuration** in your VS Code settings.json:

```json
{
  "cline.mcpServers": {
    "pumble": {
      "command": "npx",
      "args": ["-y", "pumble-mcp-server"],
      "env": {
        "PUMBLE_API_KEY": "your-pumble-api-key"
      }
    }
  }
}
```

4. **Reload VS Code** to activate the configuration.

### Other MCP Clients

For other MCP-compatible clients, configure the server using stdio transport:

- **Command**: `npx` (or `node` for local installation)
- **Args**: `["-y", "pumble-mcp-server"]` (or `["/path/to/dist/index.js"]` for local)
- **API Key**: Provide via `initializationOptions.apiKey` or `PUMBLE_API_KEY` environment variable

### Using the Tools

Once configured, you can use the Pumble tools through your MCP client:

- **Send messages** to channels
- **Reply to messages** in threads
- **Add reactions** to messages
- **Create channels** (public or private)
- **List channels, users, and messages**
- **Delete messages**

The tools will appear in your MCP client's tool list and can be invoked through natural language or direct tool calls.

## Deployment

### Local Deployment

**Prerequisites:**
- Node.js v18 or higher
- pnpm installed globally

**Steps:**

1. **Clone or download the repository:**
```bash
git clone <repository-url>
cd pumble-mcp-server
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Build the project:**
```bash
pnpm build
```

4. **Set up API key:**
```bash
export PUMBLE_API_KEY="your-api-key-here"
```

5. **Run the server:**
```bash
pnpm start
```

The server runs on stdio transport and communicates with MCP clients via standard input/output.

### Docker Deployment

**Build and run locally:**

```bash
# Build the image
docker build -t pumble-mcp-server .

# Run the container
docker run -e PUMBLE_API_KEY="your-api-key-here" pumble-mcp-server
```

**Using pre-built images from GitHub Container Registry:**

```bash
# Pull the image
docker pull ghcr.io/<your-username>/pumble-mcp-server:latest

# Run the container
docker run -e PUMBLE_API_KEY="your-api-key-here" ghcr.io/<your-username>/pumble-mcp-server:latest
```

**Automated Docker builds:**

GitHub Actions automatically builds and pushes Docker images to GitHub Container Registry (ghcr.io) on:
- Pushes to `main` branch (tagged as `latest`)
- Version tags (e.g., `v1.0.0`)
- Pull requests (build only, no push)

Images are available at: `ghcr.io/<your-username>/pumble-mcp-server:<tag>`

### Docker Compose

**Run:**

```bash
# Set environment variable
export PUMBLE_API_KEY="your-api-key-here"

# Start the service
docker-compose up
```

### Publishing to npm

To enable `npx` usage, publish the package to npm:

**Manual Publishing:**

1. **Build the project:**
   ```bash
   pnpm build
   ```

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

4. **Verify it works:**
   ```bash
   npx -y pumble-mcp-server
   ```

**Automated Publishing with GitHub Actions:**

The repository includes GitHub Actions workflows for automated publishing:

1. **Set up npm token:**
   - Go to npmjs.com and create an access token
   - Add it as a secret named `NPM_TOKEN` in your GitHub repository settings (Settings → Secrets and variables → Actions)

2. **Create a release:**
   - Create a new release on GitHub with a version tag (e.g., `v1.0.0`)
   - The workflow will automatically:
     - Run tests
     - Build the project
     - Publish to npm
     - Create a GitHub release

3. **Manual trigger:**
   - Go to Actions → Publish to npm → Run workflow
   - Enter the version number and run

The workflow ensures that only tested and built code is published to npm.

### Cloud Deployment Options

#### Railway

1. **Create a Railway account** and new project
2. **Connect your repository**
3. **Set environment variable:**
   - `PUMBLE_API_KEY`: Your Pumble API key
4. **Configure build command:**
   ```bash
   pnpm install && pnpm build
   ```
5. **Set start command:**
   ```bash
   node dist/index.js
   ```

#### Render

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Set environment variables:**
   - `PUMBLE_API_KEY`: Your Pumble API key
4. **Build command:**
   ```bash
   pnpm install && pnpm build
   ```
5. **Start command:**
   ```bash
   node dist/index.js
   ```

#### Fly.io

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create `fly.toml`:**
   ```toml
   app = "pumble-mcp-server"
   primary_region = "iad"

   [build]
     builder = "paketobuildpacks/builder:base"

   [env]
     PUMBLE_API_KEY = "your-api-key-here"

   [[services]]
     internal_port = 8080
     protocol = "tcp"
   ```

3. **Deploy:**
   ```bash
   fly deploy
   ```

### Production Considerations

1. **Security:**
   - Never commit API keys to version control
   - Use environment variables or secret management services
   - Consider using different API keys for development and production

2. **Monitoring:**
   - Add logging for API calls and errors
   - Monitor API rate limits
   - Set up alerts for failures

3. **Performance:**
   - The server is lightweight and runs on stdio
   - No HTTP server overhead
   - Consider connection pooling if handling multiple clients

4. **Scaling:**
   - MCP servers typically run one instance per client connection
   - For multiple clients, run multiple instances
   - Consider using process managers like PM2 for local deployments

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PUMBLE_API_KEY` | Your Pumble API key | Yes |

### Troubleshooting

**Server won't start:**
- Verify Node.js version (v18+)
- Check that `dist/index.js` exists (run `pnpm build`)
- Verify API key is set correctly

**Tools not appearing:**
- Check MCP client logs for connection errors
- Verify the server path in configuration is absolute (if using local installation)
- Ensure the server process has execute permissions

**API errors:**
- Validate your API key with `pumble_validate_api_key` tool
- Check API rate limits
- Verify network connectivity to Pumble API

**Connection issues:**
- Ensure stdio transport is configured correctly
- Check that the server process is running
- Review MCP client logs for detailed error messages

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

1. **CI (`ci.yml`)**: Runs on every push and pull request
   - Runs tests
   - Builds the project
   - Type checks the code

2. **Publish to npm (`publish-npm.yml`)**: Runs on releases
   - Runs tests
   - Builds the project
   - Publishes to npm
   - Creates GitHub release

3. **Docker (`docker.yml`)**: Builds and pushes Docker images
   - Builds Docker image on push to main
   - Pushes to GitHub Container Registry
   - Tags images with version, branch, and commit SHA

### Setting up Automated Publishing

1. **Create npm access token:**
   - Go to https://www.npmjs.com/settings/<your-username>/tokens
   - Create a new "Automation" token
   - Copy the token

2. **Add secret to GitHub:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token
   - Click "Add secret"

3. **Create a release:**
   - Go to Releases → Create a new release
   - Tag: `v1.0.0` (or your version)
   - Title: `Release v1.0.0`
   - Description: Release notes
   - Click "Publish release"
   - The workflow will automatically publish to npm

## Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI workflow
│       ├── publish-npm.yml    # npm publishing workflow
│       └── docker.yml         # Docker build workflow
├── src/
│   ├── index.ts               # Main server entry point
│   ├── pumble-client.ts       # Pumble API client
│   └── __tests__/
│       └── index.test.ts      # Test suite
├── dist/                      # Compiled JavaScript (generated)
├── Dockerfile                 # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts          # Vitest configuration
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
