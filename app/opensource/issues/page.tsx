import { Inbox } from "lucide-react";
import IssueCard from "@/components/opensource/IssueCard";
import IssueFilters from "@/components/opensource/IssueFilters";
import Pagination from "@/components/opensource/Pagination";
import { getLabelFacets, getProjectFacets } from "@/lib/opensource/projects";
import { getIssuesPage, parsePage } from "@/lib/opensource/pagination";

export const revalidate = 1800;

type SearchParams = {
  project?: string;
  repo?: string;
  label?: string;
  search?: string;
  page?: string;
};

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { page, ...filters } = params;

  const [result, labels, projects] = await Promise.all([
    getIssuesPage(filters, parsePage(page)),
    getLabelFacets(),
    getProjectFacets(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Open issues
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-2">
          Open issues across the Avalanche ecosystem, sourced from the Electric
          Capital taxonomy. Click through to contribute on GitHub.
        </p>
      </div>

      <IssueFilters projects={projects} labels={labels} active={filters} />

      {filters.repo && (
        <p className="font-mono text-xs text-ink-3">
          Filtered to {filters.repo}
        </p>
      )}

      {result.total > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {result.items.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>

          <Pagination
            pathname="/opensource/issues"
            searchParams={params}
            result={result}
            label="issues"
          />
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-3 py-16 text-center">
          <Inbox className="size-8 text-ink-3" />
          <p className="font-display font-semibold">
            No issues match these filters
          </p>
          <p className="max-w-sm text-sm text-ink-2">
            Try a different project or label.
          </p>
        </div>
      )}
    </div>
  );
}
