"use client";

import * as React from "react";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, cookieToInitialState, type Config } from "wagmi";
import {
  projectId,
  networks,
  wagmiAdapter,
  wagmiConfig,
} from "@/config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000, // Fuji finality is ~2s; keep reads snappy but cached
    },
  },
});

const metadata = {
  name: "Snowdrift Protocol",
  description:
    "Dual-engine contribution hub on Avalanche — milestone escrow for freelance work and merge-triggered bounties for open source.",
  url: "https://snowdrift.example.com",
  icons: ["https://snowdrift.example.com/icon.png"],
};

// Reown AppKit — modal config lives at module scope, created once.
createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId!,
  networks,
  defaultNetwork: networks[0],
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false, 
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#14c490",
    "--w3m-color-mix": "#080d0a",
    "--w3m-color-mix-strength": 30,
    "--w3m-border-radius-master": "2px",
  },
});

export function ReownProvider({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
