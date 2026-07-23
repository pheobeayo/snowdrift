"use client";

import { useReadContract } from "wagmi";
import { escrow, toUiTask, type ChainTask } from "./escrow";

/** A single on-chain task by id, mapped to the UI Task type. */
export function useChainTask(taskId: string) {
  const { data, isLoading, refetch } = useReadContract({
    ...escrow,
    functionName: "getTask",
    args: [BigInt(taskId || "0")],
    query: { enabled: /^\d+$/.test(taskId) },
  });

  return {
    task: data ? toUiTask(data as unknown as ChainTask) : null,
    isLoading,
    refetch,
  };
}
