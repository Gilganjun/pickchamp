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

const TXT_WIDTH = 78;

type PdfRgb = [number, number, number];

const PDF_COLORS = {
  blue: [37, 99, 235] as PdfRgb,
  green: [22, 163, 74] as PdfRgb,
  red: [220, 38, 38] as PdfRgb,
  grey: [100, 100, 100] as PdfRgb,
  headerFuture: [30, 64, 110] as PdfRgb,
  headerPast: [22, 101, 52] as PdfRgb,
  black: [20, 20, 20] as PdfRgb,
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
  const pending = items.filter((item) => item.status === "pending").length;
  const waiting = items.filter(
    (item) => item.status === "waiting_for_results"
  ).length;
  return `${items.length} pick(s) · ${pending} pending · ${waiting} awaiting results`;
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

function formatExportPickText(item: PickRecordItem): string {
  return formatCompactPickLine(item).replace(/^Pick: /, "");
}

function formatExportResultText(item: PickRecordItem): string {
  const line = formatCompactResultLine(item);
  return line ? line.replace(/^Result: /, "") : "—";
}

function formatExportStatusText(item: PickRecordItem): string {
  return getPickRecordStatusLabel(item.status).toUpperCase();
}

export function formatExportOutcomeText(item: PickRecordItem): string {
  const change = item.prediction.rating_change;
  if (item.bucket === "past" && change != null) {
    const prefix = change >= 0 ? "+" : "";
    if (item.status === "perfect") return `PERFECT ${prefix}${change}`;
    if (item.status === "won") return `WON ${prefix}${change}`;
    if (item.status === "lost") return `LOST ${prefix}${change}`;
  }
  return formatExportStatusText(item);
}

function formatExportEventText(item: PickRecordItem): string {
  return `${item.fight.sport.toUpperCase()} · ${item.fight.event.name}`;
}

function formatExportMatchupText(item: PickRecordItem): string {
  return `${item.fight.fighter_a_name} vs ${item.fight.fighter_b_name}`;
}

function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  if (max <= 1) return text.slice(0, max);
  return `${text.slice(0, max - 1)}…`;
}

function padCell(text: string, width: number): string {
  const clipped = truncateText(text, width);
  return clipped.padEnd(width);
}

function buildStatRowText(stats: ExportSummaryStats): string {
  return `Total picks: ${stats.total}  |  Future: ${stats.future}  |  Past: ${stats.past}  |  Accuracy: ${stats.accuracy}`;
}

function appendFutureTableTxt(lines: string[], items: PickRecordItem[]): void {
  const cols = [
    { label: "DATE", width: 10 },
    { label: "EVENT", width: 22 },
    { label: "MATCHUP", width: 24 },
    { label: "YOUR PICK", width: 22 },
    { label: "STATUS", width: 12 },
  ] as const;

  lines.push(cols.map((col) => padCell(col.label, col.width)).join(" "));
  lines.push("─".repeat(TXT_WIDTH));

  for (const item of items) {
    const cells = [
      padCell(formatEventDateShort(item.fight), cols[0].width),
      padCell(formatExportEventText(item), cols[1].width),
      padCell(formatExportMatchupText(item), cols[2].width),
      padCell(formatExportPickText(item), cols[3].width),
      padCell(formatExportStatusText(item), cols[4].width),
    ];
    lines.push(cells.join(" "));
  }
}

function appendPastTableTxt(lines: string[], items: PickRecordItem[]): void {
  const cols = [
    { label: "DATE", width: 10 },
    { label: "MATCHUP", width: 26 },
    { label: "PICK", width: 20 },
    { label: "RESULT", width: 24 },
    { label: "OUTCOME", width: 14 },
  ] as const;

  lines.push(cols.map((col) => padCell(col.label, col.width)).join(" "));
  lines.push("─".repeat(TXT_WIDTH));

  for (const item of items) {
    const cells = [
      padCell(formatEventDateShort(item.fight), cols[0].width),
      padCell(formatExportMatchupText(item), cols[1].width),
      padCell(formatExportPickText(item), cols[2].width),
      padCell(formatExportResultText(item), cols[3].width),
      padCell(formatExportOutcomeText(item), cols[4].width),
    ];
    lines.push(cells.join(" "));
  }
}

