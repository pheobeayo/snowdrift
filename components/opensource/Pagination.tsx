import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Paginated } from "@/lib/opensource/pagination";

function pageWindow(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const out: Array<number | "gap"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) out.push("gap");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("gap");
  out.push(total);

  return out;
}

export default function Pagination({
  pathname,
  searchParams,
  result,
  label = "items",
}: {
  pathname: string;
  searchParams: Record<string, string | undefined>;
  result: Paginated<unknown>;
  label?: string;
}) {
  if (result.total_pages <= 1) return null;

  const href = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const from = (result.page - 1) * result.per_page + 1;
  const to = Math.min(result.page * result.per_page, result.total);

  const linkBase =
    "flex size-8 items-center justify-center rounded-md border text-xs transition-colors";
  const inactive =
    "border-line-1 text-ink-2 hover:border-line-3 hover:text-ink-1";
  const disabled = "border-line-1 text-ink-3 opacity-40 pointer-events-none";

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-line-1 pt-4 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-xs text-ink-3">
        {from}–{to} of {result.total} {label}
      </p>

      <div className="flex items-center gap-1.5">
        <Link
          href={href(result.page - 1)}
          aria-label="Previous page"
          aria-disabled={!result.has_prev}
          className={`${linkBase} ${result.has_prev ? inactive : disabled}`}
        >
          <ChevronLeft className="size-4" />
        </Link>

        {pageWindow(result.page, result.total_pages).map((entry, i) =>
          entry === "gap" ? (
            <span
              key={`gap-${i}`}
              className="px-1 text-xs text-ink-3"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={entry}
              href={href(entry)}
              aria-current={entry === result.page ? "page" : undefined}
              className={`${linkBase} ${
                entry === result.page
                  ? "border-teal-700 bg-teal-500/10 font-medium text-teal-300"
                  : inactive
              }`}
            >
              {entry}
            </Link>
          ),
        )}

        <Link
          href={href(result.page + 1)}
          aria-label="Next page"
          aria-disabled={!result.has_next}
          className={`${linkBase} ${result.has_next ? inactive : disabled}`}
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
}
