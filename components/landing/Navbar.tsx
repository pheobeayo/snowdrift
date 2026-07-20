import Link from "next/link";
import { ArrowRight, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-1 bg-surface-0/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Snowflake className="size-5 text-teal-400" />
          <span className="font-display text-lg font-bold tracking-tight">
            Snowdrift
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-2 md:flex">
          <Link href="/dashboard/tasks" className="transition-colors hover:text-ink-1">
            Tasks
          </Link>
          <Link
            href="/dashboard/opensource"
            className="transition-colors hover:text-ink-1"
          >
            Open source
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-ink-1">
            Dashboard
          </Link>
        </nav>
        <Button asChild size="sm">
          <Link href="/dashboard">
            Launch app <ArrowRight />
          </Link>
        </Button>
      </div>
    </header>
  );
}
