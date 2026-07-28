"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { TasksSidebar } from "@/components/layout/TasksSidebar";

export function TasksShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell sidebar={(p) => <TasksSidebar {...p} />}>
      {children}
    </DashboardShell>
  );
}
