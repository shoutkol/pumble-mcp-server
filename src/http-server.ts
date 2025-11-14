#!/usr/bin/env node

import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server-setup.js";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "pumble-mcp-server" });
});

// Create MCP server
const server = createServer();

// Store transports by session ID
const transports: Record<string, StreamableHTTPServerTransport> = {};

// Handle POST requests for Streamable HTTP transport
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];
  } else {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    if (transport.sessionId) {
      transports[transport.sessionId] = transport;
    }

    res.on("close", () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
      transport.close();
    });

    await server.connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(parseInt(PORT.toString(), 10), HOST, () => {
  console.error(`Pumble MCP server running on http://${HOST}:${PORT}`);
  console.error(`Streamable HTTP endpoint: http://${HOST}:${PORT}/mcp`);
  console.error(`Health check: http://${HOST}:${PORT}/health`);
});

