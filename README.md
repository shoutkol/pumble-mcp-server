# Pumble MCP Server

A Model Context Protocol (MCP) server for Pumble, built with TypeScript.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (install with `npm install -g pnpm`)

## Installation

```bash
pnpm install
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
```

## Usage

This MCP server can be used with MCP-compatible clients. Configure it in your MCP client settings to use stdio transport.

## Project Structure

```
.
├── src/
│   └── index.ts      # Main server entry point
├── dist/             # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
