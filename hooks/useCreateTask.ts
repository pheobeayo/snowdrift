"use client";

import { waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/config";
import { escrow } from "./escrow";
import { useEscrowWrite } from "./useEscrowWrite";
import type { TaskCategory } from "@/lib/tasks/data";

export interface CreateTaskInput {
  title: string;
  description: string;
  category: TaskCategory;
  /** Total bounty in AVAX (bountyPerWorker × maxWorkers = value sent).
   *  Pass 0 to post a pro-bono task — the contract treats it as unpaid. */
  bountyAvax: number;
  maxWorkers?: number;
  /** Unix seconds. */
  deadline: number;
}

function buildTx(input: CreateTaskInput) {
  const maxWorkers = input.maxWorkers ?? 1;
  const perWorkerWei = BigInt(
    Math.round((input.bountyAvax / maxWorkers) * 1e18)
  );
  return {
    args: [
      {
        title: input.title,
        description: input.description,
        category: input.category,
        bountyPerWorker: perWorkerWei,
        paymentToken:
          "0x0000000000000000000000000000000000000000" as `0x${string}`,
        maxWorkers,
        deadline: BigInt(input.deadline),
        verificationMethod: 0, // OnChainText
        verificationRef: "",
      },
    ] as const,
    value: perWorkerWei * BigInt(maxWorkers), // fee is 0 bps on Fuji
  };
}

/** Post a task, locking the bounty in escrow. */
export function useCreateTask() {
  const w = useEscrowWrite();

  function createTask(input: CreateTaskInput) {
    const { args, value } = buildTx(input);
    w.writeContract({ ...escrow, functionName: "createTask", args, value });
  }

  /** Fire the tx AND wait for the receipt — for async submit handlers. */
  async function createTaskAsync(input: CreateTaskInput) {
    const { args, value } = buildTx(input);
    const hash = await w.writeContractAsync({
      ...escrow,
      functionName: "createTask",
      args,
      value,
    });
    return waitForTransactionReceipt(wagmiConfig, { hash });
  }

  return { createTask, createTaskAsync, ...w };
}
