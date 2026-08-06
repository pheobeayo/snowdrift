import catalog from "@/data/avalanche-owners.json";
import type { OwnerCatalog, OwnerEntry } from "./type";

export const CATALOG = catalog as OwnerCatalog;

export const OWNER_LIMIT = 60;

export const CONTRIBUTION_LABELS = [
  "good first issue",
  "help wanted",
  "bounty",
  "up-for-grabs",
];

export const EXCLUDED_OWNERS = new Set<string>(["tornadocash"]);

export const EXCLUDED_REPOS = new Set<string>([
  "pangolindex/tokenlists", 
]);

export const PINNED_OWNERS = ["ava-labs", "pangolindex"];

export function getSearchOwners(limit = OWNER_LIMIT): OwnerEntry[] {
  const usable = CATALOG.owners.filter((o) => !EXCLUDED_OWNERS.has(o.owner));
  const pinned = PINNED_OWNERS.map((p) =>
    usable.find((o) => o.owner === p),
  ).filter((o): o is OwnerEntry => !!o);
  const rest = usable.filter((o) => !PINNED_OWNERS.includes(o.owner));
  return [...pinned, ...rest].slice(0, limit);
}

const PROJECT_BY_OWNER = new Map(
  CATALOG.owners.map((o) => [o.owner, o.project]),
);

export function projectForOwner(owner: string): string {
  return PROJECT_BY_OWNER.get(owner.toLowerCase()) ?? owner;
}

export function isExcludedRepo(fullName: string): boolean {
  return EXCLUDED_REPOS.has(fullName.toLowerCase());
}
