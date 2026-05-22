#!/usr/bin/env node
/**
 * Regenerate PNG favicons from logo-yellow-vector.svg (run from web/).
 */
import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = path.join(root, "public/images/logo-yellow-vector.svg");

const targets = [
  ["public/favicon.svg", null],
  ["public/icon.png", 32],
  ["public/apple-touch-icon.png", 180],
  ["public/favicon.ico", 32],
  ["src/app/icon.svg", null],
  ["src/app/icon.png", 32],
  ["src/app/apple-icon.png", 180],
];

await cp(logo, path.join(root, "public/favicon.svg"));
await cp(logo, path.join(root, "src/app/icon.svg"));

const png32 = await sharp(logo).resize(32, 32).png().toBuffer();

for (const [rel, size] of targets) {
  if (size == null) continue;
  const out = path.join(root, rel);
  await mkdir(path.dirname(out), { recursive: true });
  if (rel.endsWith(".ico")) {
    await writeFile(out, await toIco([png32]));
  } else {
    await sharp(logo).resize(size, size).png().toFile(out);
  }
}

const apiAssets = path.join(root, "..", "api/src/assets");
await mkdir(apiAssets, { recursive: true });
await cp(logo, path.join(apiAssets, "favicon.svg"));
await cp(path.join(root, "public/icon.png"), path.join(apiAssets, "favicon.png"));
await cp(
  path.join(root, "public/apple-touch-icon.png"),
  path.join(apiAssets, "apple-touch-icon.png"),
);

const repoRoot = path.join(root, "..");
await cp(logo, path.join(repoRoot, "favicon.svg"));

console.log("Favicons synced from logo-yellow-vector.svg");
