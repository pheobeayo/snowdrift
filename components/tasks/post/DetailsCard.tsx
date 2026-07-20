"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TASK_CATEGORIES } from "@/lib/tasks/data";
import type { PostTaskForm } from "./schema";

export function DetailsCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PostTaskForm>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Subnet fee-config dashboard widget"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Scope, acceptance criteria, links to specs…"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select id="category" {...register("category")}>
              <option value="">Select…</option>
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              placeholder="Solidity, Foundry"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-xs text-destructive">{errors.skills.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" {...register("deadline")} />
            {errors.deadline && (
              <p className="text-xs text-destructive">
                {errors.deadline.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="estimatedHours">Estimated hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              min={1}
              placeholder="20"
              {...register("estimatedHours", { valueAsNumber: true })}
            />
            {errors.estimatedHours && (
              <p className="text-xs text-destructive">
                {errors.estimatedHours.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
