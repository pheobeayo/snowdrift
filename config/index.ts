import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { avalancheFuji } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Reown Cloud project id — create one at https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set");
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [avalancheFuji];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

/* ── Snowdrift deployments (Fuji, chainId 43113) ─────────────────── */

/* ── Snowdrift deployments (Fuji, chainId 43113) ─────────────────── */

function requireAddress(name: string, value: string | undefined) {
  if (!value) throw new Error(`${name} is not set`);
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`${name} is not a valid address: ${value}`);
  }
  return value as `0x${string}`;
}

export const SNOWDRIFT_ADDRESSES = {
  taskEscrow: requireAddress(
    "NEXT_PUBLIC_TASK_ESCROW_ADDRESS",
    process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS
  ),
  reputation: requireAddress(
    "NEXT_PUBLIC_REPUTATION_ADDRESS",
    process.env.NEXT_PUBLIC_REPUTATION_ADDRESS
  ),
  mockUsdc: requireAddress(
    "NEXT_PUBLIC_MOCK_USDC_ADDRESS",
    process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS
  ),
} as const;