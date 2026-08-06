export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  number: number;
  state: string;
  created_at: string;
  updated_at: string;
  comments: number;
  user: GitHubUser;
  assignee: GitHubUser | null;
  labels: GitHubLabel[];
  repository_url: string;
  pull_request?: unknown;
}

export interface IssueItem extends GitHubIssue {
  repo_name: string;
  owner: string;
  repo: string;
  project: string;
  task: null;
}

export interface RepoGroup {
  full_name: string;
  owner: string;
  name: string;
  project: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  html_url: string;
  pushed_at: string;
  issue_count: number;
  issues: IssueItem[];
  tags: string[];
}

export interface ProjectGroup {
  project: string;
  owner: string;
  repo_count: number;
  issue_count: number;
  repos: RepoGroup[];
}

export interface EcosystemSnapshot {
  issues: IssueItem[];
  repos: RepoGroup[];
  projects: ProjectGroup[];
  stats: {
    total_issues: number;
    total_repos: number;
    total_projects: number;
  };

  truncated: boolean;
  fetched_at: string;
}

export interface LabelFacet {
  name: string;
  color: string;
  count: number;
}

export interface OwnerEntry {
  owner: string;
  repos: number;
  project: string;
  ecosystems: string[];
}

export interface OwnerCatalog {
  source: string;
  root: string;
  sub_ecosystems: number;
  total_owners_in_taxonomy: number;
  total_repos_in_taxonomy: number;
  owners: OwnerEntry[];
}
