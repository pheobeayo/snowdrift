import { GitMerge, ShieldCheck, Zap } from "lucide-react";

// Only claims that are actually true of the deployed contracts and app.
const primitives = [
  {
    icon: Zap,
    title: "Sub-second finality",
    body: "Built on Avalanche C-Chain, so milestone approvals and payouts confirm in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Non-custodial escrow",
    body: "SnowdriftTaskEscrow holds the bounty on-chain. Releases are milestone-gated and only the poster can approve — funds refund automatically if a task expires.",
  },
  {
    icon: GitMerge,
    title: "Open-source discovery",
    body: "An index of Avalanche-ecosystem repositories and their open issues, drawn from the Electric Capital taxonomy and expanding.",
  },
];

export function Primitives() {
  return (
    <section className="border-t border-line-1 bg-surface-1/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6">
        {primitives.map((p) => (
          <div key={p.title}>
            <p.icon className="size-5 text-teal-500" />
            <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}