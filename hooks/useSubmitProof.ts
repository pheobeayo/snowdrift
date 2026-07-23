"use client";

import { escrow } from "./escrow";
import { useEscrowWrite } from "./useEscrowWrite";

/** Submit proof of work for a joined task. */
export function useSubmitProof() {
  const w = useEscrowWrite();
  const submitProof = (taskId: string, proof: string) =>
    w.writeContract({
      ...escrow,
      functionName: "submitProof",
      args: [BigInt(taskId), proof],
    });
  return { submitProof, ...w };
}
