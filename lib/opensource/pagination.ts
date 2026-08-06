import { getIssues, getRepos } from "./projects";
import type { IssueItem, RepoGroup } from "./type";

export const ISSUES_PER_PAGE = 9; 
export const PROJECTS_PER_PAGE = 6; 

export type Paginated<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
};

export function paginate<T>(
  all: T[],
  page: number,
  perPage: number,
): Paginated<T> {
  const total = all.length;
  const total_pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), total_pages);
  const start = (current - 1) * perPage;

  return {
    items: all.slice(start, start + perPage),
    page: current,
    per_page: perPage,
    total,
    total_pages,
    has_prev: current > 1,
    has_next: current < total_pages,
  };
}

export function parsePage(value?: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export async function getIssuesPage(
  filter: {
    project?: string;
    repo?: string;
    owner?: string;
    label?: string;
    search?: string;
  },
  page = 1,
  perPage = ISSUES_PER_PAGE,
): Promise<Paginated<IssueItem>> {
  const all = await getIssues(filter);
  return paginate(all, page, perPage);
}

export async function getReposPage(
  filter: { project?: string; language?: string },
  page = 1,
  perPage = PROJECTS_PER_PAGE,
): Promise<Paginated<RepoGroup>> {
  const all = await getRepos(filter);
  return paginate(all, page, perPage);
}
