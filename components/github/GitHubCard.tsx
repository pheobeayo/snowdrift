"use client";

import Image from "next/image";
import { Github, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGitHub } from "@/hooks/useGitHub";


export function GitHubCard() {
  const { user, isConnected, isConnecting, connect } = useGitHub();

  if (!isConnected || !user) {
    return (
      <Button className="w-full" onClick={connect} disabled={isConnecting}>
        <Github /> {isConnecting ? "Connecting…" : "Connect GitHub"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line-2 bg-surface-2 px-3 py-2.5">
      <Image
        src={user.avatarUrl}
        alt={user.login}
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full"
        unoptimized
      />
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-ink-1">
          @{user.login}
        </p>
        <p className="text-[11px] text-ink-3">GitHub linked</p>
      </div>
    </div>
  );
}

/** Sign out of the GitHub session. */
export function GitHubLogoutButton({ onAfter }: { onAfter?: () => void }) {
  const { isConnected, disconnect } = useGitHub();

  if (!isConnected) return null;

  return (
    <button
      onClick={() => {
        disconnect();
        toast.success("GitHub disconnected");
        onAfter?.();
      }}
      className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-red-400 cursor-pointer"
    >
      <LogOut className="size-4" />
      Log out
    </button>
  );
}
