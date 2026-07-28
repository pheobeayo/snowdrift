"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { OpenSourceSidebar } from "@/components/layout/OpenSourceSidebar";
import { GitHubProvider } from "@/hooks/useGitHub";

export function OpenSourceShell({ children }: { children: React.ReactNode }) {
  return (
    <GitHubProvider>
      <DashboardShell sidebar={(p) => <OpenSourceSidebar {...p} />}>
        {children}
      </DashboardShell>
    </GitHubProvider>
  );
}
