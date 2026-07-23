"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useCreateTask } from "@/hooks";
import { FlowSelector } from "@/components/tasks/post/FlowSelector";
import { DetailsCard } from "@/components/tasks/post/DetailsCard";
import { MilestonesCard } from "@/components/tasks/post/MilestonesCard";
import { FormActions } from "@/components/tasks/post/FormActions";
import { postTaskSchema, type PostTaskForm } from "@/components/tasks/post/schema";
import type { TaskCategory } from "@/lib/tasks/data";

export default function PostTaskPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { createTaskAsync } = useCreateTask();
  const form = useForm<PostTaskForm>({
    resolver: zodResolver(postTaskSchema),
    defaultValues: {
      flow: "Paid",
      currency: "AVAX",
      milestones: [{ title: "", amount: 0 }],
    },
  });

  async function onSubmit(data: PostTaskForm) {
    if (!isConnected) {
      toast.error("Connect your wallet to post a task");
      return;
    }

    if (data.flow === "Paid" && data.currency !== "AVAX") {
      toast.error("USDC escrow isn't wired up yet", {
        description: "Post this task in AVAX for now.",
      });
      return;
    }

   
    const total =
      data.flow === "Paid"
        ? data.milestones.reduce((sum, m) => sum + m.amount, 0)
        : 0;

    try {
      await createTaskAsync({
        title: data.title,
        description: data.description,
        category: data.category as TaskCategory,
        bountyAvax: total,
        deadline: Math.floor(new Date(data.deadline).getTime() / 1000),
      });

      toast.success(
        data.flow === "Paid"
          ? `Task posted — ${total} AVAX locked in escrow`
          : "Pro-bono task posted on-chain"
      );
      router.push("/dashboard/tasks");
    } catch (err) {
      toast.error("Transaction failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Post a task
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          Paid tasks lock funds in EscrowManager.sol on submit. Pro-bono tasks
          register on the cryptographic signoff registry and mint badges on
          completion.
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <FlowSelector />
          <DetailsCard />
          <MilestonesCard />
          <FormActions />
        </form>
      </FormProvider>
    </div>
  );
}
