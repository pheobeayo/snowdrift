"use client";

import { useReadContracts } from "wagmi";
import { escrow, toUiTask, type ChainTask } from "./escrow";
import { useTaskCount } from "./useTaskCount";
import type { Task } from "@/lib/tasks/data";

/** All on-chain tasks, mapped to the UI Task type. */
export function useChainTasks() {
  const { data: count, isLoading: countLoading } = useTaskCount();

  const ids = count
    ? Array.from({ length: Number(count) }, (_, i) => BigInt(i + 1))
    : [];

  const { data, isLoading, refetch } = useReadContracts({
    // Cast keeps TS from expanding the 113-entry ABI across a dynamic
    // array (TS2589: excessively deep instantiation).
    contracts: ids.map((id) => ({
      ...escrow,
      functionName: "getTask",
      args: [id],
    })) as unknown as readonly [],
    query: { enabled: ids.length > 0 },
  });

  const results = (data ?? []) as {
    status: "success" | "failure";
    result: unknown;
  }[];
  const tasks: Task[] = results
    .filter((r) => r.status === "success")
    .map((r) => toUiTask(r.result as unknown as ChainTask))
    .filter((t): t is Task => t !== null);

  return { tasks, isLoading: countLoading || isLoading, refetch };
}
