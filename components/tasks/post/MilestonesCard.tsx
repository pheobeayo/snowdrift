"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { PostTaskForm } from "./schema";

export function useMilestoneTotal() {
  const { watch } = useFormContext<PostTaskForm>();
  const milestones = watch("milestones");
  return milestones?.reduce((sum, m) => sum + (Number(m.amount) || 0), 0) ?? 0;
}

export function MilestonesCard() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<PostTaskForm>();
  const { fields, append, remove } = useFieldArray({ control, name: "milestones" });

  const flow = watch("flow");
  const currency = watch("currency");
  const total = useMilestoneTotal();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Milestones</CardTitle>
          <CardDescription>
            {flow === "Paid"
              ? "Each milestone locks its own amount."
              : "Amounts are ignored for pro-bono tasks."}
          </CardDescription>
        </div>
        {flow === "Paid" && (
          <span className="font-mono text-sm text-teal-300">
            {total} {currency}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {flow === "Paid" && (
          <div className="max-w-40 space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" {...register("currency")}>
              <option value="AVAX">AVAX</option>
              <option value="USDC">USDC</option>
            </Select>
          </div>
        )}
        {fields.map((field, i) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
              <Input
                placeholder={`Milestone ${i + 1} title`}
                aria-label={`Milestone ${i + 1} title`}
                {...register(`milestones.${i}.title`)}
              />
              {errors.milestones?.[i]?.title && (
                <p className="text-xs text-destructive">
                  {errors.milestones[i]?.title?.message}
                </p>
              )}
            </div>
            {flow === "Paid" && (
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                aria-label={`Milestone ${i + 1} amount`}
                className="w-28"
                {...register(`milestones.${i}.amount`, { valueAsNumber: true })}
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove milestone ${i + 1}`}
              onClick={() => remove(i)}
              disabled={fields.length === 1}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {typeof errors.milestones?.message === "string" && (
          <p className="text-xs text-destructive">{errors.milestones.message}</p>
        )}
        {typeof errors.milestones?.root?.message === "string" && (
          <p className="text-xs text-destructive">
            {errors.milestones.root.message}
          </p>
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ title: "", amount: 0 })}
        >
          <Plus /> Add milestone
        </Button>
      </CardContent>
    </Card>
  );
}
