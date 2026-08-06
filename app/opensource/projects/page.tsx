import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/opensource/ProjectCard";
import ProjectFilters from "@/components/opensource/ProjectFilters";
import Pagination from "@/components/opensource/Pagination";
import {
  getLanguageFacets,
  getProjectFacets,
  getStats,
} from "@/lib/opensource/projects";
import { getReposPage, parsePage } from "@/lib/opensource/pagination";

export const revalidate = 1800;

type SearchParams = {
  project?: string;
  language?: string;
  page?: string;
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { page, ...filters } = params;

  const [result, stats, projects, languages] = await Promise.all([
    getReposPage(filters, parsePage(page)),
    getStats(),
    getProjectFacets(),
    getLanguageFacets(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Tracked projects
          </h2>
          <p className="mt-1 max-w-xl text-sm text-ink-2">
            {stats.total_repos} repositories across {stats.total_projects}{" "}
            Avalanche ecosystem projects with open issues right now. Sourced
            from the Electric Capital taxonomy and refreshed automatically.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/opensource/issues">
            View all issues <ArrowRight />
          </Link>
        </Button>
      </div>

      <ProjectFilters
        projects={projects}
        languages={languages}
        active={filters}
      />

      {result.total > 0 ? (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {result.items.map((repo) => (
              <ProjectCard key={repo.full_name} repo={repo} />
            ))}
          </div>

          <Pagination
            pathname="/opensource/projects"
            searchParams={params}
            result={result}
            label="repositories"
          />
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-3 py-16 text-center">
          <Inbox className="size-8 text-ink-3" />
          <p className="font-display font-semibold">No projects match</p>
          <p className="max-w-sm text-sm text-ink-2">
            Try a different project or language filter.
          </p>
        </div>
      )}
    </div>
  );
}
