import type { Profile } from "@/types";
import {
  formatCompactPickLine,
  formatCompactResultLine,
  formatEventDateShort,
  formatExportGeneratedAt,
  getPickRecordStatusLabel,
  sortPickRecordItems,
  type PickRecordItem,
  type PickRecordTab,
} from "./pickRecord";

export type PickRecordExportScope = PickRecordTab;
export type PickRecordExportFormat = "pdf" | "txt";

export interface PickRecordExportMeta {
  profile: Profile;
  scope: PickRecordExportScope;
  generatedAt: string;
}

export interface PickRecordExportSection {
  key: "future" | "past";
  title: string;
  subtitle: string;
  items: PickRecordItem[];
}

export interface ExportSummaryStats {
  total: number;
  future: number;
  past: number;
  accuracy: string;
}

export interface ExportEventGroup {
  eventId: string;
  dateLabel: string;
  sport: string;
  eventName: string;
  items: PickRecordItem[];
}

type PdfRgb = [number, number, number];

const PDF_COLORS = {
  brandRed: [220, 38, 38] as PdfRgb,
  gold: [212, 168, 83] as PdfRgb,
  green: [22, 163, 74] as PdfRgb,
  red: [220, 38, 38] as PdfRgb,
  grey: [100, 100, 100] as PdfRgb,
  darkGrey: [45, 45, 45] as PdfRgb,
  black: [20, 20, 20] as PdfRgb,
  chipFill: [245, 245, 245] as PdfRgb,
  chipBorder: [212, 168, 83] as PdfRgb,
};

function scopeLabel(scope: PickRecordExportScope): string {
  if (scope === "future") return "Future Picks";
  if (scope === "past") return "Past Picks";
  return "All Picks";
}

function sectionTitleForBucket(bucket: "future" | "past"): string {
  return bucket === "future" ? "FUTURE PICKS" : "PAST PICKS";
}

function buildPastSectionSummary(items: PickRecordItem[]): string {
  const won = items.filter(
    (item) => item.status === "won" || item.status === "perfect"
  ).length;
  const lost = items.filter((item) => item.status === "lost").length;
  const perfect = items.filter((item) => item.status === "perfect").length;
  const graded = won + lost;
  const accuracy =
    graded > 0 ? `${Math.round((won / graded) * 1000) / 10}%` : "—";
  return `${items.length} pick(s) · ${won} won · ${lost} lost · ${perfect} perfect · ${accuracy} accuracy`;
}

function buildFutureSectionSummary(items: PickRecordItem[]): string {
  const waiting = items.filter(
    (item) => item.status === "waiting_for_results"
  ).length;
  if (waiting > 0) {
    return `${items.length} future pick(s) · ${waiting} waiting for results`;
  }
  return `${items.length} future pick(s) · waiting for fight results`;
}

export function buildExportSummaryStats(items: PickRecordItem[]): ExportSummaryStats {
  const future = items.filter((item) => item.bucket === "future").length;
  const past = items.filter((item) => item.bucket === "past").length;
  const pastItems = items.filter((item) => item.bucket === "past");
  const won = pastItems.filter(
    (item) => item.status === "won" || item.status === "perfect"
  ).length;
  const lost = pastItems.filter((item) => item.status === "lost").length;
  const graded = won + lost;
  const accuracy =
    graded > 0 ? `${Math.round((won / graded) * 1000) / 10}%` : "—";

  return {
    total: items.length,
    future,
    past,
    accuracy,
  };
}

export function buildStatChipLabels(stats: ExportSummaryStats): string[] {
  const chips = [
    `${stats.total} PICKS`,
    `${stats.future} FUTURE`,
    `${stats.past} PAST`,
  ];
  if (stats.past > 0) {
    chips.push(`${stats.accuracy} ACCURACY`);
  }
  return chips;
}

export function buildPickRecordExportSections(
  items: PickRecordItem[],
  scope: PickRecordExportScope
): PickRecordExportSection[] {
  if (scope === "future") {
    const sorted = sortPickRecordItems(items, "future");
    return sorted.length
      ? [
          {
            key: "future",
            title: sectionTitleForBucket("future"),
            subtitle: buildFutureSectionSummary(sorted),
            items: sorted,
          },
        ]
      : [];
  }

  if (scope === "past") {
    const sorted = sortPickRecordItems(items, "past");
    return sorted.length
      ? [
          {
            key: "past",
            title: sectionTitleForBucket("past"),
            subtitle: buildPastSectionSummary(sorted),
            items: sorted,
          },
        ]
      : [];
  }

  const future = sortPickRecordItems(
    items.filter((item) => item.bucket === "future"),
    "future"
  );
  const past = sortPickRecordItems(
    items.filter((item) => item.bucket === "past"),
    "past"
  );
  const sections: PickRecordExportSection[] = [];

  if (future.length > 0) {
    sections.push({
      key: "future",
      title: sectionTitleForBucket("future"),
      subtitle: buildFutureSectionSummary(future),
      items: future,
    });
  }
  if (past.length > 0) {
    sections.push({
      key: "past",
      title: sectionTitleForBucket("past"),
      subtitle: buildPastSectionSummary(past),
      items: past,
    });
  }

  return sections;
}

