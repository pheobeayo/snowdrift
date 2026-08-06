import Link from "next/link";
import {
  ArrowRight,
  CircleDot,
  Compass,
  FolderGit2,
  GitPullRequest,
  Search,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATALOG } from "@/lib/opensource/ecosystem";
import {
  getIssues,
  getLanguageFacets,
  getProjects,
  getStats,
} from "@/lib/opensource/projects";

export const revalidate = 1800;

export default async function OpenSourcePage() {
  const [stats, projects, starters, languages] = await Promise.all([
    getStats(),
    getProjects(),
    getIssues({ label: "good first issue" }),
    getLanguageFacets(),
  ]);

  const topProjects = projects.slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="teal-grid-bg relative overflow-hidden rounded-2xl border border-line-2 bg-surface-1 p-6 sm:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top_left,rgba(20,196,144,0.16),transparent_60%)]"
          aria-hidden
        />
        <Badge variant="points">
          <Waves className="size-3" /> Snowdrift
        </Badge>
        <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Find open source work across the Avalanche ecosystem.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-base">
          Every open issue tagged for contributors, across{" "}
          {CATALOG.sub_ecosystems} Avalanche projects, in one place. Filter by
          project, language, or difficulty, then contribute on GitHub the way
          you normally would.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/opensource/issues?label=good+first+issue">
              Find a first issue <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/opensource/projects">
              <FolderGit2 /> Browse projects
            </Link>
          </Button>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { value: stats.total_issues.toLocaleString(), label: "open issues" },
          { value: stats.total_repos.toLocaleString(), label: "active repos" },
          { value: stats.total_projects.toLocaleString(), label: "projects" },
          {
            value: starters.length.toLocaleString(),
            label: "good first issues",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="font-mono text-2xl text-teal-300">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-ink-3">
                {s.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-lg font-semibold">
            Where the work is
          </h3>
          <Button asChild variant="ghost" size="sm">
            <Link href="/opensource/projects">
              All projects <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {topProjects.map((project) => (
            <Card key={`${project.project}-${project.owner}`}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-500/10 font-mono text-sm uppercase text-teal-300">
                    {project.project.slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-semibold">
                      {project.project}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-ink-3">
                      @{project.owner} · {project.repo_count}{" "}
                      {project.repo_count === 1 ? "repo" : "repos"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1.5 font-mono text-teal-300">
                      <CircleDot className="size-3.5" />
                      {project.issue_count}
                    </p>
                    <p className="text-[11px] text-ink-3">open issues</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/opensource/issues?project=${encodeURIComponent(
                        project.project,
                      )}`}
                    >
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {languages.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-display text-lg font-semibold">
            Browse by language
          </h3>
          <div className="flex flex-wrap gap-2">
            {languages.slice(0, 12).map((l) => (
              <Link
                key={l.language}
                href={`/opensource/projects?language=${encodeURIComponent(
                  l.language,
                )}`}
              >
                <Badge variant="outline">
                  {l.language}{" "}
                  <span className="ml-1 text-ink-3">{l.count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="size-4 text-teal-400" /> How Snowdrift works
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-relaxed text-ink-2 sm:grid-cols-3">
          <p>
            <span className="flex items-center gap-1.5 font-medium text-ink-1">
              <Search className="size-3.5 text-teal-400" /> Find work.
            </span>
            Issues are pulled from the Electric Capital ecosystem taxonomy, so
            the list covers the whole Avalanche ecosystem rather than a
            hand-picked set of repos.
          </p>
          <p>
            <span className="flex items-center gap-1.5 font-medium text-ink-1">
              <GitPullRequest className="size-3.5 text-teal-400" /> Contribute.
            </span>
            Every issue links to the real repository. You claim, discuss, and
            open your pull request on GitHub, with the maintainers, exactly as
            you would otherwise.
          </p>
          <p>
            <span className="flex items-center gap-1.5 font-medium text-ink-1">
              <FolderGit2 className="size-3.5 text-teal-400" /> Paid tasks.
            </span>
            Maintainers can attach a funded task to an issue through Snowdrift
            Tasks, with the bounty held in escrow and released on approval.
            Funded issues surface here when they exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
