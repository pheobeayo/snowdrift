"use client";

import * as React from "react";
import { CircleDot, GitPullRequest, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  issues,
  issueStateBadge,
  projectBySlug,
  projects,
  type IssueKind,
} from "@/lib/opensource/data";

export default function IssuesPage() {
  const [kind, setKind] = React.useState<"All" | IssueKind>("All");
  const [project, setProject] = React.useState("All");
  const [claimed, setClaimed] = React.useState<Record<string, boolean>>({});

  const filtered = issues.filter((i) => {
    if (kind !== "All" && i.kind !== kind) return false;
    if (project !== "All" && i.projectSlug !== project) return false;
    return true;
  });

  function claim(id: string, title: string) {
    setClaimed((c) => ({ ...c, [id]: true }));
    toast.success("Issue claimed", {
      description: `"${title}" is yours — open a PR referencing the issue number to trigger the payout webhook.`,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Bounty issues
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-2">
          Paid issues release their bounty automatically when your PR merges.
          Unpaid issues earn Wave Points that weigh into retro-active drops.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs value={kind} onValueChange={(v) => setKind(v as "All" | IssueKind)}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Paid">Paid</TabsTrigger>
            <TabsTrigger value="Unpaid">Unpaid</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="sm:w-72"
          aria-label="Filter by project"
        >
          <option value="All">All projects</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.org}/{p.repo}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((issue) => {
            const proj = projectBySlug(issue.projectSlug);
            const isClaimed = claimed[issue.id] || issue.state !== "Open";
            return (
              <Card key={issue.id} className="transition-colors hover:border-line-3">
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <CircleDot
                      className={
                        issue.state === "Merged"
                          ? "mt-1 size-4 shrink-0 text-ink-3"
                          : "mt-1 size-4 shrink-0 text-teal-400"
                      }
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-ink-3">
                        {proj?.org}/{proj?.repo} #{issue.number}
                      </p>
                      <h3 className="mt-0.5 font-medium leading-snug text-ink-1">
                        {issue.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge variant={issue.kind === "Paid" ? "paid" : "unpaid"}>
                          {issue.kind}
                        </Badge>
                        <Badge variant={issueStateBadge(issue.state)}>
                          {issue.state}
                        </Badge>
                        {issue.labels.map((l) => (
                          <Badge key={l} variant="outline">
                            {l}
                          </Badge>
                        ))}
                        {issue.claimedBy && (
                          <span className="flex items-center gap-1 text-xs text-ink-3">
                            <GitPullRequest className="size-3" /> @{issue.claimedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-4 lg:justify-end">
                    <div className="text-right">
                      {issue.kind === "Paid" ? (
                        <>
                          <p className="font-mono text-lg text-teal-300">
                            {issue.bounty} <span className="text-xs text-ink-3">AVAX</span>
                          </p>
                          <p className="text-[11px] text-ink-3">on PR merge</p>
                        </>
                      ) : (
                        <>
                          <p className="font-mono text-lg text-[#c084fc]">
                            {issue.points} <span className="text-xs text-ink-3">pts</span>
                          </p>
                          <p className="text-[11px] text-ink-3">Wave points</p>
                        </>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isClaimed ? "secondary" : "default"}
                      disabled={isClaimed}
                      onClick={() => claim(issue.id, issue.title)}
                    >
                      {issue.state === "Merged"
                        ? "Merged"
                        : isClaimed
                          ? "Claimed"
                          : "Claim issue"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-3 py-16 text-center">
          <Inbox className="size-8 text-ink-3" />
          <p className="font-display font-semibold">No issues match these filters</p>
          <p className="max-w-sm text-sm text-ink-2">
            Switch project or kind to see more of the board.
          </p>
        </div>
      )}
    </div>
  );
}
