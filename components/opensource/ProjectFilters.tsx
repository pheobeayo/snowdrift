"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";

export default function ProjectFilters({
  projects,
  languages,
  active,
}: {
  projects: Array<{ project: string; count: number }>;
  languages: Array<{ language: string; count: number }>;
  active: { project?: string; language?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = React.useTransition();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "All") params.delete(key);
    else params.set(key, value);

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select
        value={active.project ?? "All"}
        onChange={(e) => setParam("project", e.target.value)}
        className="sm:w-64"
        aria-label="Filter by project"
      >
        <option value="All">All projects</option>
        {projects.map((p) => (
          <option key={p.project} value={p.project}>
            {p.project} ({p.count})
          </option>
        ))}
      </Select>

      <Select
        value={active.language ?? "All"}
        onChange={(e) => setParam("language", e.target.value)}
        className="sm:w-52"
        aria-label="Filter by language"
      >
        <option value="All">All languages</option>
        {languages.map((l) => (
          <option key={l.language} value={l.language}>
            {l.language} ({l.count})
          </option>
        ))}
      </Select>
    </div>
  );
}
