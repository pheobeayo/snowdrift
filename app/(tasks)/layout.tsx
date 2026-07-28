import { TasksShell } from "@/components/layout/TasksShell";

export default function TasksGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TasksShell>{children}</TasksShell>;
}
