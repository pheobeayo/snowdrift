"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TASK_CATEGORIES, type TaskFlow } from "@/lib/tasks/data";
import { useChainTasks } from "@/hooks";

const workerFlow = [
  { step: "01", title: "Browse tasks", body: "Filter by category, time, and reward." },
  { step: "02", title: "Accept & work", body: "Escrow locks; a safety clock starts." },
  { step: "03", title: "Submit proof", body: "Deliverable pinned per milestone." },
  { step: "04", title: "Get paid", body: "Approval releases AVAX instantly." },
];

export default function TasksPage() {
  const [flow, setFlow] = React.useState<"All" | TaskFlow>("All");
  const [category, setCategory] = React.useState("All");
  const [query, setQuery] = React.useState("");

  const { tasks, isLoading: chainLoading } = useChainTasks();

  const filtered = tasks.filter((t) => {
    if (flow !== "All" && t.flow !== flow) return false;
    if (category !== "All" && t.category !== category) return false;
    if (
      query &&
      !`${t.title} ${t.description} ${t.skills.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-8">
      
      <section
        aria-label="How tasks work"
        className="grid gap-px overflow-hidden rounded-xl border border-line-2 bg-line-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {workerFlow.map((s) => (
          <div key={s.step} className="bg-surface-2 p-4">
            <span className="font-mono text-xs text-teal-500">{s.step}</span>
            <h3 className="mt-1 font-display text-sm font-semibold">{s.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">{s.body}</p>
          </div>
        ))}
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Tabs
          value={flow}
          onValueChange={(v) => setFlow(v as "All" | TaskFlow)}
          className="shrink-0"
        >
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Paid">Paid</TabsTrigger>
            <TabsTrigger value="ProBono">Pro-bono</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, skills…"
            className="pl-9"
            aria-label="Search tasks"
          />
        </div>

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="md:w-52"
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {TASK_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Button asChild className="shrink-0">
          <Link href="/dashboard/tasks/post">
            <Plus /> Post a task
          </Link>
        </Button>
      </div>

      {/* Grid */}
      {chainLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-line-2 bg-surface-2"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-3 py-16 text-center">
          <SearchX className="size-8 text-ink-3" />
          <p className="font-display font-semibold">
            {tasks.length === 0
              ? "No tasks on-chain yet"
              : "No tasks match these filters"}
          </p>
          <p className="max-w-sm text-sm text-ink-2">
            {tasks.length === 0
              ? "Be the first to post a task — the bounty locks in escrow on Fuji."
              : "Clear the search or switch category — or post the task you were looking for."}
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/dashboard/tasks/post">Post a task</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
