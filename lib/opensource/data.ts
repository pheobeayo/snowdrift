/* ────────────────────────────────────────────────────────────────
   OPEN-SOURCE DOMAIN — Engine B: Open-Source Hub (Drips model)
   Self-contained. Nothing in here is imported by the tasks
   domain, and nothing from lib/tasks is imported here.
   ──────────────────────────────────────────────────────────────── */

export type IssueKind = "Paid" | "Unpaid";
export type IssueState = "Open" | "Claimed" | "PR Open" | "Merged";

export interface OssProject {
  slug: string;
  org: string;
  repo: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  openBounties: number;
  bountyPool: number; // AVAX
  contributors: number;
  dependencySplit: number; // % streamed to dependencies
  tags: string[];
}

export interface OssIssue {
  id: string;
  projectSlug: string;
  number: number;
  title: string;
  kind: IssueKind;
  bounty: number; // AVAX; 0 for unpaid
  points: number; // wave points for unpaid work
  state: IssueState;
  labels: string[];
  openedAt: string;
  claimedBy?: string; // github handle
}

export interface Wave {
  number: number;
  name: string;
  startsAt: string;
  endsAt: string;
  status: "Live" | "Upcoming" | "Ended";
  participants: number;
  pointsDistributed: number;
  rewardPool: number; // AVAX
}

export const projects: OssProject[] = [
  {
    slug: "pangolindex",
    org: "pangolindex",
    repo: "exchange-contracts",
    url: "https://github.com/pangolindex",
    description:
      "Community-driven DEX on Avalanche. Bounties target router upgrades, fee-switch tooling, and SDK maintenance.",
    language: "Solidity",
    stars: 271,
    openBounties: 6,
    bountyPool: 940,
    contributors: 58,
    dependencySplit: 12,
    tags: ["DEX", "AMM", "Avalanche"],
  },
  {
    slug: "kite-counter",
    org: "gokite-ai",
    repo: "kite_counter_dapp",
    url: "https://github.com/gokite-ai/kite_counter_dapp",
    description:
      "Reference dApp for the Kite AI chain. Good-first-issue rich: UI polish, wallet edge cases, and example agent flows.",
    language: "TypeScript",
    stars: 89,
    openBounties: 4,
    bountyPool: 210,
    contributors: 23,
    dependencySplit: 8,
    tags: ["AI", "dApp", "Example"],
  },
  {
    slug: "solana-tx-parser",
    org: "debridge-finance",
    repo: "solana-tx-parser-public",
    url: "https://github.com/debridge-finance/solana-tx-parser-public",
    description:
      "Open-source Solana transaction parser by deBridge. Cross-ecosystem dependency tracked for recursive splits.",
    language: "TypeScript",
    stars: 156,
    openBounties: 3,
    bountyPool: 380,
    contributors: 31,
    dependencySplit: 15,
    tags: ["Parser", "Cross-chain", "Infra"],
  },
  {
    slug: "builders-hub",
    org: "ava-labs",
    repo: "builders-hub",
    url: "https://github.com/ava-labs/builders-hub",
    description:
      "Ava Labs' developer portal. Team 1 funds critical issues directly; payouts fire automatically on PR merge.",
    language: "TypeScript",
    stars: 412,
    openBounties: 9,
    bountyPool: 1620,
    contributors: 96,
    dependencySplit: 10,
    tags: ["Docs", "Portal", "Funded"],
  },
  {
    slug: "avalanchejs",
    org: "ava-labs",
    repo: "avalanchejs",
    url: "https://github.com/ava-labs/avalanchejs",
    description:
      "The official Avalanche JavaScript SDK. Unpaid contributions register on-chain activity points for retro drops.",
    language: "TypeScript",
    stars: 1834,
    openBounties: 5,
    bountyPool: 730,
    contributors: 142,
    dependencySplit: 18,
    tags: ["SDK", "Core", "Funded"],
  },
];

