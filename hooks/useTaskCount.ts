"use client";

import { useReadContract } from "wagmi";
import { escrow } from "./escrow";

/** Total number of tasks ever created on the escrow contract. */
export function useTaskCount() {
  return useReadContract({ ...escrow, functionName: "taskCount" });
}
