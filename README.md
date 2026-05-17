# MCP Logger GitHub Action

Instrument your MCP servers with logging, traces, and error diagnostics directly in your CI/CD pipeline.

## Usage

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Instrument MCP Server
        uses: solvo/mcp-logger-action@v1
        with:
          server-id: my-mcp-server
          endpoint: https://mcp-logger-backend.vercel.app

      - name: Run Tests
        run: npm test
        env:
          MCP_LOGGER_ENABLED: true
```

## How It Works

The MCP Logger Action:

1. **Sets environment variables** - `MCP_LOGGER_ENDPOINT`, `MCP_LOGGER_SERVER_ID`, and `MCP_LOGGER_ENABLED` are exported to subsequent steps
2. **Creates a setup script** - `mcp-logger-setup.sh` is generated for shell-based tooling
3. **Provides outputs** - `instrumented`, `server-id`, and `setup-script` outputs for advanced workflows

## Requirements

- Node.js 20+ (built-in to GitHub Actions `ubuntu-latest`)
- Use with [@solvo/mcp-logger-sdk](https://www.npmjs.com/package/@solvo/mcp-logger-sdk) in your MCP server code

## Example Integration

In your MCP server code:

```typescript
import { instrumentServer } from '@solvo/mcp-logger-sdk';

const server = new MCPServer();
instrumentServer(server, {
  endpoint: process.env.MCP_LOGGER_ENDPOINT,
  serverId: process.env.MCP_LOGGER_SERVER_ID
});
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `server-id` | Unique identifier for this MCP server | Yes | - |
| `endpoint` | MCP Logger backend endpoint | No | `https://mcp-logger-backend.vercel.app` |

## Outputs

| Output | Description |
|--------|-------------|
| `instrumented` | Set to `true` when instrumentation is active |
| `server-id` | The server identifier passed as input |
| `setup-script` | Path to the generated setup script |

## Full Example Workflow

```yaml
name: MCP Server CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci

      - name: Instrument MCP Server
        id: mcp-logger
        uses: solvo/mcp-logger-action@v1
        with:
          server-id: production-mcp-server

      - name: Run Tests
        run: npm test

      - name: Build
        run: npm run build
```

## Documentation

For more details on MCP Logger, see the [main documentation](https://github.com/solvo/mcp-logger).