"use client";

import * as React from "react";
import { Topbar } from "@/components/layout/Topbar";

interface DashboardShellProps {
  children: React.ReactNode;
  
  sidebar: (props: { mobileOpen: boolean; onClose: () => void }) => React.ReactNode;
}

export function DashboardShell({ children, sidebar }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface-0">
      {sidebar({ mobileOpen, onClose: () => setMobileOpen(false) })}
      <div className="lg:pl-64">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
