#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_KEY="${STITCH_API_KEY:-}"
PROJECT_ID="3984967297086363189"
OUT_DIR="$ROOT/stitch/screens"
MANIFEST="$ROOT/stitch/manifest.json"

if [[ -z "$API_KEY" ]]; then
  if [[ -f "$ROOT/.cursor/mcp.json" ]]; then
    API_KEY="$(node -e "
      const j = require('$ROOT/.cursor/mcp.json');
      console.log(j.mcpServers?.stitch?.headers?.['X-Goog-Api-Key'] || '');
    ")"
  fi
fi

if [[ -z "$API_KEY" ]]; then
  echo "STITCH_API_KEY or .cursor/mcp.json with X-Goog-Api-Key is required" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

declare -a SCREENS=(
  "0bfd9428e277404ab598a7eeb3fbaa4b|01-anonymous-feed-mobile"
  "362bfe203ee240d08df0711319c1e10a|02-trending-feed-mobile"
  "4c03f6f122724559a4022df892bec57e|03-signup-verification-mobile"
  "69723d159c904df7a0412e4ab9b6b109|04-culture-intel-mobile"
  "6d656a0018cf459cb9ccf33f74149096|05-landing-page"
  "789d55911e994344b537f460eaf27749|06-culture-intelligence-report"
  "8058d9d62bf24c5b82497912ddd50d6f|07-anonymous-feed"
  "92ff9f006db24e27a881999ca6c9aedb|08-signup-verification"
  "9600730465df4510990b72d8b73d4dfd|09-trending-feed"
  "a0147a3b94064e4eb76c4f69768c05c0|10-landing-page-mobile"
  "asset-stub-assets-99af8109b548496f9afd4e8fe8f76774-1779358323352|11-design-system"
  "c67b75d926104c1797cda4121e4d1765|12-org-admin-mobile"
  "ce1691e0839d49a9b86b5df1227b9765|13-org-admin-dashboard"
  "6afc7ca712d94f7581ad38a5bec4331a|14-landing-page-alt"
  "03926ae1864c4e6cac2c2148ae4be21a|15-anonymous-feed-alt"
  "b4200fd731a64927ab2170d34eed225c|16-signup-verification-alt"
)

call_get_screen() {
  local screen_id="$1"
  curl -sS -X POST "https://stitch.googleapis.com/mcp" \
    -H "Content-Type: application/json" \
    -H "X-Goog-Api-Key: $API_KEY" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"get_screen\",\"arguments\":{\"name\":\"projects/${PROJECT_ID}/screens/${screen_id}\",\"projectId\":\"${PROJECT_ID}\",\"screenId\":\"${screen_id}\"}}}"
}

echo "[]" > "$MANIFEST.tmp"
entries=()

for entry in "${SCREENS[@]}"; do
  IFS='|' read -r screen_id slug <<< "$entry"
  echo "Fetching $slug ($screen_id)..."

  response="$(call_get_screen "$screen_id")"
  parsed="$(node -e "
    const r = JSON.parse(process.argv[1]);
    const sc = r.result?.structuredContent || JSON.parse(r.result?.content?.[0]?.text || '{}');
    if (!sc.name) { process.exit(2); }
    console.log(JSON.stringify({
      id: process.argv[2],
      slug: process.argv[3],
      title: sc.title || process.argv[3],
      deviceType: sc.deviceType || null,
      width: sc.width || null,
      height: sc.height || null,
      htmlUrl: sc.htmlCode?.downloadUrl || null,
      imageUrl: sc.screenshot?.downloadUrl || null,
    }));
  " "$response" "$screen_id" "$slug" 2>/dev/null)" || {
    echo "  failed to parse response for $slug" >&2
    entries+=("{\"id\":\"$screen_id\",\"slug\":\"$slug\",\"status\":\"error\"}")
    continue
  }

  html_url="$(node -e "console.log(JSON.parse(process.argv[1]).htmlUrl||'')" "$parsed")"
  image_url="$(node -e "console.log(JSON.parse(process.argv[1]).imageUrl||'')" "$parsed")"

  if [[ -n "$html_url" ]]; then
    curl -fsSL "$html_url" -o "$OUT_DIR/${slug}.html"
    echo "  saved ${slug}.html"
  fi

  if [[ -n "$image_url" ]]; then
    curl -fsSL "$image_url" -o "$OUT_DIR/${slug}.png"
    echo "  saved ${slug}.png"
  fi

  title="$(node -e "console.log(JSON.parse(process.argv[1]).title)" "$parsed")"
  device="$(node -e "console.log(JSON.parse(process.argv[1]).deviceType||'')" "$parsed")"
  entries+=("{\"id\":\"$screen_id\",\"slug\":\"$slug\",\"title\":$(node -e "console.log(JSON.stringify(process.argv[1]))" "$title"),\"deviceType\":\"$device\",\"files\":{\"html\":\"stitch/screens/${slug}.html\",\"png\":\"stitch/screens/${slug}.png\"},\"status\":\"ok\"}")
done

node -e "
const fs = require('fs');
const entries = process.argv.slice(1).map(e => JSON.parse(e));
fs.writeFileSync(process.argv[0], JSON.stringify({
  projectId: '$PROJECT_ID',
  projectTitle: 'MURMUR Anonymous Intelligence Platform',
  downloadedAt: new Date().toISOString(),
  method: 'stitch-mcp-http-curl',
  screens: entries,
}, null, 2));
" "$MANIFEST" "${entries[@]}"

rm -f "$MANIFEST.tmp"
echo "Done. Manifest: $MANIFEST"
