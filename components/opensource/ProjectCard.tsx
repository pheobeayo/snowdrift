import Link from "next/link";
import { ExternalLink, GitFork, Star, CircleDot, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { RepoGroup } from "@/lib/opensource/type";

const languageDot: Record<string, string> = {
  Solidity: "#c084fc",
  TypeScript: "#5aa9e6",
  JavaScript: "#f4b860",
  Rust: "#f4b860",
  Go: "#5aa9e6",
  Python: "#5aa9e6",
  Cairo: "#e06c75",
};

function lastPush(iso: string) {
  if (!iso) return "unknown";
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;
}

export default function ProjectCard({ repo }: { repo: RepoGroup }) {
  return (
    <Card className="card-glow flex flex-col transition-colors hover:border-teal-700">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-teal-400">
              <GitFork className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs text-ink-3">{repo.owner}/</p>
              <h3 className="truncate font-display text-base font-semibold text-ink-1">
                {repo.name}
              </h3>
            </div>
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${repo.full_name} on GitHub`}
            className="rounded-md p-1.5 text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink-1"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink-2">
          {repo.description || "No description provided."}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {/* Project label from the ecosystem taxonomy, then the most
              common labels on this repo's open issues. */}
          {repo.project !== repo.owner && (
            <Badge variant="outline">{repo.project}</Badge>
          )}
          {repo.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line-1 pt-4 text-xs text-ink-2 sm:grid-cols-4">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{
                background: repo.language
                  ? (languageDot[repo.language] ?? "#95b8a5")
                  : "#95b8a5",
              }}
              aria-hidden
            />
            {repo.language ?? "Unknown"}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5 text-ink-3" />{" "}
            {repo.stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork className="size-3.5 text-ink-3" />{" "}
            {repo.forks.toLocaleString()}
          </span>
          <span
            className="flex items-center gap-1.5"
            title="Last push to the default branch"
          >
            <Clock className="size-3.5 text-ink-3" /> {lastPush(repo.pushed_at)}
          </span>
        </div>

        <Link
          href={`/opensource/issues?repo=${encodeURIComponent(repo.full_name)}`}
          className="flex items-center justify-between rounded-lg border border-teal-700/40 bg-teal-500/5 px-4 py-2.5 transition-colors hover:border-teal-700 hover:bg-teal-500/10"
        >
          <span className="flex items-center gap-1.5 text-xs text-ink-2">
            <CircleDot className="size-3.5 text-teal-400" />
            {repo.issue_count} open{" "}
            {repo.issue_count === 1 ? "issue" : "issues"}
          </span>
          <span className="font-mono text-sm text-teal-300">View</span>
        </Link>
      </CardContent>
    </Card>
  );
}
