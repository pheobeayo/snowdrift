import { z } from "zod";

export const milestoneSchema = z.object({
  title: z.string().min(3, "Give the milestone a name"),
  amount: z.number({ error: "Enter an amount" }).min(0, "Amount can't be negative"),
});

export const postTaskSchema = z
  .object({
    title: z.string().min(8, "Title needs at least 8 characters"),
    description: z.string().min(40, "Describe the work in at least 40 characters"),
    category: z.string().min(1, "Pick a category"),
    flow: z.enum(["Paid", "ProBono"]),
    currency: z.enum(["AVAX", "USDC"]),
    deadline: z.string().min(1, "Set a deadline"),
    estimatedHours: z.number({ error: "Estimate the hours" }).min(1, "Estimate at least 1 hour"),
    skills: z.string().min(2, "List at least one skill"),
    milestones: z.array(milestoneSchema).min(1, "Add at least one milestone"),
  })
  .refine(
    (d) => d.flow === "ProBono" || d.milestones.every((m) => m.amount > 0),
    {
      message: "Paid tasks need an amount on every milestone",
      path: ["milestones"],
    }
  );

export type PostTaskForm = z.infer<typeof postTaskSchema>;
