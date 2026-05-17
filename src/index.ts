import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

async function run(): Promise<void> {
  const serverId = core.getInput('server-id', { required: true });
  const endpoint = core.getInput('endpoint') || 'https://mcp-logger-backend.vercel.app';

  core.info(`[MCP Logger] Instrumenting MCP server: ${serverId}`);
  core.info(`[MCP Logger] Backend endpoint: ${endpoint}`);

  // Set environment variables for the SDK
  core.exportVariable('MCP_LOGGER_ENDPOINT', endpoint);
  core.exportVariable('MCP_LOGGER_SERVER_ID', serverId);
  core.exportVariable('MCP_LOGGER_ENABLED', 'true');

  // Create a setup script that can be sourced
  const setupScript = `export MCP_LOGGER_ENDPOINT=${endpoint}
export MCP_LOGGER_SERVER_ID=${serverId}
export MCP_LOGGER_ENABLED=true
echo "[MCP Logger] Initialized for server: ${serverId}"`;

  const setupPath = path.join(process.cwd(), 'mcp-logger-setup.sh');
  fs.writeFileSync(setupPath, setupScript);
  fs.chmodSync(setupPath, '755');

  core.info('[MCP Logger] MCP Logger instrumentation enabled in CI');
  core.info('[MCP Logger] Add instrumentServer() to your MCP server code to start logging');
  core.setOutput('instrumented', 'true');
  core.setOutput('server-id', serverId);
  core.setOutput('setup-script', setupPath);
}

run().catch((error) => {
  core.setFailed(error.message);
});