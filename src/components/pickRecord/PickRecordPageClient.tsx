"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PickRecordEventHeader } from "@/components/pickRecord/PickRecordEventHeader";
import { PickRecordExportSheet } from "@/components/pickRecord/PickRecordExportSheet";
import { PickRecordRow } from "@/components/pickRecord/PickRecordRow";
import { PickRecordSectionDivider } from "@/components/pickRecord/PickRecordSectionDivider";
import {
  buildPickRecordItems,
  buildPickRecordListEntries,
  getPickRecordCounts,
  sortPickRecordItems,
  type PickRecordTab,
} from "@/lib/pickRecord/pickRecord";
import { cn } from "@/lib/utils";
import type { FightWithRelations, Prediction, Profile } from "@/types";

interface PickRecordPageClientProps {
  profile: Profile;
  predictions: Prediction[];
  fights: FightWithRelations[];
}

const TABS: { id: PickRecordTab; label: string; shortLabel: string }[] = [
  { id: "future", label: "Future Picks", shortLabel: "Future" },
  { id: "past", label: "Past Picks", shortLabel: "Past" },
  { id: "all", label: "All Picks", shortLabel: "All" },
];

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function getActiveTabMeta(
  tab: PickRecordTab,
  counts: ReturnType<typeof getPickRecordCounts>,
  visibleCount: number
) {
  const active = TABS.find((option) => option.id === tab)!;
  if (tab === "future") {
    return {
      title: active.label.toUpperCase(),
      subtitle: `${visibleCount} upcoming pick${visibleCount === 1 ? "" : "s"}`,
    };
  }
  if (tab === "past") {
    return {
      title: active.label.toUpperCase(),
      subtitle: `${visibleCount} settled pick${visibleCount === 1 ? "" : "s"}`,
    };
  }
  return {
    title: active.label.toUpperCase(),
    subtitle: `${counts.total} total · ${counts.upcoming} upcoming · ${counts.settled} settled`,
  };
}

export function PickRecordPageClient({
  profile,
  predictions,
  fights,
}: PickRecordPageClientProps) {
  const [tab, setTab] = useState<PickRecordTab>("all");
  const [exportOpen, setExportOpen] = useState(false);

  const allItems = useMemo(
    () => buildPickRecordItems(predictions, fights),
    [predictions, fights]
  );
  const counts = useMemo(() => getPickRecordCounts(allItems), [allItems]);

  const sortedItems = useMemo(
    () => sortPickRecordItems(allItems, tab),
    [allItems, tab]
  );

  const listEntries = useMemo(
    () => buildPickRecordListEntries(allItems, tab),
    [allItems, tab]
  );

  const emptyMessage =
    tab === "future"
      ? "No future picks yet. Make picks on upcoming fights."
      : tab === "past"
        ? "No past picks yet. Your results will appear here after fights grade."
        : "No picks yet. Head to Picks to make your first prediction.";

  const activeTabMeta = getActiveTabMeta(tab, counts, sortedItems.length);
  const tabPanelId = `pick-record-panel-${tab}`;

  return (
    <div className="pickfist-content mx-auto w-full max-w-lg pb-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/profile"
          className="text-xs font-semibold uppercase tracking-wide text-zinc-400 hover:text-white"
        >
          ← Profile
        </Link>
        <button
          type="button"
          onClick={() => setExportOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#111111] px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-zinc-100 hover:border-zinc-500 sm:px-3 sm:text-[11px]"
        >
          <DownloadIcon className="h-3.5 w-3.5 shrink-0 text-red-500" />
          <span className="hidden min-[380px]:inline">Download Pick Record</span>
          <span className="min-[380px]:hidden">Download</span>
        </button>
      </div>

      <header className="mt-4">
        <h1 className="font-[family-name:var(--font-teko)] text-2xl font-bold uppercase tracking-wide text-white">
          Pick Record
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Future picks, past results, and downloadable receipts.
        </p>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
          {counts.upcoming} upcoming · {counts.settled} settled
        </p>
      </header>

      <div
        className="mt-4 flex rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-1"
        role="tablist"
        aria-label="Pick record views"
      >
        {TABS.map((option) => {
          const selected = tab === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={tabPanelId}
              onClick={() => setTab(option.id)}
              className={cn(
                "min-w-0 flex-1 rounded-lg border px-1.5 uppercase tracking-wide transition-colors sm:px-2",
                selected
                  ? "border-red-600 bg-red-600/15 py-2.5 font-[family-name:var(--font-teko)] text-sm font-bold text-white sm:py-3 sm:text-base"
                  : "border-transparent py-2 text-[9px] font-bold text-zinc-500 hover:text-zinc-300 sm:text-[10px]"
              )}
            >
              <span className="hidden sm:inline">{option.label}</span>
              <span className="sm:hidden">{option.shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`pick-record-heading-${tab}`}
        className="mt-3 rounded-xl border border-red-600/35 bg-red-600/10 px-3 py-2.5"
      >
        <p className="text-[9px] font-bold uppercase tracking-wider text-red-400">
          Viewing
        </p>
        <p className="font-[family-name:var(--font-teko)] text-2xl font-bold uppercase leading-none tracking-wide text-white">
          {activeTabMeta.title}
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          {activeTabMeta.subtitle}
        </p>
      </div>

      <div
        id={tabPanelId}
        className="mt-3 space-y-2"
        role="tabpanel"
        aria-labelledby={`pick-record-heading-${tab}`}
      >
        {sortedItems.length === 0 ? (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-6 text-center">
            <p className="text-sm text-zinc-400">{emptyMessage}</p>
            <Link
              href="/picks"
              className="mt-3 inline-block text-sm font-semibold text-red-500 hover:text-red-400"
            >
              Go to Picks →
            </Link>
          </div>
        ) : (
          listEntries.map((entry, index) => {
            if (entry.kind === "section") {
              return (
                <PickRecordSectionDivider
                  key={`${entry.sectionKey}-section-${index}`}
                  sectionKey={entry.sectionKey}
                  title={entry.title}
                  subtitle={entry.subtitle}
                />
              );
            }
            if (entry.kind === "header") {
              return (
                <PickRecordEventHeader
                  key={`${entry.eventId}-header-${index}`}
                  sport={entry.sport}
                  eventName={entry.eventName}
                  eventDateLabel={entry.eventDateLabel}
                />
              );
            }
            return (
              <PickRecordRow
                key={entry.item.prediction.id}
                item={entry.item}
              />
            );
          })
        )}
      </div>

      <PickRecordExportSheet
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        allItems={allItems}
        profile={profile}
        defaultScope={tab}
      />
    </div>
  );
}
