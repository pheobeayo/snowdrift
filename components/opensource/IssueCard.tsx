import { IssueItem } from "@/lib/opensource/type";
import {
  ExternalLinkIcon,
  MessageSquareIcon,
  CircleDotIcon,
} from "lucide-react";

function relativeTime(iso: string) {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;
}

export default function IssueCard({ issue }: { issue: IssueItem }) {
  return (
    <a
      href={issue.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:-translate-y-1 hover:border-red-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-red-500/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CircleDotIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span className="truncate text-xs font-semibold text-red-400">
              {issue.repo_name}
            </span>
            <span className="shrink-0 font-mono text-xs text-slate-600">
              #{issue.number}
            </span>
          </div>

          {issue.project !== issue.owner && (
            <span className="mt-1.5 inline-block rounded border border-slate-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
              {issue.project}
            </span>
          )}

          <h3 className="mt-1.5 text-lg font-medium text-slate-100 transition-colors group-hover:text-red-400">
            {issue.title}
          </h3>
        </div>
        <ExternalLinkIcon className="h-5 w-5 shrink-0 text-slate-500 transition-colors group-hover:text-red-400" />
      </div>

      {issue.labels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {issue.labels.slice(0, 5).map((label) => (
            <span
              key={label.id}
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{
                borderColor: `#${label.color}`,
                color: `#${label.color}`,
              }}
            >
              {label.name}
            </span>
          ))}
          {issue.labels.length > 5 && (
            <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              +{issue.labels.length - 5}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <img
            src={issue.user.avatar_url}
            alt={issue.user.login}
            className="h-4 w-4 rounded-full"
          />
          <span>{issue.user.login}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">
            {relativeTime(issue.updated_at)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {issue.assignee && (
            <span className="flex items-center gap-1 text-amber-500/80">
              <img
                src={issue.assignee.avatar_url}
                alt={issue.assignee.login}
                className="h-4 w-4 rounded-full"
              />
              assigned
            </span>
          )}
          <span className="flex items-center gap-1">
            <MessageSquareIcon className="h-3.5 w-3.5" />
            {issue.comments}
          </span>
        </div>
      </div>
    </a>
  );
}
