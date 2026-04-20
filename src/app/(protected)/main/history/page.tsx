"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { absoluteDate, relativeTime } from "@/lib/utils";
import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ChangelogPr {
  id: string;
  prUrl: string;
  prTitle: string;
  owner: string;
  repo: string;
  prNumber: string;
}

interface Changelog {
  id: string;
  userId: string;
  output: string;
  style: string;
  format: string;
  createdAt: string;
  prs: ChangelogPr[];
}

/** Derive display fields from a changelog + its PRs */
function deriveEntry(c: Changelog) {
  const prs = c.prs;
  const repo =
    prs.length > 0 ? `${prs[0].owner}/${prs[0].repo}` : "unknown/repo";
  const title =
    prs.length === 1 ? prs[0].prTitle : `${prs.length} PRs combined`;
  const prTitles = prs.length > 1 ? prs.map((p) => p.prTitle) : undefined;

  return { repo, title, prTitles };
}

const PAGE_SIZE = 20;

export default function HistoryPage() {
  const [entries, setEntries] = useState<Changelog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (pageNum: number, append = false) => {
    const res = await fetch(
      `/api/changelogs?page=${pageNum}&limit=${PAGE_SIZE}`,
    );
    if (!res.ok) return;
    const data = await res.json();

    setEntries((prev) => (append ? [...prev, ...data.entries] : data.entries));
    setHasMore(data.hasMore);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPage(1).finally(() => setLoading(false));
  }, [fetchPage]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchPage(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const handleDelete = async (id: string) => {
    // Optimistic removal
    setEntries((prev) => prev.filter((e) => e.id !== id));

    const res = await fetch(`/api/changelogs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      // Revert on failure — refetch current data
      await fetchPage(1);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 pt-10 pb-24">
      <h1 className="text-lg font-medium tracking-tight">History</h1>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="border-border flex min-h-48 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground text-sm">
            No changelogs generated yet.
          </p>
        </div>
      ) : (
        <div className="divide-border border-border divide-y rounded-lg border">
          {entries.map((entry) => (
            <HistoryRow
              key={entry.id}
              entry={entry}
              onDelete={() => handleDelete(entry.id)}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <Button
          variant="outline"
          className="mx-auto"
          disabled={loadingMore}
          onClick={handleLoadMore}
        >
          {loadingMore ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Loading…
            </>
          ) : (
            "Load more"
          )}
        </Button>
      )}
    </main>
  );
}

function HistoryRow({
  entry,
  onDelete,
}: {
  entry: Changelog;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { repo, title, prTitles } = deriveEntry(entry);
  const createdAt = new Date(entry.createdAt);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
      {/* Left content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-muted-foreground font-mono text-xs">{repo}</span>

        <span className="text-sm font-medium">{title}</span>

        {/* PR subtitle for multi-PR entries */}
        {prTitles && prTitles.length > 0 && (
          <span className="text-muted-foreground truncate text-xs">
            {prTitles.join(" · ")}
          </span>
        )}
      </div>

      {/* Bottom row on mobile, right side on desktop */}
      <div className="flex items-center gap-3">
        {/* Style badge */}
        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
          {entry.style}
        </span>

        {/* Date with tooltip */}
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground cursor-default text-xs tabular-nums sm:w-16 sm:text-right">
            {relativeTime(createdAt)}
          </TooltipTrigger>
          <TooltipContent>{absoluteDate(createdAt)}</TooltipContent>
        </Tooltip>

        {/* Spacer pushes actions to the right on mobile */}
        <div className="flex-1 sm:hidden" />

        {/* Actions — always visible on mobile, hover-reveal on desktop */}
        <div className="flex items-center gap-0.5 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            aria-label="Copy changelog"
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onDelete}
            aria-label="Delete entry"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
