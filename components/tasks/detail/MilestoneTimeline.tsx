import { CircleCheck, Lock, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskMilestone } from "@/lib/tasks/data";
import { cn } from "@/lib/utils";

export function MilestoneTimeline({
  task,
  milestones,
}: {
  task: Task;
  milestones: TaskMilestone[];
}) {
  const released = milestones.filter((m) => m.state === "Released").length;
  const progress = Math.round((released / milestones.length) * 100);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Milestone escrow</CardTitle>
        <span className="font-mono text-xs text-ink-3">
          {released}/{milestones.length} released
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} aria-label="Milestones released" />
        <ol className="space-y-3">
          {milestones.map((m) => (
            <li
              key={m.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-4 py-3",
                m.state === "Released"
                  ? "border-teal-700/60 bg-teal-500/5"
                  : m.state === "Submitted"
                    ? "border-[#5aa9e6]/40 bg-[#5aa9e6]/5"
                    : "border-line-2 bg-surface-3"
              )}
            >
              <div className="flex items-center gap-3">
                {m.state === "Released" ? (
                  <CircleCheck className="size-4 shrink-0 text-teal-400" />
                ) : m.state === "Submitted" ? (
                  <Upload className="size-4 shrink-0 text-[#5aa9e6]" />
                ) : (
                  <Lock className="size-4 shrink-0 text-ink-3" />
                )}
                <div>
                  <p className="text-sm font-medium text-ink-1">{m.title}</p>
                  <p className="text-xs text-ink-3">{m.state}</p>
                </div>
              </div>
              <span className="font-mono text-sm text-teal-300">
                {task.flow === "Paid" ? `${m.amount} ${task.currency}` : "Badge"}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
