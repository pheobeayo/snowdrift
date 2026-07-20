"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { TaskHeader } from "./TaskHeader";
import { MilestoneTimeline } from "./MilestoneTimeline";
import { ReputationTiers } from "./ReputationTiers";
import { TaskSidePanel } from "./TaskSidePanel";
import type { Task, TaskStatus } from "@/lib/tasks/data";

export function TaskDetail({ task }: { task: Task }) {
  const [status, setStatus] = React.useState<TaskStatus>(task.status);
  const [milestones, setMilestones] = React.useState(task.milestones);

  const nextLocked = milestones.find((m) => m.state === "Locked");
  const nextSubmitted = milestones.find((m) => m.state === "Submitted");

  function acceptTask() {
    setStatus("InProgress");
    toast.success("Task accepted", {
      description: "Escrow is locked. The 30-day safety clock has started.",
    });
  }

  function submitProof() {
    if (!nextLocked) return;
    setMilestones((ms) =>
      ms.map((m) => (m.id === nextLocked.id ? { ...m, state: "Submitted" } : m))
    );
    setStatus("Delivered");
    toast.success("Proof submitted", {
      description: `Milestone ${nextLocked.id} is waiting for client review.`,
    });
  }

  function approveRelease() {
    if (!nextSubmitted) return;
    setMilestones((ms) =>
      ms.map((m) =>
        m.id === nextSubmitted.id ? { ...m, state: "Released" } : m
      )
    );
    const remaining = milestones.filter(
      (m) => m.id !== nextSubmitted.id && m.state !== "Released"
    ).length;
    setStatus(remaining === 0 ? "Completed" : "InProgress");
    toast.success(
      task.flow === "Paid"
        ? `${nextSubmitted.amount} ${task.currency} released`
        : "Milestone signed off",
      {
        description:
          remaining === 0
            ? task.flow === "Paid"
              ? "All milestones complete. Escrow closed."
              : "Soulbound completion badge minted."
            : "Funds sent from EscrowManager.sol to the worker wallet.",
      }
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-ink-1"
      >
        <ArrowLeft className="size-4" /> All tasks
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <TaskHeader task={task} status={status} />
          <MilestoneTimeline task={task} milestones={milestones} />
          <ReputationTiers />
        </div>

        <TaskSidePanel
          task={task}
          status={status}
          nextLocked={nextLocked}
          nextSubmitted={nextSubmitted}
          onAccept={acceptTask}
          onSubmitProof={submitProof}
          onApproveRelease={approveRelease}
        />
      </div>
    </div>
  );
}
