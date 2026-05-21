import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Monorepo: repo root has its own package.json; keep Turbopack scoped to web/
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