export const issues: OssIssue[] = [
  {
    id: "iss-01",
    projectSlug: "pangolindex",
    number: 512,
    title: "Router v3: support fee-on-transfer tokens in exact-out swaps",
    kind: "Paid",
    bounty: 260,
    points: 0,
    state: "Open",
    labels: ["solidity", "router", "bounty"],
    openedAt: "2026-07-08",
  },
  {
    id: "iss-02",
    projectSlug: "pangolindex",
    number: 498,
    title: "SDK: deprecate legacy pair fetcher, migrate examples to viem",
    kind: "Unpaid",
    bounty: 0,
    points: 120,
    state: "Claimed",
    labels: ["sdk", "good first issue"],
    openedAt: "2026-06-30",
    claimedBy: "chainsmith",
  },
  {
    id: "iss-03",
    projectSlug: "kite-counter",
    number: 41,
    title: "Handle wallet disconnect mid-transaction without stale state",
    kind: "Paid",
    bounty: 70,
    points: 0,
    state: "PR Open",
    labels: ["bug", "wallet"],
    openedAt: "2026-07-02",
    claimedBy: "oxidize-dev",
  },
  {
    id: "iss-04",
    projectSlug: "kite-counter",
    number: 38,
    title: "Add dark-mode tokens and prefers-color-scheme support",
    kind: "Unpaid",
    bounty: 0,
    points: 60,
    state: "Open",
    labels: ["ui", "good first issue"],
    openedAt: "2026-07-11",
  },
  {
    id: "iss-05",
    projectSlug: "solana-tx-parser",
    number: 127,
    title: "Parse Address Lookup Table extensions in versioned transactions",
    kind: "Paid",
    bounty: 180,
    points: 0,
    state: "Open",
    labels: ["parser", "v0-tx", "bounty"],
    openedAt: "2026-07-14",
  },
  {
    id: "iss-06",
    projectSlug: "builders-hub",
    number: 861,
    title: "Interactive L1 launch checklist loses state on locale switch",
    kind: "Paid",
    bounty: 140,
    points: 0,
    state: "Merged",
    labels: ["bug", "i18n"],
    openedAt: "2026-06-21",
    claimedBy: "pheobeayo",
  },
  {
    id: "iss-07",
    projectSlug: "builders-hub",
    number: 874,
    title: "Add Snowdrift escrow tutorial to integrations section",
    kind: "Unpaid",
    bounty: 0,
    points: 90,
    state: "Open",
    labels: ["docs", "help wanted"],
    openedAt: "2026-07-16",
  },
  {
    id: "iss-08",
    projectSlug: "avalanchejs",
    number: 1093,
    title: "P-Chain: expose L1 validator weight change builder",
    kind: "Paid",
    bounty: 310,
    points: 0,
    state: "Claimed",
    labels: ["p-chain", "feature", "bounty"],
    openedAt: "2026-07-05",
    claimedBy: "subzero-labs",
  },
  {
    id: "iss-09",
    projectSlug: "avalanchejs",
    number: 1101,
    title: "Improve TSDoc coverage for UTXO selection helpers",
    kind: "Unpaid",
    bounty: 0,
    points: 75,
    state: "Open",
    labels: ["docs", "good first issue"],
    openedAt: "2026-07-18",
  },
];

export const waves: Wave[] = [
  {
    number: 3,
    name: "Avalanche Wave 3",
    startsAt: "2026-07-20",
    endsAt: "2026-07-27",
    status: "Live",
    participants: 214,
    pointsDistributed: 18450,
    rewardPool: 5200,
  },
  {
    number: 4,
    name: "Avalanche Wave 4",
    startsAt: "2026-08-03",
    endsAt: "2026-08-10",
    status: "Upcoming",
    participants: 0,
    pointsDistributed: 0,
    rewardPool: 6000,
  },
  {
    number: 2,
    name: "Avalanche Wave 2",
    startsAt: "2026-06-22",
    endsAt: "2026-06-29",
    status: "Ended",
    participants: 187,
    pointsDistributed: 16120,
    rewardPool: 4800,
  },
];

export const ossStats = {
  trackedRepos: 5,
  openBounties: 27,
  totalPool: 3880, // AVAX
  wavePoints: 18450,
};

export const myContribution = {
  handle: "pheobeayo",
  wavePoints: 640,
  waveRank: 12,
  mergedPrs: 4,
  streamedIn: 86.4, // AVAX streaming in from splits
  splitOut: 12, // % routed to dependencies
};

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function issueStateBadge(state: IssueState) {
  switch (state) {
    case "Open":
      return "open" as const;
    case "Claimed":
      return "progress" as const;
    case "PR Open":
      return "review" as const;
    case "Merged":
      return "done" as const;
  }
}
