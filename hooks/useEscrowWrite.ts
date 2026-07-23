"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

/** Shared write plumbing: fire a write, then wait for the receipt. */
export function useEscrowWrite() {
  const {
    writeContract,
    writeContractAsync,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  return {
    writeContract,
    writeContractAsync,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
}
