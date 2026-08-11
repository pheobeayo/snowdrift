import Link from "next/link";
import { ArrowRight, GitMerge, Landmark } from "lucide-react";

const engines = [
  {
    icon: Landmark,
    eyebrow: "Engine A",
    title: "Freelance escrow",
    body: "Clients lock AVAX in a non-custodial contract. Funds release per milestone once the poster approves the work — pro-bono tasks run the same flow without a bounty.",
    href: "/task",
    cta: "Enter Tasks",
  },
  {
    icon: GitMerge,
    eyebrow: "Engine B",
    title: "Open-source hub",
    body: "A live index of Avalanche-ecosystem repositories and their open issues, so contributors can find real work to pick up in one place.",
    href: "/opensource",
    cta: "Enter Open Source",
  },
];

export function Engines() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs uppercase tracking-widest text-teal-500">
        Dual-engine architecture
      </p>
      <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Separate rails for client work and open source.
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {engines.map((e) => (
          <div
            key={e.title}
            className="card-glow group flex flex-col rounded-2xl border border-line-2 bg-surface-2 p-6 transition-colors hover:border-teal-700 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                <e.icon className="size-5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-3">
                {e.eyebrow}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{e.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">
              {e.body}
            </p>
            <Link
              href={e.href}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 transition-colors group-hover:text-teal-300"
            >
              {e.cta} <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}