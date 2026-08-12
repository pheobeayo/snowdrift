# Snowdrift

A coordination layer for Avalanche ecosystem work — covering both code and everything around it.

**Live build:** https://snowdrift-aval.vercel.app

Snowdrift has two sides that share one task flow:

- **Open-source discovery.** An index of contributor-ready GitHub issues across Avalanche projects, sourced from the [Electric Capital ecosystem taxonomy](https://github.com/electric-capital/crypto-ecosystems) rather than a hand-picked repo list. Developers filter by project, language and difficulty, then contribute on GitHub as usual.
- **Ecosystem task management.** Beyond code: ambassador programs, content, translation, events, design, moderation. Volunteer tasks need no payout and produce a verifiable contribution record; sponsored tasks lock funds in escrow, released on approval. Both run the same flow.

## Status

The discovery and task interface are **built and deployed**. The on-chain settlement layer is **live on Avalanche Fuji testnet** (see addresses below) and is the focus of ongoing work toward C-Chain mainnet.

The landing page reports real indexer counts (5 projects, 14 repositories, 46 open issues today) rather than projected figures — expanding toward full Electric Capital taxonomy coverage.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (`@theme` tokens, no config file)
- shadcn-style components on the unified `radix-ui` package
- lucide-react · react-hook-form + zod · sonner
- Reown AppKit + wagmi + viem for wallet connection and contract calls
- Solidity contracts (Foundry), UUPS-upgradeable, deployed to Avalanche Fuji

## Getting started

This project uses **Yarn 1 (Classic)**.

```bash
yarn install
yarn dev
```

Open http://localhost:3000.

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_REOWN_PROJECT_ID=      # from https://dashboard.reown.com
NEXT_PUBLIC_TASK_ESCROW_ADDRESS=   # Fuji deployment (below)
NEXT_PUBLIC_REPUTATION_ADDRESS=
NEXT_PUBLIC_MOCK_USDC_ADDRESS=
```

The app won't start without the Reown project id and the contract addresses.

## Deployed contracts (Avalanche Fuji, chainId 43113)

| Contract | Address |
| --- | --- |
| SnowdriftTaskEscrow (proxy) | `0xfa2FF5e050C02a899e8302fe2d78A646d4Ad124D` |
| SnowdriftReputation (proxy) | `0x4742a10E05a4F82472ACCF3C369504fe3F39e4ED` |
| MockUSDC | `0xD98553415f535586CfA273D6cD6710F39ef94A96` |

All three are source-verified on [testnet Snowtrace](https://testnet.snowtrace.io). The contracts live in a separate Foundry project (`snowdrift-foundry`).

## Structure

```
app/
  page.tsx                    Landing page
  (tasks)/                    TASKS dashboard — route group, no path segment
    layout.tsx                Tasks shell — sidebar with wallet connect
    task/
      page.tsx                Browse + filters (reads on-chain tasks)
      post/page.tsx           Post a task (RHF + zod, milestone builder)
      [id]/page.tsx           Task detail — milestone escrow, live actions
  opensource/                 OPEN-SOURCE dashboard
    layout.tsx                OSS shell — sidebar with GitHub connect (stub)
    page.tsx                  Discovery overview
    projects/page.tsx         Indexed Avalanche repositories
    issues/page.tsx           Contributor-ready issues (filterable)
    rewards/page.tsx          Contribution record
hooks/                        wagmi hooks for the task escrow (one per file)
  escrow.ts                   Contract handle + chain→UI mapping
  useChainTasks.ts            All on-chain tasks
  useCreateTask.ts            Post a task (locks escrow)
  useJoinTask.ts              …plus submit/approve/read hooks
lib/
  tasks/data.ts               Tasks domain — types + constants only
  opensource/data.ts          OSS domain — independent
config/
  index.ts                    wagmi/Reown adapter + address constants (from env)
context/
  ReownProvider.tsx           WagmiProvider + AppKit + react-query
components/
  landing/                    Landing sections (Hero, Engines, Primitives…)
  layout/                     Sidebars, shells, engine-switch link
  tasks/                      Task components (browse, detail, post)
  wallet/ · github/           Wallet card + GitHub connect stub
  ui/                         Themed shadcn-style primitives
```

### Two separate dashboards

The two sides are independent apps behind the marketing landing page. `/task` connects a **wallet** (Reown); `/opensource` connects **GitHub** (currently a stub, ready for real OAuth). Switching between them via the sidebar cross-link ends the current side's session — leaving `/task` disconnects the wallet, leaving `/opensource` clears the GitHub session — so the two never share auth state.

`lib/tasks` and `lib/opensource` never import from each other, and each route segment only touches its own domain.

## On-chain integration

The tasks side reads and writes `SnowdriftTaskEscrow` through wagmi. `lib/tasks/data.ts` holds only types and constants; live data comes from the `hooks/` layer, which maps contract structs onto the UI `Task` type. Posting a task locks the bounty in escrow; the detail page drives the real accept → submit → approve → release flow with transaction confirmations.

Worker verification is designed for a Web3Auth-style backend attestation (signature redemption on-chain), with no third-party identity dependency. It ships relaxed on Fuji (`verificationRequired = false`) so the flow can be demoed before the auth backend is live.

## Design tokens

Teal accents (`#14c490` / `#0d9e75`) on green-tinted near-black surfaces. Fonts: Syne (display), DM Sans (body), DM Mono (numbers/addresses). All tokens live in `app/globals.css` under `@theme`.

