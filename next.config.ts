import type { NextConfig } from "next";

/**
 * wagmi v3 ships optional Tempo/Coinbase-CDP connector code that imports
 * `@x402/*` and `accounts` — packages we don't use (and whose Solana peer
 * deps conflict). Alias them to an empty module for both Turbopack and
 * webpack so builds resolve cleanly.
 */
const optionalWagmiStubs = {
  "@x402/core/client": "./lib/empty-module.ts",
  "@x402/evm": "./lib/empty-module.ts",
  "@x402/evm/exact/client": "./lib/empty-module.ts",
  "@x402/svm/exact/client": "./lib/empty-module.ts",
  accounts: "./lib/empty-module.ts",
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  turbopack: {
    resolveAlias: optionalWagmiStubs,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(
        Object.entries(optionalWagmiStubs).map(([k, v]) => [
          k,
          require("path").resolve(__dirname, v),
        ])
      ),
    };
    return config;
  },
};

export default nextConfig;
