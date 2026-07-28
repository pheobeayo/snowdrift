import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  FolderGit2,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ossStats, waves } from "@/lib/opensource/data";

export default function OpenSourcePage() {
  const live = waves.find((w) => w.status === "Live");
  const ordered = [...waves].sort((a, b) => b.number - a.number);

  return (
    <div className="space-y-8">
      
      <section className="teal-grid-bg relative overflow-hidden rounded-2xl border border-line-2 bg-surface-1 p-6 sm:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top_left,rgba(20,196,144,0.16),transparent_60%)]"
          aria-hidden
        />
        <Badge variant="points">
          <Waves className="size-3" /> Snowdrift
        </Badge>
        <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight sm:text-3xl">
          One-week contribution sprints across the Avalanche ecosystem.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-base">
          During a Drift, merged pull requests earn Points. Points set your
          weight in retro-active reward distributions and automated split
          allocations — paid bounties settle instantly on merge, no admin in
          the loop.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/opensource/issues">
              Find an issue <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/opensource/projects">
              <FolderGit2 /> Tracked projects
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { value: ossStats.trackedRepos, label: "tracked repos" },
          { value: ossStats.openBounties, label: "open bounties" },
          { value: `${ossStats.totalPool.toLocaleString()} AVAX`, label: "bounty pool" },
          {
            value: ossStats.wavePoints.toLocaleString(),
            label: `points in Wave ${live?.number ?? "—"}`,
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="font-mono text-2xl text-teal-300">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-ink-3">
                {s.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Drift programs */}
      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold">Drift programs</h3>
        <div className="space-y-3">
          {ordered.map((w) => (
            <Card
              key={w.number}
              className={
                w.status === "Live" ? "border-teal-700/70 card-glow" : undefined
              }
            >
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-500/10 font-mono text-sm text-teal-300">
                    D{w.number}
                  </span>
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-display font-semibold">
                      {w.name}
                      <Badge
                        variant={
                          w.status === "Live"
                            ? "open"
                            : w.status === "Upcoming"
                              ? "review"
                              : "done"
                        }
                      >
                        {w.status}
                      </Badge>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-2">
                      <CalendarRange className="size-3.5" /> {w.startsAt} →{" "}
                      {w.endsAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-mono text-teal-300">
                      {w.rewardPool.toLocaleString()} AVAX
                    </p>
                    <p className="text-[11px] text-ink-3">reward pool</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="flex items-center justify-end gap-1 font-mono text-ink-1">
                      <Users className="size-3.5 text-ink-3" /> {w.participants}
                    </p>
                    <p className="text-[11px] text-ink-3">contributors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How points work */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-teal-400" /> How Points work
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-relaxed text-ink-2 sm:grid-cols-3">
          <p>
            <span className="font-medium text-ink-1">Contribute.</span> Claim an
            unpaid issue and merge your PR during a live Drift — the webhook
            registers on-chain activity points automatically.
          </p>
          <p>
            <span className="font-medium text-ink-1">Accumulate weight.</span>{" "}
            Points determine your downstream share of retro-active funding
            distributions when a Drift closes.
          </p>
          <p>
            <span className="font-medium text-ink-1">Streams split.</span>{" "}
            Rewards flow as continuous streams, and each project routes a
            percentage down its dependency tree.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