function appendSectionTxt(
  lines: string[],
  section: PickRecordExportSection
): void {
  lines.push(section.title);
  lines.push(section.subtitle);
  lines.push("");

  if (section.key === "future") {
    appendFutureTableTxt(lines, section.items);
  } else {
    appendPastTableTxt(lines, section.items);
  }
}

export function buildPickRecordExportText(
  items: PickRecordItem[],
  meta: PickRecordExportMeta
): string {
  const handle = meta.profile.username;
  const displayName = meta.profile.display_name?.trim();
  const userLine = displayName ? `${displayName} (@${handle})` : `@${handle}`;
  const sections = buildPickRecordExportSections(items, meta.scope);
  const stats = buildExportSummaryStats(items);

  const lines: string[] = [
    "PICKFIST PICK RECORD",
    userLine,
    `Generated: ${formatExportGeneratedAt(meta.generatedAt)}`,
    `Export type: ${scopeLabel(meta.scope).toUpperCase()}`,
    "",
    buildStatRowText(stats),
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

  lines.push("");
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

function outcomeColor(item: PickRecordItem): PdfRgb {
  if (item.status === "won" || item.status === "perfect") return PDF_COLORS.green;
  if (item.status === "lost") return PDF_COLORS.red;
  if (
    item.status === "pending" ||
    item.status === "waiting_for_results"
  ) {
    return PDF_COLORS.blue;
  }
  return PDF_COLORS.grey;
}

interface PdfTableColumn {
  label: string;
  width: number;
  getText: (item: PickRecordItem) => string;
  getColor?: (item: PickRecordItem) => PdfRgb;
}

function drawPdfHeader(
  doc: import("jspdf").jsPDF,
  y: number,
  margin: number,
  pageWidth: number,
  text: string,
  fontSize: number,
  bold = false,
  color: PdfRgb = PDF_COLORS.black,
  align: "left" | "right" = "left"
): number {
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(color[0], color[1], color[2]);
  const x = align === "right" ? pageWidth - margin : margin;
  doc.text(text, x, y, { align });
  doc.setTextColor(0, 0, 0);
  return y + fontSize * 1.35;
}

function drawPdfRule(
  doc: import("jspdf").jsPDF,
  y: number,
  margin: number,
  pageWidth: number
): number {
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  return y + 10;
}

export async function downloadPickRecordPdf(
  items: PickRecordItem[],
  meta: PickRecordExportMeta,
  filename: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
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

  const drawCellText = (
    text: string,
    x: number,
    cellY: number,
    width: number,
    fontSize: number,
    color: PdfRgb,
    bold = false
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const clipped = doc.splitTextToSize(text, width - 4) as string[];
    doc.text(clipped[0] ?? "", x + 2, cellY);
    doc.setTextColor(0, 0, 0);
  };

  const drawTable = (
    sectionKey: "future" | "past",
    title: string,
    subtitle: string,
    columns: PdfTableColumn[],
    rows: PickRecordItem[]
  ) => {
    const headerColor =
      sectionKey === "future" ? PDF_COLORS.headerFuture : PDF_COLORS.headerPast;
    const titleColor =
      sectionKey === "future" ? PDF_COLORS.blue : PDF_COLORS.green;
    const rowHeight = 22;
    const headerHeight = 20;
    const fontSize = 8;

    ensureSpace(56);
    y = drawPdfHeader(doc, y, margin, pageWidth, title, 14, true, titleColor);
    y = drawPdfHeader(doc, y, margin, pageWidth, subtitle, 8, false, PDF_COLORS.grey);
    y += 4;

    ensureSpace(headerHeight + 8);
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(margin, y - 12, contentWidth, headerHeight, "F");

    let x = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    for (const column of columns) {
      doc.text(column.label, x + 2, y);
      x += column.width;
    }
    doc.setTextColor(0, 0, 0);
    y += 10;

    for (const item of rows) {
      ensureSpace(rowHeight + 4);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, y + rowHeight - 8, margin + contentWidth, y + rowHeight - 8);

      x = margin;
      const cellY = y + 4;
      for (const column of columns) {
        const color = column.getColor?.(item) ?? PDF_COLORS.black;
        drawCellText(
          column.getText(item),
          x,
          cellY,
          column.width,
          fontSize,
          color
        );
        x += column.width;
      }
      y += rowHeight;
    }

    y += 8;
  };

  const handle = meta.profile.username;
  const displayName = meta.profile.display_name?.trim();
  const userLine = displayName ? `${displayName} (@${handle})` : `@${handle}`;
  const stats = buildExportSummaryStats(items);
  const sections = buildPickRecordExportSections(items, meta.scope);

  y = drawPdfHeader(doc, y, margin, pageWidth, "PICKFIST PICK RECORD", 18, true);
  y = drawPdfHeader(doc, y, margin, pageWidth, userLine, 10, false);
  y = drawPdfHeader(
    doc,
    y,
    margin,
    pageWidth,
    `Generated: ${formatExportGeneratedAt(meta.generatedAt)}`,
    9,
    false,
    PDF_COLORS.grey
  );
  y = drawPdfHeader(
    doc,
    y,
    margin,
    pageWidth,
    `Export type: ${scopeLabel(meta.scope).toUpperCase()}`,
    9,
    false,
    PDF_COLORS.grey
  );
  y += 2;
  y = drawPdfHeader(
    doc,
    y,
    margin,
    pageWidth,
    buildStatRowText(stats),
    9,
    true,
    PDF_COLORS.black
  );
  y = drawPdfRule(doc, y, margin, pageWidth);

  if (sections.length === 0) {
    y = drawPdfHeader(doc, y, margin, pageWidth, "No picks in this export.", 9, false, PDF_COLORS.grey);
  }

  for (const section of sections) {
    if (section.key === "future") {
      drawTable(section.key, section.title, section.subtitle, [
        {
          label: "DATE",
          width: 42,
          getText: (item) => formatEventDateShort(item.fight),
        },
        {
          label: "EVENT",
          width: 118,
          getText: (item) => formatExportEventText(item),
          getColor: () => PDF_COLORS.blue,
        },
        {
          label: "MATCHUP",
          width: 128,
          getText: (item) => formatExportMatchupText(item),
        },
        {
          label: "YOUR PICK",
          width: 128,
          getText: (item) => formatExportPickText(item),
          getColor: () => PDF_COLORS.blue,
        },
        {
          label: "STATUS",
          width: 74,
          getText: (item) => formatExportStatusText(item),
          getColor: (item) => outcomeColor(item),
        },
      ], section.items);
    } else {
      drawTable(section.key, section.title, section.subtitle, [
        {
          label: "DATE",
          width: 42,
          getText: (item) => formatEventDateShort(item.fight),
        },
        {
          label: "MATCHUP",
          width: 138,
          getText: (item) => formatExportMatchupText(item),
        },
        {
          label: "PICK",
          width: 108,
          getText: (item) => formatExportPickText(item),
          getColor: (item) => outcomeColor(item),
        },
        {
          label: "RESULT",
          width: 128,
          getText: (item) => formatExportResultText(item),
          getColor: (item) => outcomeColor(item),
        },
        {
          label: "OUTCOME",
          width: 74,
          getText: (item) => formatExportOutcomeText(item),
          getColor: (item) => outcomeColor(item),
        },
      ], section.items);
    }
  }

  y += 4;
  y = drawPdfRule(doc, y, margin, pageWidth);
  drawPdfHeader(doc, y, margin, pageWidth, "pickfist.com", 9, false, PDF_COLORS.blue);

  doc.save(filename);
}
