"use client";

import { useEffect, useState } from "react";
import {
  buildPickRecordExportText,
  downloadPickRecordPdf,
  downloadPickRecordTxt,
  pickRecordExportFilename,
  type PickRecordExportFormat,
  type PickRecordExportScope,
} from "@/lib/pickRecord/exportPickRecord";
import {
  sortPickRecordItems,
  type PickRecordItem,
} from "@/lib/pickRecord/pickRecord";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils";

interface PickRecordExportSheetProps {
  open: boolean;
  onClose: () => void;
  allItems: PickRecordItem[];
  profile: Profile;
  /** Matches the active Pick Record tab when the sheet opens. */
  defaultScope: PickRecordExportScope;
}

const SCOPE_OPTIONS: { id: PickRecordExportScope; label: string }[] = [
  { id: "future", label: "Future Picks" },
  { id: "past", label: "Past Picks" },
  { id: "all", label: "All Picks" },
];

const FORMAT_OPTIONS: { id: PickRecordExportFormat; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "txt", label: "TXT" },
];

const EMPHASIS_MS = 3300;

function itemsForExport(
  items: PickRecordItem[],
  scope: PickRecordExportScope
): PickRecordItem[] {
  return sortPickRecordItems(items, scope);
}

function scopeLabel(scope: PickRecordExportScope): string {
  return SCOPE_OPTIONS.find((option) => option.id === scope)?.label ?? scope;
}

export function PickRecordExportSheet({
  open,
  onClose,
  allItems,
  profile,
  defaultScope,
}: PickRecordExportSheetProps) {
  const [scope, setScope] = useState<PickRecordExportScope>(defaultScope);
  const [format, setFormat] = useState<PickRecordExportFormat>("pdf");
  const [exporting, setExporting] = useState(false);
  const [emphasizeDefaults, setEmphasizeDefaults] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmphasizeDefaults(false);
      return;
    }

    setScope(defaultScope);
    setFormat("pdf");
    setEmphasizeDefaults(true);
    const timer = window.setTimeout(() => setEmphasizeDefaults(false), EMPHASIS_MS);
    return () => window.clearTimeout(timer);
  }, [open, defaultScope]);

  const clearEmphasis = () => setEmphasizeDefaults(false);

  if (!open) return null;

  const handleExport = async () => {
    setExporting(true);
    try {
      const generatedAt = new Date().toISOString();
      const items = itemsForExport(allItems, scope);
      const meta = { profile, scope, generatedAt };
      const filename = pickRecordExportFilename(
        profile.username,
        format,
        generatedAt
      );

      if (format === "txt") {
        const text = buildPickRecordExportText(items, meta);
        downloadPickRecordTxt(text, filename);
      } else {
        await downloadPickRecordPdf(items, meta, filename);
      }
      onClose();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pick-record-export-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close download"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4 shadow-xl">
        <h2
          id="pick-record-export-title"
          className="text-sm font-bold uppercase tracking-wide text-white"
        >
          Download Pick Record
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Save your picks as a PDF or text receipt.
        </p>

        <div
          className={cn(
            "mt-3 rounded-xl border border-red-600/40 bg-red-600/10 px-3 py-2.5",
            emphasizeDefaults && "export-record-selection-banner"
          )}
          aria-live="polite"
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-red-400">
            You&apos;re downloading
          </p>
          <p className="font-[family-name:var(--font-teko)] text-2xl font-bold uppercase leading-none tracking-wide text-white">
            {scopeLabel(scope)}
          </p>
          <p className="mt-1 font-[family-name:var(--font-teko)] text-sm font-bold uppercase tracking-wide text-[#d4a853]">
            as {format}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <fieldset>
            <legend className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Include
            </legend>
            <div className="mt-2 space-y-1.5">
              {SCOPE_OPTIONS.map((option) => {
                const selected = scope === option.id;
                const pulseDefault =
                  emphasizeDefaults && selected && option.id === defaultScope;

                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-3 transition-colors",
                      selected
                        ? "border-red-600 bg-red-600/15 py-3"
                        : "border-[#2a2a2a] py-2 text-zinc-400 hover:border-zinc-600",
                      pulseDefault && "export-record-default-pulse"
                    )}
                  >
                    <input
                      type="radio"
                      name="export-scope"
                      checked={selected}
                      onChange={() => {
                        setScope(option.id);
                        clearEmphasis();
                      }}
                      className="accent-red-600"
                    />
                    <span
                      className={cn(
                        "flex-1 uppercase tracking-wide",
                        selected
                          ? "font-[family-name:var(--font-teko)] text-xl font-bold text-white"
                          : "text-sm text-zinc-400"
                      )}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="rounded bg-red-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                        Selected
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Format
            </legend>
            <div className="mt-2 flex gap-2">
              {FORMAT_OPTIONS.map((option) => {
                const selected = format === option.id;
                const pulseDefault =
                  emphasizeDefaults && selected && option.id === "pdf";

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setFormat(option.id);
                      clearEmphasis();
                    }}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2.5 uppercase tracking-wide transition-colors",
                      selected
                        ? "border-red-600 bg-red-600/15 font-[family-name:var(--font-teko)] text-lg font-bold text-white"
                        : "border-[#2a2a2a] text-xs font-bold text-zinc-400 hover:border-zinc-600",
                      pulseDefault && "export-record-default-pulse"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#2a2a2a] px-4 py-2.5 text-xs font-bold uppercase text-zinc-300 hover:border-zinc-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold uppercase text-white hover:bg-red-500 disabled:opacity-60"
          >
            {exporting ? "Downloading…" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
