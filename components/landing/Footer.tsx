import { Snowflake } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line-1">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-ink-3 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Snowflake className="size-4 text-teal-500" />
          <span>© 2026 Snowdrift Protocol</span>
        </div>
        <div className="flex gap-5">
          <span>Avalanche</span>
          <span>EscrowManager</span>
          <span>ContributionStreamer</span>
        </div>
      </div>
    </footer>
  );
}
