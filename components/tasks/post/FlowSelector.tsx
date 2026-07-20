"use client";

import { useFormContext } from "react-hook-form";
import { Landmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostTaskForm } from "./schema";

const options = [
  {
    value: "Paid",
    icon: Landmark,
    title: "Paid escrow",
    body: "Deposit AVAX/USDC, release per milestone.",
  },
  {
    value: "ProBono",
    icon: Sparkles,
    title: "Pro-bono",
    body: "No funds — signoff registry + Soulbound badge.",
  },
] as const;

export function FlowSelector() {
  const { watch, setValue } = useFormContext<PostTaskForm>();
  const flow = watch("flow");

  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Task flow">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={flow === opt.value}
          onClick={() => setValue("flow", opt.value)}
          className={cn(
            "rounded-xl border p-4 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            flow === opt.value
              ? "border-teal-600 bg-teal-500/10"
              : "border-line-2 bg-surface-2 hover:border-line-3"
          )}
        >
          <opt.icon
            className={cn(
              "size-5",
              flow === opt.value ? "text-teal-400" : "text-ink-3"
            )}
          />
          <p className="mt-2 font-display text-sm font-semibold">{opt.title}</p>
          <p className="mt-0.5 text-xs text-ink-2">{opt.body}</p>
        </button>
      ))}
    </div>
  );
}
