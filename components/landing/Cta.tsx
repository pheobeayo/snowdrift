import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
      <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Ship work. Merge PRs.{" "}
        <span className="text-teal-400">Get paid on-chain.</span>
      </h2>
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg">
          <Link href="/task">
            Open the dashboard <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
