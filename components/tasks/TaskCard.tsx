import Link from "next/link";
import { CalendarDays, Clock3, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { statusBadgeVariant, type Task } from "@/lib/tasks/data";
import { shortAddress } from "@/lib/utils";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/dashboard/tasks/${task.id}`} className="group block h-full">
      <Card className="card-glow flex h-full flex-col transition-colors group-hover:border-teal-700">
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={task.flow === "Paid" ? "paid" : "unpaid"}>
              {task.flow === "Paid" ? "Paid" : "Pro-bono"}
            </Badge>
            <Badge variant={statusBadgeVariant(task.status)}>{task.status}</Badge>
          </div>
          {task.multisig && (
            <span
              title="2-of-3 multisig dispute resolution"
              className="text-ink-3"
            >
              <ShieldCheck className="size-4" />
            </span>
          )}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <h3 className="font-display text-base font-semibold leading-snug text-ink-1 group-hover:text-teal-100">
            {task.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-2">
            {task.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {task.skills.slice(0, 4).map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between border-t border-line-1 pt-3">
            <div>
              {task.flow === "Paid" ? (
                <p className="font-mono text-lg text-teal-300">
                  {task.reward}{" "}
                  <span className="text-xs text-ink-3">{task.currency}</span>
                </p>
              ) : (
                <p className="font-mono text-sm text-ink-2">Soulbound badge</p>
              )}
              <p className="font-mono text-[11px] text-ink-3">
                {shortAddress(task.client)}
              </p>
            </div>
            <div className="space-y-1 text-right text-[11px] text-ink-3">
              <p className="flex items-center justify-end gap-1">
                <Clock3 className="size-3" /> ~{task.estimatedHours}h
              </p>
              <p className="flex items-center justify-end gap-1">
                <CalendarDays className="size-3" /> due {task.deadline}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
