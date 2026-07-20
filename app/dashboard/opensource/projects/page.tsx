import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  GitFork,
  Star,
  Users,
  Waypoints,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { projects } from "@/lib/opensource/data";

const languageDot: Record<string, string> = {
  Solidity: "#c084fc",
  TypeScript: "#5aa9e6",
  Rust: "#f4b860",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Tracked projects
          </h2>
          <p className="mt-1 max-w-xl text-sm text-ink-2">
            Registered repositories with live GitHub-to-chain sync. Bounties sit
            on issue numbers; merges trigger payouts. Each project streams a
            split of inflows to its dependencies.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/dashboard/opensource/issues">
            View all bounty issues <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <Card
            key={p.slug}
            className="card-glow flex flex-col transition-colors hover:border-teal-700"
          >
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-teal-400">
                    <GitFork className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-ink-3">{p.org}/</p>
                    <h3 className="truncate font-display text-base font-semibold text-ink-1">
                      {p.repo}
                    </h3>
                  </div>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.org}/${p.repo} on GitHub`}
                  className="rounded-md p-1.5 text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink-1"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>

              <p className="text-sm leading-relaxed text-ink-2">{p.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line-1 pt-4 text-xs text-ink-2 sm:grid-cols-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: languageDot[p.language] ?? "#95b8a5" }}
                    aria-hidden
                  />
                  {p.language}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="size-3.5 text-ink-3" /> {p.stars}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-ink-3" /> {p.contributors}
                </span>
                <span
                  className="flex items-center gap-1.5"
                  title="Share of inflows streamed to dependencies"
                >
                  <Waypoints className="size-3.5 text-teal-500" /> {p.dependencySplit}% split
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-teal-700/40 bg-teal-500/5 px-4 py-2.5">
                <span className="text-xs text-ink-2">
                  {p.openBounties} open{" "}
                  {p.openBounties === 1 ? "bounty" : "bounties"}
                </span>
                <span className="font-mono text-sm text-teal-300">
                  {p.bountyPool.toLocaleString()} AVAX pool
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
