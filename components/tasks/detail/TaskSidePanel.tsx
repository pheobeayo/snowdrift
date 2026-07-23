import {
  CalendarDays,
  CircleCheck,
  Clock3,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SubmissionState } from "@/hooks";
import type { Task, TaskStatus } from "@/lib/tasks/data";
import { shortAddress } from "@/lib/utils";

interface TaskSidePanelProps {
  task: Task;
  status: TaskStatus;
  isConnected: boolean;
  isPoster: boolean;
  hasJoined: boolean;
  mySubmission: SubmissionState;
  pendingWorker?: `0x${string}`;
  busy: boolean;
  submitting: boolean;
  approving: boolean;
  onAccept: () => void;
  onSubmitProof: () => void;
  onApproveRelease: () => void;
}

export function TaskSidePanel({
  task,
  status,
  isConnected,
  isPoster,
  hasJoined,
  mySubmission,
  pendingWorker,
  busy,
  submitting,
  approving,
  onAccept,
  onSubmitProof,
  onApproveRelease,
}: TaskSidePanelProps) {
  return (
    <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <Card className="card-glow">
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-3">
              {task.flow === "Paid" ? "Total escrow" : "Completion reward"}
            </p>
            <p className="mt-1 font-mono text-3xl text-teal-300">
              {task.flow === "Paid"
                ? `${task.reward} ${task.currency}`
                : "Soulbound NFT"}
            </p>
          </div>
          <Separator />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-2">Client</dt>
              <dd className="font-mono text-xs text-ink-1">
                {shortAddress(task.client)}
              </dd>
            </div>
            {task.worker && (
              <div className="flex justify-between">
                <dt className="text-ink-2">Worker</dt>
                <dd className="font-mono text-xs text-ink-1">
                  {shortAddress(task.worker)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-2">Estimate</dt>
              <dd className="flex items-center gap-1 text-ink-1">
                <Clock3 className="size-3.5 text-ink-3" /> ~{task.estimatedHours}h
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Deadline</dt>
              <dd className="flex items-center gap-1 text-ink-1">
                <CalendarDays className="size-3.5 text-ink-3" /> {task.deadline}
              </dd>
            </div>
          </dl>
          <Separator />
          <div className="space-y-2">
            {!isConnected && (
              <p className="rounded-lg border border-line-2 bg-surface-3 py-2.5 text-center text-sm text-ink-2">
                Connect your wallet to act on this task
              </p>
            )}

            {status === "Completed" ? (
              <p className="flex items-center justify-center gap-2 rounded-lg border border-teal-700/60 bg-teal-500/10 py-2.5 text-sm text-teal-300">
                <CircleCheck className="size-4" /> Escrow settled
              </p>
            ) : isPoster ? (
              /* Poster: review and release */
              pendingWorker ? (
                <>
                  <Button
                    className="w-full"
                    onClick={onApproveRelease}
                    disabled={approving}
                  >
                    {approving ? "Releasing…" : "Approve & release"}
                  </Button>
                  <p className="text-center font-mono text-[11px] text-ink-3">
                    to {shortAddress(pendingWorker)}
                  </p>
                </>
              ) : (
                <p className="rounded-lg border border-line-2 bg-surface-3 py-2.5 text-center text-sm text-ink-2">
                  You posted this task — waiting on a submission
                </p>
              )
            ) : isConnected ? (
            
              !hasJoined ? (
                <Button
                  className="w-full"
                  onClick={onAccept}
                  disabled={busy || status !== "Open"}
                >
                  {busy
                    ? "Accepting…"
                    : status === "Open"
                      ? "Accept task"
                      : "No slots available"}
                </Button>
              ) : mySubmission === "Submitted" ? (
                <p className="rounded-lg border border-[#5aa9e6]/40 bg-[#5aa9e6]/5 py-2.5 text-center text-sm text-[#5aa9e6]">
                  Proof submitted — awaiting review
                </p>
              ) : mySubmission === "Approved" ? (
                <p className="flex items-center justify-center gap-2 rounded-lg border border-teal-700/60 bg-teal-500/10 py-2.5 text-sm text-teal-300">
                  <CircleCheck className="size-4" /> Paid out
                </p>
              ) : (
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={onSubmitProof}
                  disabled={submitting}
                >
                  <Upload />{" "}
                  {submitting
                    ? "Submitting…"
                    : mySubmission === "Rejected"
                      ? "Resubmit proof"
                      : "Submit proof"}
                </Button>
              )
            ) : null}
          </div>
          <p className="text-xs leading-relaxed text-ink-3">
            Funds stay in SnowdriftTaskEscrow until the poster approves. If the
            deadline passes unsettled, escrow refunds to the poster.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
