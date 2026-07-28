"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const titles: Array<[string, string]> = [
  ["/task/post", "Post a Task"],
  ["/task", "Tasks"],
  ["/opensource/projects", "Projects"],
  ["/opensource/issues", "Bounty Issues"],
  ["/opensource/rewards", "Points & Rewards"],
  ["/opensource", "Drift Overview"],
];

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const title =
    titles.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "Overview";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line-1 bg-surface-0/85 px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <h1 className="font-display text-lg font-bold tracking-tight sm:text-xl">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
      </div>
    </header>
  );
}
