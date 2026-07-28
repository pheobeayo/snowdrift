import {
  ArrowDownRight,
  ArrowUpRight,
  GitMerge,
  Medal,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { myContribution, projects, waves } from "@/lib/opensource/data";

const pointHistory = [
  { label: "avalanchejs #1101 — TSDoc coverage", points: 75, date: "Jul 18" },
  { label: "builders-hub #861 — i18n state fix (merged)", points: 220, date: "Jul 14" },
  { label: "kite_counter_dapp #38 — dark-mode tokens", points: 60, date: "Jul 09" },
  { label: "Drift 2 participation bonus", points: 285, date: "Jun 29" },
];

export default function RewardsPage() {
  const live = waves.find((w) => w.status === "Live");
  const shareOfPool = live
    ? (myContribution.wavePoints / live.pointsDistributed) * 100
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Points & rewards
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          Signed in as{" "}
          <span className="font-mono text-teal-300">@{myContribution.handle}</span>{" "}
          — points reset each Wave; streams keep flowing.
        </p>
      </div>

      {/* Standing */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-glow">
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-3">
              <Sparkles className="size-3.5 text-[#c084fc]" /> Drift {live?.number} points
            </p>
            <p className="mt-2 font-mono text-3xl text-[#c084fc]">
              {myContribution.wavePoints}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-3">
              <Medal className="size-3.5 text-teal-400" /> Rank
            </p>
            <p className="mt-2 font-mono text-3xl text-ink-1">
              #{myContribution.waveRank}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-3">
              <GitMerge className="size-3.5 text-teal-400" /> Merged PRs
            </p>
            <p className="mt-2 font-mono text-3xl text-ink-1">
              {myContribution.mergedPrs}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-3">
              <ArrowDownRight className="size-3.5 text-teal-400" /> Streaming in
            </p>
            <p className="mt-2 font-mono text-3xl text-teal-300">
              {myContribution.streamedIn}
              <span className="ml-1 text-sm text-ink-3">AVAX</span>
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Retro share */}
        <Card>
          <CardHeader>
            <CardTitle>Retro-active drop estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-ink-2">
              Your share of Wave {live?.number}&apos;s{" "}
              <span className="font-mono text-teal-300">
                {live?.rewardPool.toLocaleString()} AVAX
              </span>{" "}
              pool, weighted by points at close:
            </p>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-2xl text-ink-1">
                  {shareOfPool.toFixed(2)}%
                </span>
                <span className="font-mono text-sm text-teal-300">
                  ≈ {((live?.rewardPool ?? 0) * (shareOfPool / 100)).toFixed(1)} AVAX
                </span>
              </div>
              <Progress value={Math.min(shareOfPool * 8, 100)} aria-label="Share of reward pool" />
            </div>
            <p className="text-xs text-ink-3">
              Estimates move until the Wave ends on {live?.endsAt}. Distribution
              streams open automatically at close.
            </p>
          </CardContent>
        </Card>

        {/* Dependency splits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waypoints className="size-4 text-teal-400" /> Dependency splits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-ink-2">
              You route{" "}
              <span className="font-mono text-teal-300">
                {myContribution.splitOut}%
              </span>{" "}
              of inbound streams to the projects you depend on:
            </p>
            <ul className="space-y-2">
              {projects.slice(0, 3).map((p) => (
                <li
                  key={p.slug}
                  className="flex items-center justify-between rounded-lg border border-line-2 bg-surface-3 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs text-ink-1">
                    {p.org}/{p.repo}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-teal-300">
                    {(myContribution.splitOut / 3).toFixed(1)}%
                    <ArrowUpRight className="size-3" />
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Point history */}
      <Card>
        <CardHeader>
          <CardTitle>Point history</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-line-1">
            {pointHistory.map((h) => (
              <li
                key={h.label}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-1">{h.label}</p>
                  <p className="text-xs text-ink-3">{h.date}, 2026</p>
                </div>
                <Badge variant="points">+{h.points} pts</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
