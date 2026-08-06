import { fetchEcosystemIssues } from "./github";
import { fetchRepoMeta } from "./repo-meta";
import type {
  EcosystemSnapshot,
  IssueItem,
  LabelFacet,
  ProjectGroup,
  RepoGroup,
} from "./type";

function topLabels(issues: IssueItem[], limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const issue of issues) {
    for (const label of issue.labels) {
      counts.set(label.name, (counts.get(label.name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

export async function getSnapshot(
  opts: { labels?: string[]; ownerLimit?: number } = {},
): Promise<EcosystemSnapshot> {
  const { issues, truncated } = await fetchEcosystemIssues(opts);

  const byRepo = new Map<string, IssueItem[]>();
  for (const issue of issues) {
    const list = byRepo.get(issue.repo_name) ?? [];
    list.push(issue);
    byRepo.set(issue.repo_name, list);
  }

  const metaByRepo = await fetchRepoMeta([...byRepo.keys()]);

  const repos: RepoGroup[] = [...byRepo.entries()]
    .map(([fullName, repoIssues]) => {
      const [owner, name] = fullName.split("/");
      const meta = metaByRepo.get(fullName.toLowerCase());

      return {
        full_name: fullName,
        owner,
        name,
        project: repoIssues[0].project,
        description: meta?.description ?? "",
        language: meta?.language ?? null,
        stars: meta?.stars ?? 0,
        forks: meta?.forks ?? 0,
        html_url: meta?.html_url ?? `https://github.com/${fullName}`,
        pushed_at: meta?.pushed_at ?? "",
        issue_count: repoIssues.length,
        issues: repoIssues,
        tags: topLabels(repoIssues),
      } satisfies RepoGroup;
    })
    .filter((r) => !metaByRepo.get(r.full_name.toLowerCase())?.is_archived)
    .sort((a, b) => b.issue_count - a.issue_count || b.stars - a.stars);

  const byProject = new Map<string, RepoGroup[]>();
  for (const repo of repos) {
    const key = `${repo.project}::${repo.owner}`;
    const list = byProject.get(key) ?? [];
    list.push(repo);
    byProject.set(key, list);
  }

  const projects: ProjectGroup[] = [...byProject.entries()]
    .map(([key, group]) => {
      const [project, owner] = key.split("::");
      return {
        project,
        owner,
        repo_count: group.length,
        issue_count: group.reduce((s, r) => s + r.issue_count, 0),
        repos: group,
      };
    })
    .sort((a, b) => b.issue_count - a.issue_count);

  return {
    issues,
    repos,
    projects,
    stats: {
      total_issues: issues.length,
      total_repos: repos.length,
      total_projects: projects.length,
    },
    truncated,
    fetched_at: new Date().toISOString(),
  };
}

export async function getRepos(filter?: {
  project?: string;
  language?: string;
}): Promise<RepoGroup[]> {
  const { repos } = await getSnapshot();
  let rows = repos;

  if (filter?.project) {
    const wanted = filter.project.toLowerCase();
    rows = rows.filter((r) => r.project.toLowerCase() === wanted);
  }
  if (filter?.language) {
    const wanted = filter.language.toLowerCase();
    rows = rows.filter((r) => r.language?.toLowerCase() === wanted);
  }

  return rows;
}

export async function getProjects(): Promise<ProjectGroup[]> {
  const { projects } = await getSnapshot();
  return projects;
}

export async function getIssues(filter?: {
  project?: string;
  repo?: string;
  owner?: string;
  label?: string;
  search?: string;
}): Promise<IssueItem[]> {
  const { issues } = await getSnapshot();
  let rows = issues;

  if (filter?.project) {
    const wanted = filter.project.toLowerCase();
    rows = rows.filter((i) => i.project.toLowerCase() === wanted);
  }
  if (filter?.repo) {
    const wanted = filter.repo.toLowerCase();
    rows = rows.filter((i) => i.repo_name.toLowerCase() === wanted);
  }
  if (filter?.owner) {
    const wanted = filter.owner.toLowerCase();
    rows = rows.filter((i) => i.owner.toLowerCase() === wanted);
  }
  if (filter?.label) {
    const wanted = filter.label.toLowerCase();
    rows = rows.filter((i) =>
      i.labels.some((l) => l.name.toLowerCase() === wanted),
    );
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    rows = rows.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.repo_name.toLowerCase().includes(q),
    );
  }

  return rows;
}

export async function getStats() {
  const { stats } = await getSnapshot();
  return stats;
}

export async function getLabelFacets(): Promise<LabelFacet[]> {
  const { issues } = await getSnapshot();
  const map = new Map<string, LabelFacet>();

  for (const issue of issues) {
    for (const label of issue.labels) {
      const key = label.name.toLowerCase();
      const existing = map.get(key);
      if (existing) existing.count += 1;
      else map.set(key, { name: label.name, color: label.color, count: 1 });
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

export async function getProjectFacets(): Promise<
  Array<{ project: string; count: number }>
> {
  const { projects } = await getSnapshot();
  return projects.map((p) => ({ project: p.project, count: p.issue_count }));
}

export async function getLanguageFacets(): Promise<
  Array<{ language: string; count: number }>
> {
  const { repos } = await getSnapshot();
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) {
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}
