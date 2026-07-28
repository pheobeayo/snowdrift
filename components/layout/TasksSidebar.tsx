"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  FilePlus2,
  ListChecks,
  Snowflake,
  X,
} from "lucide-react";
import { LogoutButton, WalletCard } from "@/components/wallet/WalletCard";
import { EngineSwitchLink } from "@/components/layout/EngineSwitchLink";
import { cn } from "@/lib/utils";

const links = [
  { label: "Browse Tasks", href: "/task", icon: ListChecks, exact: true },
  { label: "Post a Task", href: "/task/post", icon: FilePlus2, exact: true },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

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
        <p className="px-4 pb-2 font-mono text-[11px] uppercase tracking-widest text-ink-3">
          Tasks
        </p>
        {links.map((l) => {
          const active = isActive(pathname, l.href, l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-500/15 text-teal-300"
                  : "text-ink-2 hover:bg-surface-3 hover:text-ink-1"
              )}
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          );
        })}

        <div className="my-3 border-t border-sidebar-border" />

        <EngineSwitchLink
          href="/opensource"
          from="tasks"
          onNavigate={onNavigate}
          className="flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink-1"
        >
          <span className="flex items-center gap-3">
            <ArrowLeftRight className="size-4" />
            Open Source
          </span>
        </EngineSwitchLink>
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-4">
        <WalletCard />
        <LogoutButton onAfter={onNavigate} />
      </div>
    </div>
  );
}

export function TasksSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <NavContent />
      </aside>

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
