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

export const tasks: Task[] = [
  {
    id: "task-01",
    title: "Subnet fee-config dashboard widget",
    description:
      "Build a React widget that reads dynamic fee configuration from an Avalanche L1 (subnet) RPC and renders gas price trends over the last 24h. Must handle RPC failures gracefully and support both Fuji and mainnet endpoints.",
    category: "Frontend",
    flow: "Paid",
    reward: 180,
    currency: "AVAX",
    status: "Open",
    client: "0x8Fa3bC71e29D44f5A2c09E7d81b03D5cE640aa12",
    deadline: "2026-08-14",
    postedAt: "2026-07-12",
    estimatedHours: 20,
    skills: ["React", "TypeScript", "viem", "Recharts"],
    multisig: false,
    milestones: [
      { id: 1, title: "RPC data layer + hooks", amount: 60, state: "Locked" },
      { id: 2, title: "Chart UI + error states", amount: 80, state: "Locked" },
      { id: 3, title: "Fuji/mainnet toggle + docs", amount: 40, state: "Locked" },
    ],
  },
  {
    id: "task-02",
    title: "EscrowManager.sol invariant test suite",
    description:
      "Write a Foundry invariant + fuzz test suite for a milestone escrow contract: deposits always match locked balances, releases only follow confirmations, and 2-of-3 multisig paths cannot bypass milestone order.",
    category: "Auditing",
    flow: "Paid",
    reward: 420,
    currency: "AVAX",
    status: "InProgress",
    client: "0x1B44d0E9aa817cfe33208bB6cD5F8f19E2Ac0533",
    worker: "0x9E21fA6b30C87d34a11e5B0d64C1fD08a37Bc901",
    deadline: "2026-08-02",
    postedAt: "2026-07-01",
    estimatedHours: 40,
    skills: ["Solidity", "Foundry", "Fuzzing"],
    multisig: true,
    milestones: [
      { id: 1, title: "Invariant harness + handlers", amount: 160, state: "Released" },
      { id: 2, title: "Multisig path fuzzing", amount: 160, state: "Submitted" },
      { id: 3, title: "Report + CI integration", amount: 100, state: "Locked" },
    ],
  },
  {
    id: "task-03",
    title: "Translate onboarding docs to French",
    description:
      "Translate the Snowdrift contributor onboarding guide (~4,200 words) to French. Technical vocabulary must stay consistent with the existing glossary. Delivered as Markdown with unchanged frontmatter.",
    category: "Technical Writing",
    flow: "Paid",
    reward: 45,
    currency: "AVAX",
    status: "Open",
    client: "0xF20cD1a4E7B98332A5CB60d417E92b3a08D7fE45",
    deadline: "2026-08-08",
    postedAt: "2026-07-15",
    estimatedHours: 8,
    skills: ["French", "Markdown", "Docs"],
    multisig: false,
    milestones: [{ id: 1, title: "Full translation delivered", amount: 45, state: "Locked" }],
  },
  {
    id: "task-04",
    title: "Mentor a first-time Solidity contributor",
    description:
      "Pro-bono mentorship: pair with a newcomer for three one-hour sessions covering testing patterns and PR etiquette. Completion mints a Soulbound mentorship badge — the escrow contract acts as a cryptographic work-signoff registry.",
    category: "Smart Contracts",
    flow: "ProBono",
    reward: 0,
    currency: "AVAX",
    status: "Open",
    client: "0x77Ae09B12dE4f81C56a30D9cB2E64F1a0d83Cb20",
    deadline: "2026-08-30",
    postedAt: "2026-07-10",
    estimatedHours: 3,
    skills: ["Solidity", "Mentorship"],
    multisig: false,
    milestones: [
      { id: 1, title: "Session 1 — testing patterns", amount: 0, state: "Locked" },
      { id: 2, title: "Session 2 — PR walkthrough", amount: 0, state: "Locked" },
      { id: 3, title: "Session 3 — merge & badge mint", amount: 0, state: "Locked" },
    ],
  },
  {
    id: "task-05",
    title: "Design escrow status iconography set",
    description:
      "Design a 12-icon set for escrow states (locked, streaming, released, disputed, reclaimed…) in a single-weight outline style consistent with lucide. Deliver as optimized SVG sprites.",
    category: "Design",
    flow: "Paid",
    reward: 95,
    currency: "AVAX",
    status: "Delivered",
    client: "0x40Bc2fE1D93a70C5e6a8F14bD02937Ce51Aa6d08",
    worker: "0xA8e33C09B14dD7f2065cE1B9a3F60D24c98Ef711",
    deadline: "2026-07-25",
    postedAt: "2026-06-28",
    estimatedHours: 14,
    skills: ["Figma", "SVG", "Iconography"],
    multisig: false,
    milestones: [
      { id: 1, title: "6 core state icons", amount: 50, state: "Released" },
      { id: 2, title: "6 extended icons + sprite", amount: 45, state: "Submitted" },
    ],
  },
  {
    id: "task-06",
    title: "Index PR-merge payouts into a subgraph",
    description:
      "Stand up a subgraph indexing BountyReleased and StreamOpened events, exposing per-contributor payout history. Include entity schema review and a hosted deployment runbook.",
    category: "Data / Indexing",
    flow: "Paid",
    reward: 260,
    currency: "USDC",
    status: "Open",
    client: "0x02dD3Fb6A18C97e40B25a6F0eD13C88a5F30Be77",
    deadline: "2026-08-20",
    postedAt: "2026-07-17",
    estimatedHours: 30,
    skills: ["The Graph", "AssemblyScript", "GraphQL"],
    multisig: true,
    milestones: [
      { id: 1, title: "Schema + mappings", amount: 120, state: "Locked" },
      { id: 2, title: "Deployment + runbook", amount: 140, state: "Locked" },
    ],
  },
  {
    id: "task-07",
    title: "Review pro-bono grant application drafts",
    description:
      "Volunteer review of three ecosystem grant applications from first-time teams. Provide structured written feedback. Completion registers on the signoff registry and mints a reviewer badge.",
    category: "Technical Writing",
    flow: "ProBono",
    reward: 0,
    currency: "AVAX",
    status: "Completed",
    client: "0x5C10aB7fD2E83c94B06a1De45F92C7b3a8D0Ee34",
    worker: "0x33Fa8C02dB61E97c50A4bE2D19F30Ca6b7D8Af55",
    deadline: "2026-07-05",
    postedAt: "2026-06-12",
    estimatedHours: 6,
    skills: ["Grants", "Review"],
    multisig: false,
    milestones: [
      { id: 1, title: "Three structured reviews", amount: 0, state: "Released" },
    ],
  },
];

export const taskStats = {
  inEscrow: 12840, // AVAX
  activeTasks: 47,
  releaseRate: 98.2, // %
  badgesMinted: 312,
};

export interface ReputationTier {
  name: string;
  minTasks: number;
  perk: string;
}

export const reputationTiers: ReputationTier[] = [
  { name: "Flurry", minTasks: 0, perk: "Access to open tasks" },
  { name: "Snowfall", minTasks: 5, perk: "Priority matching on paid tasks" },
  { name: "Drift", minTasks: 15, perk: "Multisig arbiter eligibility" },
  { name: "Avalanche", minTasks: 40, perk: "Featured profile + fee-free posts" },
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
