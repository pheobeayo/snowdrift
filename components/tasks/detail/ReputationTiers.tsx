import { BadgeCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reputationTiers } from "@/lib/tasks/data";

export function ReputationTiers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reputation tiers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {reputationTiers.map((t) => (
            <div
              key={t.name}
              className="flex items-start gap-3 rounded-lg border border-line-2 bg-surface-3 p-3"
            >
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-teal-500" />
              <div>
                <p className="text-sm font-medium">
                  {t.name}{" "}
                  <span className="font-mono text-[11px] text-ink-3">
                    {t.minTasks}+ tasks
                  </span>
                </p>
                <p className="text-xs text-ink-2">{t.perk}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
