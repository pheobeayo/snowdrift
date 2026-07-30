import type { NextConfig } from "next";
import path from "path";


const EMPTY_ABS = path.resolve(__dirname, "lib/empty-module.ts");
const EMPTY_REL = "./lib/empty-module.ts"; // Turbopack wants a relative target

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  turbopack: {
    // Pin the workspace root so a stray lockfile in a parent directory
    // (e.g. ~/pnpm-lock.yaml) can't make Next infer the wrong root.
    root: __dirname,
    resolveAlias: {
      // One wildcard covers every @x402 subpath (core/*, evm/*, svm/*, …).
      "@x402/*": EMPTY_REL,
      accounts: EMPTY_REL,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      accounts: EMPTY_ABS,
    };
    config.plugins = config.plugins ?? [];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const webpack = require("webpack");
    // Catch every @x402/* specifier (bare scope + all subpaths).
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^@x402(\/|$)/, EMPTY_ABS)
    );
    return config;
  },
};

export default nextConfig;