export function formatExportDateLabel(fight: PickRecordItem["fight"]): string {
  return formatEventDateShort(fight).toUpperCase();
}

export function groupExportItemsByEvent(
  items: PickRecordItem[]
): ExportEventGroup[] {
  const groups: ExportEventGroup[] = [];

  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.eventId === item.fight.event_id) {
      last.items.push(item);
      continue;
    }

    groups.push({
      eventId: item.fight.event_id,
      dateLabel: formatExportDateLabel(item.fight),
      sport: item.fight.sport.toUpperCase(),
      eventName: item.fight.event.name.toUpperCase(),
      items: [item],
    });
  }

  return groups;
}

function formatExportPickText(item: PickRecordItem): string {
  return formatCompactPickLine(item).replace(/^Pick: /, "");
}

function formatExportResultText(item: PickRecordItem): string {
  const line = formatCompactResultLine(item);
  return line ? line.replace(/^Result: /, "") : "—";
}

function formatExportMatchupText(item: PickRecordItem): string {
  return `${item.fight.fighter_a_name} vs ${item.fight.fighter_b_name}`;
}

export function formatPastOutcomeLine(item: PickRecordItem): string {
  const change = item.prediction.rating_change;
  if (change == null) {
    return getPickRecordStatusLabel(item.status);
  }
  const prefix = change >= 0 ? "+" : "";
  const label =
    item.status === "perfect"
      ? "Perfect"
      : item.status === "won"
        ? "Won"
        : item.status === "lost"
          ? "Lost"
          : getPickRecordStatusLabel(item.status);
  return `${prefix}${change} · ${label}`;
}

/** @deprecated Use formatPastOutcomeLine — kept for tests migrating from v1 */
export function formatExportOutcomeText(item: PickRecordItem): string {
  return formatPastOutcomeLine(item);
}

function shouldShowFutureRowStatus(item: PickRecordItem): boolean {
  return item.status === "waiting_for_results";
}

function appendEventGroupTxt(
  lines: string[],
  group: ExportEventGroup,
  sectionKey: "future" | "past"
): void {
  lines.push(`${group.dateLabel} · ${group.sport}`);
  lines.push(group.eventName);
  lines.push("");

  for (const item of group.items) {
    lines.push(formatExportMatchupText(item));
    lines.push(`Pick: ${formatExportPickText(item)}`);

    if (sectionKey === "past") {
      lines.push(`Result: ${formatExportResultText(item)}`);
      lines.push(formatPastOutcomeLine(item));
    } else if (shouldShowFutureRowStatus(item)) {
      lines.push("Waiting for results");
    }

    lines.push("");
  }
}

function appendSectionTxt(
  lines: string[],
  section: PickRecordExportSection
): void {
  lines.push(section.title);
  lines.push(section.subtitle);
  lines.push("");

  for (const group of groupExportItemsByEvent(section.items)) {
    appendEventGroupTxt(lines, group, section.key);
  }
}

export function buildPickRecordExportText(
  items: PickRecordItem[],
  meta: PickRecordExportMeta
): string {
  const handle = meta.profile.username;
  const sections = buildPickRecordExportSections(items, meta.scope);
  const stats = buildExportSummaryStats(items);
  const chips = buildStatChipLabels(stats);

  const lines: string[] = [
    "PICKFIST PICK RECORD",
    `@${handle}`,
    `Generated: ${formatExportGeneratedAt(meta.generatedAt)}`,
    `Export type: ${scopeLabel(meta.scope).toUpperCase()}`,
    "",
    chips.join("   "),
    "",
  ];

  if (sections.length === 0) {
    lines.push("No picks in this export.");
    lines.push("");
  } else {
    for (const [index, section] of sections.entries()) {
      if (index > 0) lines.push("");
      appendSectionTxt(lines, section);
    }
  }

  lines.push("pickfist.com");
  lines.push("");

  return lines.join("\n");
}

export function pickRecordExportFilename(
  username: string,
  format: PickRecordExportFormat,
  generatedAt: string
): string {
  const date = generatedAt.slice(0, 10);
  return `pickfist-record-${username}-${date}.${format === "pdf" ? "pdf" : "txt"}`;
}

