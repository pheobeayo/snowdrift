import { ShieldCheck, Waves, Zap } from "lucide-react";

const primitives = [
  {
    icon: Zap,
    title: "Sub-second finality",
    body: "Avalanche C-Chain approval makes micro-milestone iteration friction-free.",
  },
  {
    icon: Waves,
    title: "Streaming splits",
    body: "Continuous token streams divide downstream to dependency repositories.",
  },
  {
    icon: ShieldCheck,
    title: "Non-custodial",
    body: "EscrowManager.sol holds funds. Releases are milestone-gated, never discretionary.",
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
