/* ────────────────────────────────────────────────────────────────
   TASKS DOMAIN — Engine A: Commercial Freelancing Portal
   Self-contained. Nothing in here is imported by the open-source
   domain, and nothing from lib/opensource is imported here.
   ──────────────────────────────────────────────────────────────── */

export type TaskStatus = "Open" | "InProgress" | "Delivered" | "Approved" | "Completed";
export type TaskFlow = "Paid" | "ProBono";
export type TaskCategory =
  | "Smart Contracts"
  | "Frontend"
  | "Auditing"
  | "Technical Writing"
  | "Design"
  | "Data / Indexing";

export interface TaskMilestone {
  id: number;
  title: string;
  amount: number; // AVAX; 0 for pro-bono
  state: "Locked" | "Submitted" | "Released";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  flow: TaskFlow;
  reward: number; // total AVAX; 0 for pro-bono
  currency: "AVAX" | "USDC";
  status: TaskStatus;
  client: string; // wallet address
  worker?: string;
  deadline: string;
  postedAt: string;
  estimatedHours: number;
  skills: string[];
  milestones: TaskMilestone[];
  multisig: boolean;
}

export const TASK_CATEGORIES: TaskCategory[] = [
  "Smart Contracts",
  "Frontend",
  "Auditing",
  "Technical Writing",
  "Design",
  "Data / Indexing",
];

export interface ReputationTier {
  name: string;
  minTasks: number;
  perk: string;
}

/** Tiers mirror SnowdriftReputation._calculateTier on-chain. */
export const reputationTiers: ReputationTier[] = [
  { name: "Flurry", minTasks: 0, perk: "Access to open tasks" },
  { name: "Snowfall", minTasks: 5, perk: "Priority matching on paid tasks" },
  { name: "Drift", minTasks: 20, perk: "Multisig arbiter eligibility" },
  { name: "Avalanche", minTasks: 50, perk: "Featured profile + fee-free posts" },
];

export function statusBadgeVariant(status: TaskStatus) {
  switch (status) {
    case "Open":
      return "open" as const;
    case "InProgress":
      return "progress" as const;
    case "Delivered":
      return "review" as const;
    case "Approved":
      return "review" as const;
    case "Completed":
      return "done" as const;
  }
}