export function downloadPickRecordTxt(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function pastOutcomeColor(item: PickRecordItem): PdfRgb {
  if (item.status === "perfect") return PDF_COLORS.gold;
  if (item.status === "won") return PDF_COLORS.green;
  if (item.status === "lost") return PDF_COLORS.red;
  return PDF_COLORS.grey;
}

export async function downloadPickRecordPdf(
  items: PickRecordItem[],
  meta: PickRecordExportMeta,
  filename: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 44;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const drawText = (
    text: string,
    fontSize: number,
    options: {
      bold?: boolean;
      color?: PdfRgb;
      indent?: number;
      maxWidth?: number;
      lineGap?: number;
    } = {}
  ): void => {
    const {
      bold = false,
      color = PDF_COLORS.black,
      indent = 0,
      maxWidth = contentWidth - indent,
      lineGap = 1.35,
    } = options;

    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const wrapped = doc.splitTextToSize(text, maxWidth) as string[];
    for (const line of wrapped) {
      ensureSpace(fontSize * lineGap + 2);
      doc.text(line, margin + indent, y);
      y += fontSize * lineGap;
    }
    doc.setTextColor(0, 0, 0);
  };

  const drawRule = (gap = 10): void => {
    ensureSpace(gap + 2);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += gap;
  };

  const drawStatChips = (chips: string[]): void => {
    const chipHeight = 18;
    const chipGap = 8;
    const chipPadding = 10;
    let x = margin;

    ensureSpace(chipHeight + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    for (const chip of chips) {
      const chipWidth = doc.getTextWidth(chip) + chipPadding * 2;
      if (x + chipWidth > margin + contentWidth) {
        x = margin;
        y += chipHeight + chipGap;
        ensureSpace(chipHeight + 6);
      }

      doc.setFillColor(PDF_COLORS.chipFill[0], PDF_COLORS.chipFill[1], PDF_COLORS.chipFill[2]);
      doc.setDrawColor(
        PDF_COLORS.chipBorder[0],
        PDF_COLORS.chipBorder[1],
        PDF_COLORS.chipBorder[2]
      );
      doc.setLineWidth(0.75);
      doc.roundedRect(x, y - 11, chipWidth, chipHeight, 3, 3, "FD");
      doc.setTextColor(PDF_COLORS.darkGrey[0], PDF_COLORS.darkGrey[1], PDF_COLORS.darkGrey[2]);
      doc.text(chip, x + chipPadding, y + 1);
      x += chipWidth + chipGap;
    }

    doc.setTextColor(0, 0, 0);
    y += chipHeight + 4;
  };

  const drawSection = (section: PickRecordExportSection): void => {
    ensureSpace(40);
    drawText(section.title, 13, { bold: true, color: PDF_COLORS.brandRed });
    drawText(section.subtitle, 8, { color: PDF_COLORS.grey });
    y += 4;

    for (const group of groupExportItemsByEvent(section.items)) {
      ensureSpace(52);
      drawText(`${group.dateLabel} · ${group.sport}`, 9, {
        bold: true,
        color: PDF_COLORS.darkGrey,
      });
      drawText(group.eventName, 10, { bold: true, color: PDF_COLORS.black });
      y += 2;

      for (const item of group.items) {
        ensureSpace(48);
        drawText(formatExportMatchupText(item), 9, { bold: true });
        drawText(`Pick: ${formatExportPickText(item)}`, 9, {
          indent: 8,
          color: PDF_COLORS.darkGrey,
        });

        if (section.key === "past") {
          drawText(`Result: ${formatExportResultText(item)}`, 9, {
            indent: 8,
            color: PDF_COLORS.grey,
          });
          drawText(formatPastOutcomeLine(item), 9, {
            indent: 8,
            bold: true,
            color: pastOutcomeColor(item),
          });
        } else if (shouldShowFutureRowStatus(item)) {
          drawText("Waiting for results", 8, {
            indent: 8,
            color: PDF_COLORS.gold,
            bold: true,
          });
        }

        y += 6;
      }

      y += 4;
    }
  };

  const handle = meta.profile.username;
  const stats = buildExportSummaryStats(items);
  const sections = buildPickRecordExportSections(items, meta.scope);

  drawText("PICKFIST PICK RECORD", 18, { bold: true });
  drawText(`@${handle}`, 11, { bold: true });
  drawText(`Generated: ${formatExportGeneratedAt(meta.generatedAt)}`, 9, {
    color: PDF_COLORS.grey,
  });
  drawText(`Export type: ${scopeLabel(meta.scope).toUpperCase()}`, 9, {
    color: PDF_COLORS.grey,
  });
  y += 4;
  drawStatChips(buildStatChipLabels(stats));
  drawRule(12);

  if (sections.length === 0) {
    drawText("No picks in this export.", 9, { color: PDF_COLORS.grey });
  } else {
    for (const [index, section] of sections.entries()) {
      if (index > 0) {
        y += 6;
        drawRule(12);
      }
      drawSection(section);
    }
  }

  y += 4;
  drawRule(8);
  drawText("pickfist.com", 9, { color: PDF_COLORS.brandRed });

  doc.save(filename);
}
