"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useMilestoneTotal } from "./MilestonesCard";
import type { PostTaskForm } from "./schema";

export function FormActions() {
  const router = useRouter();
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext<PostTaskForm>();

  const flow = watch("flow");
  const currency = watch("currency");
  const total = useMilestoneTotal();

  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={() => router.push("/dashboard/tasks")}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Locking escrow…"
          : flow === "Paid"
            ? `Deposit ${total} ${currency} & post`
            : "Register pro-bono task"}
      </Button>
    </div>
  );
}
