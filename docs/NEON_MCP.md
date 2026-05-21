# Neon MCP (Cursor)

Neon’s MCP server lets the AI assistant inspect and manage your Neon Postgres projects (dev/test only — review actions before approving).

## Project config

Copy the example into `.cursor/` (gitignored):

```bash
mkdir -p .cursor
cp docs/cursor-mcp.json.example .cursor/mcp.json
```

Or use OAuth-only Neon entry:

```json
{
  "mcpServers": {
    "neon": {
      "url": "https://mcp.neon.tech/mcp"
    }
  }
}
```

## Enable in Cursor

1. **Cursor Settings → MCP** (or reload MCP from the MCP panel).
2. Turn **neon** on.
3. On first use, complete the **OAuth** browser flow (Authorize).
4. Ask: **“Get started with Neon”** or use MCP tools to list projects / run SQL.

## Global config (optional)

This machine’s user-level config is `~/.cursor/mcp.json` — **neon** was added there as well so it works in any workspace.

## OAuth errors

If you see `invalid redirect uri`:

```bash
rm -rf ~/.mcp-auth
```

Restart Cursor and authorize again.

## API key (local server, no OAuth)

Requires a [Neon API key](https://console.neon.tech/app/settings/api-keys):

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon", "start", "YOUR_NEON_API_KEY"]
}
```

## Full setup wizard

```bash
npx neonctl@latest init
```

Creates an API key, wires MCP for Cursor, and installs Neon agent skills.

## MoreMur app database

The MURMUR API uses `DATABASE_URL` in `api/.env` (not Neon Auth). MCP is separate tooling for AI-assisted DB work. Initialize schema:

```bash
cd api && npm run db:seed
```

See [Neon: Connect MCP clients](https://neon.com/docs/ai/connect-mcp-clients-to-neon).
