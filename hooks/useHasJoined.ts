"use client";

import { useAccount, useReadContract } from "wagmi";
import { escrow } from "./escrow";

/** Whether the connected wallet has joined the given task. */
export function useHasJoined(taskId: string) {
  const { address } = useAccount();
  return useReadContract({
    ...escrow,
    functionName: "hasJoined",
    args: [
      BigInt(taskId || "0"),
      address ?? "0x0000000000000000000000000000000000000000",
    ],
    query: { enabled: !!address && /^\d+$/.test(taskId) },
  });
}
