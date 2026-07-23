"use client";

import { escrow } from "./escrow";
import { useEscrowWrite } from "./useEscrowWrite";

/** Poster approves a submission — pays the worker from escrow. */
export function useApproveSubmission() {
  const w = useEscrowWrite();
  const approveSubmission = (taskId: string, worker: `0x${string}`) =>
    w.writeContract({
      ...escrow,
      functionName: "approveSubmission",
      args: [BigInt(taskId), worker],
    });
  return { approveSubmission, ...w };
}
