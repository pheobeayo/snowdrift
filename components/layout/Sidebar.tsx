"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ChevronDown,
  CircleDot,
  GitMerge,
  LayoutDashboard,
  LogOut,
  Snowflake,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, shortAddress } from "@/lib/utils";

interface ModuleItem {
  label: string;
  href: string;
}

interface Module {
  label: string;
  icon: React.ElementType;
  base: string;
  items: ModuleItem[];
}

/* Two modules, mirroring ThriftChains' "Savings Module" dropdown —
   Tasks and Open Source stay fully independent of each other. */
const modules: Module[] = [
  {
    label: "Tasks Module",
    icon: Briefcase,
    base: "/dashboard/tasks",
    items: [
      { label: "Browse Tasks", href: "/dashboard/tasks" },
      { label: "Post a Task", href: "/dashboard/tasks/post" },
    ],
  },
  {
    label: "Open Source Module",
    icon: GitMerge,
    base: "/dashboard/opensource",
    items: [
      { label: "Wave Overview", href: "/dashboard/opensource" },
      { label: "Projects", href: "/dashboard/opensource/projects" },
      { label: "Bounty Issues", href: "/dashboard/opensource/issues" },
      { label: "Points & Rewards", href: "/dashboard/opensource/rewards" },
    ],
  },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const overviewActive = pathname === "/dashboard";

  const handleLogout = () => {
    onNavigate?.();
    toast.success("Wallet disconnected");
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <Snowflake className="size-5 text-teal-400" />
        <Link
          href="/"
          onClick={onNavigate}
          className="font-display text-lg font-bold tracking-tight text-ink-1"
        >
          Snowdrift
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          aria-current={overviewActive ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
            overviewActive
              ? "bg-teal-500/15 text-teal-300"
              : "text-ink-2 hover:bg-surface-3 hover:text-ink-1"
          )}
        >
          <LayoutDashboard className="size-4" />
          Overview
        </Link>

        {modules.map((mod) => {
          const moduleActive = pathname.startsWith(mod.base);
          return (
            <Collapsible key={mod.label} defaultOpen={moduleActive}>
              <CollapsibleTrigger
                className={cn(
                  "group flex w-full items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                  moduleActive
                    ? "text-ink-1"
                    : "text-ink-2 hover:bg-surface-3 hover:text-ink-1"
                )}
              >
                <span className="flex items-center gap-3">
                  <mod.icon className="size-4" />
                  {mod.label}
                </span>
                <ChevronDown className="size-4 text-ink-3 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in">
                <div className="mt-1 space-y-0.5 pb-1">
                  {mod.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-full py-2 pl-6 pr-4 text-sm transition-colors",
                          active
                            ? "bg-teal-500/15 text-teal-300"
                            : "text-ink-2 hover:bg-surface-3 hover:text-ink-1"
                        )}
                      >
                        <CircleDot className="size-3.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-xl border border-line-2 bg-surface-2 px-3 py-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
            <Wallet className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-xs text-ink-1">
              {shortAddress("0x9E21fA6b30C87d34a11e5B0d64C1fD08a37Bc901")}
            </p>
            <p className="text-[11px] text-ink-3">Fuji Testnet</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-red-400 cursor-pointer"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-sidebar-border bg-sidebar shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-md p-1.5 text-ink-2 hover:bg-surface-3 hover:text-ink-1"
            >
              <X className="size-5" />
            </button>
            <NavContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}