# Snowdrift Protocol — Frontend

Dual-engine contribution hub on Avalanche: milestone-locked freelance escrows (Engine A) and an open-source bounty/points engine following the Drips Wave model (Engine B).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (`@theme` tokens, no config file)
- shadcn-style components on the unified `radix-ui` package
- lucide-react · react-hook-form + zod · sonner

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  page.tsx                      Landing page
  dashboard/
    layout.tsx                  Sidebar shell (collapsible modules)
    page.tsx                    Overview — one summary card per engine
    tasks/                      ENGINE A — freelance escrow (Verko flow)
      page.tsx                  Browse + filters
      post/page.tsx             Post a task (RHF + zod, milestone builder)
      [id]/                     Detail — milestone escrow timeline
    opensource/                 ENGINE B — open-source hub (Drips Wave)
      page.tsx                  Wave overview + programs
      projects/page.tsx         Tracked GitHub repos
      issues/page.tsx           Bounty board (paid / unpaid)
      rewards/page.tsx          Points, retro drops, dependency splits
lib/
  tasks/data.ts                 Tasks domain — fully isolated
  opensource/data.ts            OSS domain — fully isolated
components/
  layout/                       Sidebar, Topbar, DashboardShell
  ui/                           Themed shadcn-style primitives
  tasks/                        Engine A components only
```

The two engines never import from each other — `lib/tasks` and `lib/opensource` are independent domains, and each route segment only touches its own module.

## Design tokens

TrustLance palette: teal accents (`#14c490` / `#0d9e75`) on green-tinted near-black surfaces. Fonts: Syne (display), DM Sans (body), DM Mono (numbers/addresses). All tokens live in `app/globals.css` under `@theme`.

## Wiring it up

Replace `lib/tasks/data.ts` and `lib/opensource/data.ts` with hooks against `EscrowManager.sol` / `ContributionStreamer.sol` (wagmi/viem) and the GitHub webhook backend. The UI reads only from those modules, so swapping mock data for live reads is contained.
