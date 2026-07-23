"use client";

import { escrow } from "./escrow";
import { useEscrowWrite } from "./useEscrowWrite";

/** Claim a worker slot on an open task. */
export function useJoinTask() {
  const w = useEscrowWrite();
  const joinTask = (taskId: string) =>
    w.writeContract({
      ...escrow,
      functionName: "joinTask",
      args: [BigInt(taskId)],
    });
  return { joinTask, ...w };
}
