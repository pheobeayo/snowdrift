"use client";

import { useReadContract } from "wagmi";
import { escrow } from "./escrow";

/** Contract SubmissionStatus enum order. */
export const SUBMISSION_STATUS = [
  "None",
  "Submitted",
  "Approved",
  "Rejected",
  "Disputed",
] as const;

export type SubmissionState = (typeof SUBMISSION_STATUS)[number];

export interface ChainSubmission {
  worker: `0x${string}`;
  proofData: string;
  status: number;
  rejectionReason: string;
  submittedAt: bigint;
}

/** A worker's submission on a task, with the enum decoded. */
export function useSubmission(taskId: string, worker?: `0x${string}`) {
  const { data, isLoading, refetch } = useReadContract({
    ...escrow,
    functionName: "getSubmission",
    args: [
      BigInt(taskId || "0"),
      worker ?? "0x0000000000000000000000000000000000000000",
    ],
    query: { enabled: !!worker && /^\d+$/.test(taskId) },
  });

  const submission = data as unknown as ChainSubmission | undefined;

  return {
    submission,
    state: (submission
      ? SUBMISSION_STATUS[submission.status]
      : "None") as SubmissionState,
    isLoading,
    refetch,
  };
}
