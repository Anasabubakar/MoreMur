# Stitch MCP setup (MoreMur)

This project uses the official Google Stitch MCP server to fetch screen HTML and screenshots.

## 1. One-time local config

```bash
cp .cursor/mcp.json.example .cursor/mcp.json
```

Edit `.cursor/mcp.json` and set `X-Goog-Api-Key` to your Stitch API key (same value as in **Cursor Settings → MCP** for your user-level `stitch` server, if you already use Stitch elsewhere).

## 2. Enable in Cursor

1. Open **Cursor Settings → MCP** (or `Cmd/Ctrl+Shift+J` → MCP tab).
2. Confirm **stitch** appears (from `.cursor/mcp.json` in this repo).
3. Toggle it **on** if disabled.
4. Click **Reload** (or restart Cursor) until the server shows a green connected state and lists tools such as `list_screens`, `get_screen`, `get_project`.

## 3. Project config

Project MCP config lives at [`.cursor/mcp.json`](../.cursor/mcp.json):

- **URL:** `https://stitch.googleapis.com/mcp`
- **Auth:** `X-Goog-Api-Key` header (same key as your user-level Cursor MCP config)

**Murmur Stitch project ID:** `3984967297086363189`

## 4. If HTTP MCP fails in Cursor

Some Cursor builds reject remote `https://` MCP URLs. Use the local proxy instead — replace the `stitch` entry in `.cursor/mcp.json` with:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_API_KEY": "YOUR_KEY_HERE",
        "STITCH_PROJECT_ID": "3984967297086363189"
      }
    }
  }
}
```

Then reload MCP again.

## 5. Verify

Ask the agent to run `list_screens` for project `3984967297086363189`. You should see 16 Murmur screens.

## 6. Fallback (no MCP)

```bash
cp .env.example .env   # add your STITCH_API_KEY
npm install
npm run download:stitch
```

Assets land in `stitch/screens/` with a `stitch/manifest.json` index.
