"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  GitMerge,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTaskStats } from "@/hooks";
import { ossStats, waves, myContribution } from "@/lib/opensource/data";

export default function OverviewPage() {
  const liveWave = waves.find((w) => w.status === "Live");
  const { inEscrow, openTasks, releaseRate, completed, isLoading } =
    useTaskStats();

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Hello</h2>
        <p className="mt-1 text-ink-2">
          Manage your task escrows and open-source contributions from one place.
        </p>
      </div>

      
      <section aria-label="Module summaries" className="grid gap-5 md:grid-cols-2">
        {/* Tasks Module */}
        <Card className="card-glow">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-ink-2">
              <Briefcase className="size-4 text-teal-400" /> Tasks Module
            </CardTitle>
            <Badge variant="paid">Escrow</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-mono text-3xl text-ink-1">
                {isLoading ? "—" : inEscrow.toLocaleString()}{" "}
                <span className="text-base text-ink-3">AVAX</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-2">
                locked in escrow
                <span className="ml-2 inline-flex items-center gap-0.5 text-teal-400">
                  <TrendingUp className="size-3.5" /> {releaseRate}% release rate
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/dashboard/tasks/post">
                  <Plus /> Post a task
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/tasks">
                  Browse {isLoading ? "" : openTasks} open tasks <ArrowRight />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Open Source Module */}
        <Card className="card-glow">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-ink-2">
              <GitMerge className="size-4 text-teal-400" /> Open Source Module
            </CardTitle>
            <Badge variant="points">Drift {liveWave?.number} live</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-mono text-3xl text-ink-1">
                {ossStats.totalPool.toLocaleString()}{" "}
                <span className="text-base text-ink-3">AVAX</span>
              </p>
              <p className="mt-1 text-sm text-ink-2">
                bounty pool across {ossStats.trackedRepos} tracked repos ·{" "}
                {ossStats.openBounties} open bounties
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/dashboard/opensource/issues">
                  Claim a bounty <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/opensource/projects">View projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Secondary row */}
      <section className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ink-2">
              Your reputation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
              <BadgeCheck className="size-6" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">Snowfall tier</p>
              <p className="text-sm text-ink-2">
                {completed} completed on-chain
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ink-2">
              Drift standing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl text-ink-1">
              {myContribution.wavePoints}{" "}
              <span className="text-sm text-ink-3">pts</span>
            </p>
            <p className="mt-1 text-sm text-ink-2">
              Rank #{myContribution.waveRank} · {myContribution.mergedPrs} merged PRs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ink-2">
              Streaming in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl text-teal-300">
              {myContribution.streamedIn}{" "}
              <span className="text-sm text-ink-3">AVAX</span>
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-ink-2">
              from dependency splits{" "}
              <ArrowUpRight className="size-3.5 text-teal-400" />
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
