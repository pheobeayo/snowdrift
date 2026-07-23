"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { LogOut, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { shortAddress } from "@/lib/utils";

/** Sidebar wallet card: opens the Reown modal when disconnected,
 *  shows the address + network when connected. */
export function WalletCard() {
  const { open } = useAppKit();
  const { address, isConnected, chain } = useAccount();

  if (!isConnected || !address) {
    return (
      <Button className="w-full" onClick={() => open()}>
        <Wallet /> Connect wallet
      </Button>
    );
  }

  return (
    <button
      onClick={() => open({ view: "Account" })}
      className="flex w-full items-center gap-3 rounded-xl border border-line-2 bg-surface-2 px-3 py-2.5 text-left transition-colors hover:border-line-3 cursor-pointer"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
        <Wallet className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-xs text-ink-1">
          {shortAddress(address)}
        </p>
        <p className="text-[11px] text-ink-3">
          {chain?.name ?? "Unsupported network"}
        </p>
      </div>
    </button>
  );
}

/** Sidebar log-out: disconnects the wallet session. */
export function LogoutButton({ onAfter }: { onAfter?: () => void }) {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) return null;

  return (
    <button
      onClick={() => {
        disconnect();
        toast.success("Wallet disconnected");
        onAfter?.();
      }}
      className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-red-400 cursor-pointer"
    >
      <LogOut className="size-4" />
      Log out
    </button>
  );
}
