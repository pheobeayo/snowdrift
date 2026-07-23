"use client";

import { useReadContract } from "wagmi";
import { escrow } from "./escrow";

/** Addresses that have joined the given task. */
export function useTaskWorkers(taskId: string) {
  return useReadContract({
    ...escrow,
    functionName: "getTaskWorkers",
    args: [BigInt(taskId || "0")],
    query: { enabled: /^\d+$/.test(taskId) },
  });
}
