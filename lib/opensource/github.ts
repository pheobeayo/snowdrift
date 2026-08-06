import {
  CONTRIBUTION_LABELS,
  getSearchOwners,
  isExcludedRepo,
  projectForOwner,
} from "./ecosystem";
import type { GitHubIssue, IssueItem } from "./type";

const GITHUB_API = "https://api.github.com";

const MAX_SCOPE_CHARS = 170;

const MAX_PAGES = 10;

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
  };
}

function chunkScopes(scopes: string[]): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let length = 0;

  for (const scope of scopes) {
    const cost = scope.length + 1;
    if (length + cost > MAX_SCOPE_CHARS && current.length) {
      chunks.push(current);
      current = [];
      length = 0;
    }
    current.push(scope);
    length += cost;
  }

  if (current.length) chunks.push(current);
  return chunks;
}

type SearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
};

async function runSearch(
  query: string,
  revalidate: number,
): Promise<{ items: GitHubIssue[]; truncated: boolean }> {
  const items: GitHubIssue[] = [];
  let truncated = false;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      q: query,
      per_page: "100",
      page: String(page),
      sort: "updated",
      order: "desc",
    });

    const res = await fetch(`${GITHUB_API}/search/issues?${params}`, {
      headers: headers(),
      next: { revalidate },
    });

    if (res.status === 403 || res.status === 429) {
      console.warn("[opensource] search rate limited, partial results");
      truncated = true;
      break;
    }

    if (!res.ok) {
      console.error(`[opensource] search ${res.status}: ${query}`);
      break;
    }

    const data = (await res.json()) as SearchResponse;
    items.push(...data.items);

    if (data.total_count > 1000) truncated = true;
    if (data.items.length < 100) break;
  }

  return { items, truncated };
}

function toIssueItem(issue: GitHubIssue): IssueItem | null {
  if (issue.pull_request) return null;

  const parts = issue.repository_url.split("/");
  const repo = parts[parts.length - 1];
  const owner = parts[parts.length - 2];
  const repo_name = `${owner}/${repo}`;

  if (isExcludedRepo(repo_name)) return null;

  return {
    ...issue,
    repo_name,
    owner,
    repo,
    project: projectForOwner(owner),
    task: null,
  };
}

export async function fetchEcosystemIssues(
  opts: {
    labels?: string[];
    ownerLimit?: number;
    revalidate?: number;
  } = {},
): Promise<{ issues: IssueItem[]; truncated: boolean }> {
  const labels = opts.labels ?? CONTRIBUTION_LABELS;
  const revalidate = opts.revalidate ?? 1800;

  const scopes = getSearchOwners(opts.ownerLimit).map((o) => `org:${o.owner}`);
  const chunks = chunkScopes(scopes);

  const queries: string[] = [];
  for (const chunk of chunks) {
    const scope = chunk.join(" ");
    if (labels.length === 0) {
      queries.push(`is:issue is:open archived:false ${scope}`);
    } else {
      for (const label of labels) {
        queries.push(
          `is:issue is:open archived:false ${scope} label:"${label}"`,
        );
      }
    }
  }

  const seen = new Map<number, IssueItem>();
  let truncated = false;

  for (const query of queries) {
    const result = await runSearch(query, revalidate);
    if (result.truncated) truncated = true;
    for (const raw of result.items) {
      const item = toIssueItem(raw);
      if (item && !seen.has(item.id)) seen.set(item.id, item);
    }
  }

  const issues = [...seen.values()].sort(
    (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at),
  );

  return { issues, truncated };
}
