"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import {
  useApproveSubmission,
  useChainTask,
  useHasJoined,
  useJoinTask,
  useSubmission,
  useSubmitProof,
  useTaskWorkers,
} from "@/hooks";
import { TaskHeader } from "./TaskHeader";
import { MilestoneTimeline } from "./MilestoneTimeline";
import { ReputationTiers } from "./ReputationTiers";
import { TaskSidePanel } from "./TaskSidePanel";

export function TaskDetail({ taskId }: { taskId: string }) {
  const { address } = useAccount();
  const { task, isLoading, refetch } = useChainTask(taskId);
  const { data: joined, refetch: refetchJoined } = useHasJoined(taskId);
  const { data: workers, refetch: refetchWorkers } = useTaskWorkers(taskId);

  // The connected wallet's own submission drives the worker-side buttons.
  const { state: mySubmission, refetch: refetchSubmission } = useSubmission(
    taskId,
    address
  );

  const isPoster =
    !!address && !!task && task.client.toLowerCase() === address.toLowerCase();

  // Poster view: the first worker awaiting review.
  const workerList = React.useMemo(
    () => (workers ?? []) as readonly `0x${string}`[],
    [workers]
  );
  const { state: firstWorkerState } = useSubmission(taskId, workerList[0]);
  const pendingWorker =
    firstWorkerState === "Submitted" ? workerList[0] : undefined;

  const join = useJoinTask();
  const submit = useSubmitProof();
  const approve = useApproveSubmission();

  const refreshAll = React.useCallback(() => {
    refetch();
    refetchJoined();
    refetchWorkers();
    refetchSubmission();
  }, [refetch, refetchJoined, refetchWorkers, refetchSubmission]);

  // Surface confirmations once each tx lands.
  React.useEffect(() => {
    if (!join.isConfirmed) return;
    toast.success("Task accepted", {
      description: "You hold a worker slot. Deliver before the deadline.",
    });
    refreshAll();
    join.reset();
  }, [join, refreshAll]);

  React.useEffect(() => {
    if (!submit.isConfirmed) return;
    toast.success("Proof submitted", {
      description: "Waiting for the poster to review and release escrow.",
    });
    refreshAll();
    submit.reset();
  }, [submit, refreshAll]);

  React.useEffect(() => {
    if (!approve.isConfirmed) return;
    toast.success("Escrow released", {
      description: "AVAX sent to the worker and reputation recorded.",
    });
    refreshAll();
    approve.reset();
  }, [approve, refreshAll]);

  React.useEffect(() => {
    const err = join.error ?? submit.error ?? approve.error;
    if (err) toast.error("Transaction failed", { description: err.message });
  }, [join.error, submit.error, approve.error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-3" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="h-96 animate-pulse rounded-xl border border-line-2 bg-surface-2" />
          <div className="h-72 animate-pulse rounded-xl border border-line-2 bg-surface-2" />
        </div>
      </div>
    );
  }

  if (!task) notFound();

  function handleSubmitProof() {
    const proof = window.prompt(
      "Link to your deliverable (PR, IPFS hash, or doc URL):"
    );
    if (proof) submit.submitProof(taskId, proof);
  }

  function handleApprove() {
    if (pendingWorker) approve.approveSubmission(taskId, pendingWorker);
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
          <TaskHeader task={task} status={task.status} />
          <MilestoneTimeline task={task} milestones={task.milestones} />
          <ReputationTiers />
        </div>

        <TaskSidePanel
          task={task}
          status={task.status}
          isConnected={!!address}
          isPoster={isPoster}
          hasJoined={!!joined}
          mySubmission={mySubmission}
          pendingWorker={pendingWorker}
          busy={join.isPending || join.isConfirming}
          submitting={submit.isPending || submit.isConfirming}
          approving={approve.isPending || approve.isConfirming}
          onAccept={() => join.joinTask(taskId)}
          onSubmitProof={handleSubmitProof}
          onApproveRelease={handleApprove}
        />
      </div>
    </div>
  );
}
