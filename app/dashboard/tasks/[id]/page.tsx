import { notFound } from "next/navigation";
import { tasks } from "@/lib/tasks/data";
import { TaskDetail } from "@/components/tasks/detail/TaskDetail";

export function generateStaticParams() {
  return tasks.map((t) => ({ id: t.id }));
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = tasks.find((t) => t.id === id);
  if (!task) notFound();
  return <TaskDetail task={task} />;
}
