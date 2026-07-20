"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FlowSelector } from "@/components/tasks/post/FlowSelector";
import { DetailsCard } from "@/components/tasks/post/DetailsCard";
import { MilestonesCard } from "@/components/tasks/post/MilestonesCard";
import { FormActions } from "@/components/tasks/post/FormActions";
import { postTaskSchema, type PostTaskForm } from "@/components/tasks/post/schema";

export default function PostTaskPage() {
  const router = useRouter();
  const form = useForm<PostTaskForm>({
    resolver: zodResolver(postTaskSchema),
    defaultValues: {
      flow: "Paid",
      currency: "AVAX",
      milestones: [{ title: "", amount: 0 }],
    },
  });

  async function onSubmit(data: PostTaskForm) {
    await new Promise((r) => setTimeout(r, 700)); // simulate deposit tx
    const total = data.milestones.reduce((sum, m) => sum + m.amount, 0);
    toast.success(
      data.flow === "Paid"
        ? `Task posted — ${total} ${data.currency} locked in escrow`
        : "Pro-bono task registered on the signoff registry"
    );
    router.push("/dashboard/tasks");
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
