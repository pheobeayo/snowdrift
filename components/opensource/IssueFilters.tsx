"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LabelFacet } from "@/lib/opensource/type";

const QUICK_LABELS = [
  { value: "All", label: "All" },
  { value: "good first issue", label: "Good first issue" },
  { value: "help wanted", label: "Help wanted" },
  { value: "bounty", label: "Bounty" },
];

export default function IssueFilters({
  projects,
  labels,
  active,
}: {
  projects: Array<{ project: string; count: number }>;
  labels: LabelFacet[];
  active: { project?: string; label?: string; repo?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = React.useTransition();

  const setParam = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value || value === "All") params.delete(key);
      else params.set(key, value);

      if (key === "project") params.delete("repo");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const activeTab = QUICK_LABELS.some((l) => l.value === active.label)
    ? active.label!
    : "All";

  const quickValues = new Set(QUICK_LABELS.map((l) => l.value));
  const extraLabels = labels.filter(
    (l) => !quickValues.has(l.name.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
      data-pending={pending ? "" : undefined}
    >
      <Tabs value={activeTab} onValueChange={(v) => setParam("label", v)}>
        <TabsList>
          {QUICK_LABELS.map((l) => (
            <TabsTrigger key={l.value} value={l.value}>
              {l.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Select
        value={active.project ?? "All"}
        onChange={(e) => setParam("project", e.target.value)}
        className="sm:w-64"
        aria-label="Filter by project"
      >
        <option value="All">All projects</option>
        {projects.map((p) => (
          <option key={p.project} value={p.project}>
            {p.project} ({p.count})
          </option>
        ))}
      </Select>

      {extraLabels.length > 0 && (
        <Select
          value={
            quickValues.has(active.label ?? "")
              ? "All"
              : (active.label ?? "All")
          }
          onChange={(e) => setParam("label", e.target.value)}
          className="sm:w-56"
          aria-label="Filter by label"
        >
          <option value="All">All labels</option>
          {extraLabels.slice(0, 40).map((l) => (
            <option key={l.name} value={l.name}>
              {l.name} ({l.count})
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}
