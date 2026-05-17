"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function run() {
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
