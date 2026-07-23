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

export const SNOWDRIFT_ADDRESSES = {
  taskEscrow: "0xfa2FF5e050C02a899e8302fe2d78A646d4Ad124D",
  reputation: "0x4742a10E05a4F82472ACCF3C369504fe3F39e4ED",
  mockUsdc: "0xD98553415f535586CfA273D6cD6710F39ef94A96",
} as const;
