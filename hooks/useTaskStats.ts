"use client";

import { useChainTasks } from "./useChainTasks";

/** Live aggregates derived from on-chain tasks — replaces mock taskStats. */
export function useTaskStats() {
  const { tasks, isLoading } = useChainTasks();

  const openTasks = tasks.filter((t) => t.status === "Open").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  // Escrow still held: paid tasks that haven't settled.
  const inEscrow = tasks
    .filter((t) => t.flow === "Paid" && t.status !== "Completed")
    .reduce((sum, t) => sum + t.reward, 0);

  const releaseRate = tasks.length
    ? Math.round((completed / tasks.length) * 1000) / 10
    : 0;

  return {
    inEscrow,
    openTasks,
    activeTasks: tasks.length,
    completed,
    releaseRate,
    isLoading,
  };
}
