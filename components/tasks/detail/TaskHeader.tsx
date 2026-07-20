import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  statusBadgeVariant,
  type Task,
  type TaskStatus,
} from "@/lib/tasks/data";

export function TaskHeader({ task, status }: { task: Task; status: TaskStatus }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={task.flow === "Paid" ? "paid" : "unpaid"}>
          {task.flow === "Paid" ? "Paid" : "Pro-bono"}
        </Badge>
        <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
        <Badge variant="outline">{task.category}</Badge>
        {task.multisig && (
          <Badge variant="outline">
            <ShieldCheck className="size-3" /> 2-of-3 multisig
          </Badge>
        )}
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {task.title}
      </h2>
      <p className="mt-3 leading-relaxed text-ink-2">{task.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {task.skills.map((s) => (
          <Badge key={s} variant="outline">
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}
