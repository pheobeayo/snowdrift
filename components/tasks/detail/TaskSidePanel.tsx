import {
  CalendarDays,
  CircleCheck,
  Clock3,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Task, TaskMilestone, TaskStatus } from "@/lib/tasks/data";
import { shortAddress } from "@/lib/utils";

interface TaskSidePanelProps {
  task: Task;
  status: TaskStatus;
  nextLocked?: TaskMilestone;
  nextSubmitted?: TaskMilestone;
  onAccept: () => void;
  onSubmitProof: () => void;
  onApproveRelease: () => void;
}

export function TaskSidePanel({
  task,
  status,
  nextLocked,
  nextSubmitted,
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
            {status === "Open" && (
              <Button className="w-full" onClick={onAccept}>
                Accept task
              </Button>
            )}
            {status !== "Open" && status !== "Completed" && nextLocked && (
              <Button
                className="w-full"
                variant="secondary"
                onClick={onSubmitProof}
              >
                <Upload /> Submit proof
              </Button>
            )}
            {nextSubmitted && status !== "Completed" && (
              <Button className="w-full" onClick={onApproveRelease}>
                Approve & release
              </Button>
            )}
            {status === "Completed" && (
              <p className="flex items-center justify-center gap-2 rounded-lg border border-teal-700/60 bg-teal-500/10 py-2.5 text-sm text-teal-300">
                <CircleCheck className="size-4" /> Escrow settled
              </p>
            )}
          </div>
          <p className="text-xs leading-relaxed text-ink-3">
            Funds stay in EscrowManager.sol until milestones are confirmed. If
            the client disappears, the worker reclaims after the timeout.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
