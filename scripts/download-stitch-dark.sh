#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_KEY="${STITCH_API_KEY:-}"
PROJECT_ID="3984967297086363189"
OUT_DIR="$ROOT/stitch/screens-dark"
MANIFEST="$ROOT/stitch/manifest-dark.json"
PUBLIC_DIR="$ROOT/web/public/screens-dark"

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

mkdir -p "$OUT_DIR" "$PUBLIC_DIR"

declare -a SCREENS=(
  "bc5bd4d5f88c4457abc51d6cab6dc6fe|01-culture-intel-mobile-dark"
  "a1e745b30ca647ee8e01e8d0f9a54405|02-landing-page-dark"
  "4eb987000ecc474798a4ca20a71620ae|03-anonymous-feed-dark"
  "8d64ce38e3414a02978ca1ac7f4fe5f3|04-signup-verification-dark"
  "086c785f4af441bdb8c0992ce1bd5f37|05-trending-feed-dark"
  "5d808d71599e4943966e3ffe7e729bbf|06-culture-intel-dark"
  "437810520b9f443fb1cad0d85e74f74f|07-landing-page-mobile-dark"
  "0a3381d64dff484b8a1fdb567de24f4d|08-anonymous-feed-mobile-dark"
  "13dd2838761e4e6fb60cbfc0dff78a3d|09-signup-verification-mobile-dark"
  "21be07ccea6b457f9342664ba8cd4664|10-trending-feed-mobile-dark"
  "1365d99c8adb428f8acb1109a5e63273|11-org-admin-mobile-dark"
  "asset-stub-assets-f4671df3a03040fbbf539c2d8c0a499b-1779370728122|12-design-system-dark"
)

call_get_screen() {
  local screen_id="$1"
  curl -sS -X POST "https://stitch.googleapis.com/mcp" \
    -H "Content-Type: application/json" \
    -H "X-Goog-Api-Key: $API_KEY" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"get_screen\",\"arguments\":{\"name\":\"projects/${PROJECT_ID}/screens/${screen_id}\",\"projectId\":\"${PROJECT_ID}\",\"screenId\":\"${screen_id}\"}}}"
}

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
    cp "$OUT_DIR/${slug}.html" "$PUBLIC_DIR/${slug}.html"
    echo "  saved ${slug}.html"
  fi

  if [[ -n "$image_url" ]]; then
    curl -fsSL "$image_url" -o "$OUT_DIR/${slug}.png"
    cp "$OUT_DIR/${slug}.png" "$PUBLIC_DIR/${slug}.png"
    echo "  saved ${slug}.png"
  fi

  title="$(node -e "console.log(JSON.parse(process.argv[1]).title)" "$parsed")"
  device="$(node -e "console.log(JSON.parse(process.argv[1]).deviceType||'')" "$parsed")"
  entries+=("{\"id\":\"$screen_id\",\"slug\":\"$slug\",\"title\":$(node -e "console.log(JSON.stringify(process.argv[1]))" "$title"),\"deviceType\":\"$device\",\"files\":{\"html\":\"stitch/screens-dark/${slug}.html\",\"png\":\"stitch/screens-dark/${slug}.png\",\"publicHtml\":\"web/public/screens-dark/${slug}.html\",\"publicPng\":\"web/public/screens-dark/${slug}.png\"},\"status\":\"ok\"}")
done

node -e "
const fs = require('fs');
const manifestPath = process.argv[1];
const entries = process.argv.slice(2).map((e) => JSON.parse(e));
fs.writeFileSync(manifestPath, JSON.stringify({
  projectId: '$PROJECT_ID',
  projectTitle: 'MURMUR Anonymous Intelligence Platform',
  theme: 'dark',
  downloadedAt: new Date().toISOString(),
  method: 'stitch-mcp-http-curl',
  screens: entries,
}, null, 2));
" "$MANIFEST" "${entries[@]}"

echo "Done. Manifest: $MANIFEST"
