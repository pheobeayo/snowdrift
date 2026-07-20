import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TasksNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-3 py-20 text-center">
      <SearchX className="size-8 text-ink-3" />
      <p className="font-display text-lg font-semibold">Task not found</p>
      <p className="max-w-sm text-sm text-ink-2">
        This task may have been completed and archived, or the link is wrong.
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/dashboard/tasks">Back to tasks</Link>
      </Button>
    </div>
  );
}
