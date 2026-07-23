/* ────────────────────────────────────────────────────────────────
   TASKS DOMAIN — shared on-chain plumbing (Engine A only)
   Contract handle, chain struct type, and the mapper that turns
   SnowdriftTaskEscrow structs into the UI `Task` type.
   ──────────────────────────────────────────────────────────────── */

import { formatEther } from "viem";
import { taskEscrowAbi } from "@/lib/contracts/taskEscrowAbi";
import { SNOWDRIFT_ADDRESSES } from "@/config";
import {
  TASK_CATEGORIES,
  type Task,
  type TaskCategory,
  type TaskStatus,
} from "@/lib/tasks/data";

export const escrow = {
  address: SNOWDRIFT_ADDRESSES.taskEscrow as `0x${string}`,
  abi: taskEscrowAbi,
} as const;

// Contract enum order: Open, InProgress, Completed, Cancelled,
// Disputed, Extended, Past, Closed
const CHAIN_STATUS: Record<number, TaskStatus | null> = {
  0: "Open",
  1: "InProgress",
  2: "Completed",
  3: null, // Cancelled — hidden from browse
  4: "InProgress", // Disputed — surface as in-progress for now
  5: "Open", // Extended still accepts workers
  6: null, // Past — hidden from browse
  7: null, // Closed — hidden
};

export type ChainTask = {
  id: bigint;
  poster: `0x${string}`;
  title: string;
  description: string;
  category: string;
  isPaid: boolean;
  bountyPerWorker: bigint;
  paymentToken: `0x${string}`;
  maxWorkers: number;
  currentWorkers: number;
  approvedCount: number;
  deadline: bigint;
  extensionCount: number;
  status: number;
  verificationMethod: number;
  verificationRef: string;
  totalEscrowed: bigint;
};

export function toUiTask(t: ChainTask): Task | null {
  const status = CHAIN_STATUS[t.status];
  if (status === null || status === undefined) return null;

  const isUsdc =
    t.paymentToken.toLowerCase() ===
    SNOWDRIFT_ADDRESSES.mockUsdc.toLowerCase();

  const reward = t.isPaid
    ? isUsdc
      ? Number(t.bountyPerWorker) / 1e6
      : Number(formatEther(t.bountyPerWorker))
    : 0;

  const category = (TASK_CATEGORIES as readonly string[]).includes(t.category)
    ? (t.category as TaskCategory)
    : "Frontend";

  return {
    id: t.id.toString(),
    title: t.title,
    description: t.description,
    category,
    flow: t.isPaid ? "Paid" : "ProBono",
    reward: reward * t.maxWorkers,
    currency: isUsdc ? "USDC" : "AVAX",
    status,
    client: t.poster,
    deadline: new Date(Number(t.deadline) * 1000).toISOString().slice(0, 10),
    postedAt: "on-chain",
    estimatedHours: 0,
    skills: [],
    // The contract escrows one bounty per worker slot rather than
    // per-milestone; surface it as a single milestone so the detail
    // page's timeline still renders.
    milestones: [
      {
        id: 1,
        title: "Full deliverable",
        amount: reward,
        state: t.approvedCount > 0 ? "Released" : "Locked",
      },
    ],
    multisig: false,
  };
}
