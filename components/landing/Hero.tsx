import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Real counts from the indexer — keep these in sync with what's live,
// or wire them to the indexer API so they can never drift out of truth.
const heroStats = [
  { value: "5", label: "projects indexed" },
  { value: "14", label: "repositories" },
  { value: "46", label: "open issues" },
  { value: "0%", label: "platform fee" },
];

export function Hero() {
  return (
    <section className="teal-grid-bg relative overflow-hidden border-b border-line-1">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(20,196,144,0.14),transparent_65%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Badge className="mb-6">Avalanche C-Chain · Team 1 Mini Grant build</Badge>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl">
          Two engines.{" "}
          <span className="text-teal-400 text-glow">One contribution hub.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
          Snowdrift pairs milestone-locked freelance escrows with an
          open-source bounty engine that pays contributors the moment a pull
          request merges. Paid or pro-bono, every deliverable settles
          on-chain.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/task">
              Enter Tasks <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/opensource">Enter Open Source</Link>
          </Button>
        </div>
        <dl className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {heroStats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-mono text-2xl text-teal-300 sm:text-3xl">
                {s.value}
              </dd>
              <p className="mt-1 text-xs uppercase tracking-widest text-ink-3">
                {s.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}