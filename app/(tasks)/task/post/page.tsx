"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAccount, useBalance } from "wagmi";
import { TriangleAlert } from "lucide-react";
import { useCreateTask } from "@/hooks";
import { FlowSelector } from "@/components/tasks/post/FlowSelector";
import { DetailsCard } from "@/components/tasks/post/DetailsCard";
import { MilestonesCard } from "@/components/tasks/post/MilestonesCard";
import { FormActions } from "@/components/tasks/post/FormActions";
import { postTaskSchema, type PostTaskForm } from "@/components/tasks/post/schema";
import { formatEther, parseEther } from "viem";
import type { TaskCategory } from "@/lib/tasks/data";

/** Headroom for gas on Fuji — createTask writes a large struct (~300k gas). */
const GAS_BUFFER = parseEther("0.01");

export default function PostTaskPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
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

    // The contract escrows a single bounty per worker slot, so the
    // milestone amounts are summed into one total deposit.
    const total =
      data.flow === "Paid"
        ? data.milestones.reduce((sum, m) => sum + m.amount, 0)
        : 0;

    // Pre-flight balance check: even a pro-bono task (0 AVAX bounty)
    // needs gas, so catch an empty wallet before opening the wallet modal.
    if (balance) {
      const needed = parseEther(String(total)) + GAS_BUFFER;
      if (balance.value < needed) {
        toast.error(
          total > 0 ? "Not enough AVAX" : "Not enough AVAX for gas",
          {
            description: `You have ${Number(formatEther(balance.value)).toFixed(4)} AVAX${
              total > 0 ? ` but need ~${formatEther(needed)} (bounty + gas)` : ""
            }. Top up at faucet.avax.network.`,
          }
        );
        return;
      }
    }

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
      router.push("/task");
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

      {isConnected && balance && balance.value < GAS_BUFFER && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-600/40 bg-amber-500/10 p-4">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-400" />
          <div className="text-sm">
            <p className="font-medium text-amber-200">
              Low balance — {Number(formatEther(balance.value)).toFixed(4)} AVAX
            </p>
            <p className="mt-0.5 text-ink-2">
              Posting a task costs gas even when it&apos;s pro-bono. Claim test
              AVAX from{" "}
              <a
                href="https://faucet.avax.network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 underline underline-offset-2 hover:text-teal-300"
              >
                faucet.avax.network
              </a>{" "}
              first.
            </p>
          </div>
        </div>
      )}

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
