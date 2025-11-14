# Release v1.0.0

## 🎉 Initial Stable Release

This is the first stable release of the Pumble MCP Server, providing full integration with Pumble's API through the Model Context Protocol.

## ✨ Features

### Core Functionality
- **Complete Pumble API Integration** - Full support for all Pumble API endpoints
- **9 MCP Tools** - Comprehensive set of tools for interacting with Pumble:
  - `pumble_validate_api_key` - Validate your API key
  - `pumble_send_message` - Send messages to channels
  - `pumble_send_reply` - Reply to messages in threads
  - `pumble_add_reaction` - Add emoji reactions to messages
  - `pumble_create_channel` - Create public or private channels
  - `pumble_delete_message` - Delete messages from channels
  - `pumble_list_messages` - List messages with pagination support
  - `pumble_list_channels` - List all channels and DMs
  - `pumble_list_users` - List all workspace users

### Developer Experience
- **Easy Installation** - Use directly with `npx -y @shoutkol/pumble-mcp-server`
- **Flexible Configuration** - Support for API key via MCP config or environment variables
- **Comprehensive Error Handling** - Clear error messages and proper error propagation
- **TypeScript** - Fully typed with strict TypeScript settings
- **Test-Driven Development** - Complete test suite with Vitest

### CI/CD
- **Automated Testing** - CI runs tests on every push and pull request
- **Automated Publishing** - GitHub Actions workflow for npm publishing on releases
- **Quality Assurance** - Type checking and build verification

## 📦 Installation

```bash
npx -y @shoutkol/pumble-mcp-server
```

Or install globally:

```bash
npm install -g @shoutkol/pumble-mcp-server
```

## 🔧 Configuration

### Claude Desktop

```json
{
  "mcpServers": {
    "pumble": {
      "command": "npx",
      "args": ["-y", "@shoutkol/pumble-mcp-server"],
      "initializationOptions": {
        "apiKey": "your-pumble-api-key"
      }
    }
  }
}
```

### Cline (VS Code)

```json
{
  "cline.mcpServers": {
    "pumble": {
      "command": "npx",
      "args": ["-y", "@shoutkol/pumble-mcp-server"],
      "env": {
        "PUMBLE_API_KEY": "your-pumble-api-key"
      }
    }
  }
}
```

## 📚 Documentation

Full documentation is available in the [README.md](https://github.com/shoutkol/pumble-mcp-server/blob/main/README.md).

## 🔗 Links

- **npm Package**: https://www.npmjs.com/package/@shoutkol/pumble-mcp-server
- **GitHub Repository**: https://github.com/shoutkol/pumble-mcp-server
- **Pumble API Documentation**: https://pumble.com/help/integrations/automation-workflow-integrations/api-keys-integration/

## 🛠️ Technical Details

- **Node.js**: v18 or higher
- **TypeScript**: v5.3.3
- **MCP SDK**: v1.0.4
- **Package Manager**: pnpm

## 🙏 Acknowledgments

Built with Test-Driven Development (TDD) methodology for reliability and maintainability.

