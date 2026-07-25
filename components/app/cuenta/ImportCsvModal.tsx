"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { importCsvDoses, type AppData, type CsvImportRow } from "@/lib/app-data";

// Parser CSV mínimo (sin librerías): soporta comillas y comas dentro de
// campos entrecomillados, igual que el escape usado por handleExportCsv.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function normalizeHeader(h: string) {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function findColumn(headers: string[], candidates: string[]): number {
  return headers.findIndex((h) => candidates.some((c) => h.includes(c)));
}

function parseFlexibleDate(raw: string): string | null {
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

export function ImportCsvModal({
  open,
  onClose,
  data,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  data: AppData;
  onImported: () => Promise<void>;
}) {
  const t = useTranslations("Cuenta");
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<CsvImportRow[]>([]);
  const [parseError, setParseError] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; newPeptides: number; failed: number } | null>(null);

  function reset() {
    setFileName("");
    setRows([]);
    setParseError("");
    setResult(null);
  }

  async function handleFile(file: File) {
    reset();
    setFileName(file.name);
    const text = await file.text();
    const table = parseCsv(text);
    if (table.length < 2) {
      setParseError(t("importCsvErrorEmpty"));
      return;
    }
    const headers = table[0].map(normalizeHeader);
    const dateCol = findColumn(headers, ["fecha", "date"]);
    const timeCol = findColumn(headers, ["hora", "time"]);
    const peptideCol = findColumn(headers, ["peptido", "peptide", "medic"]);
    const amountCol = findColumn(headers, ["cantidad", "amount", "dosis", "dose"]);
    const unitCol = findColumn(headers, ["unidad", "unit"]);
    const doneCol = findColumn(headers, ["aplicada", "done", "taken"]);

    if (dateCol === -1 || peptideCol === -1 || amountCol === -1) {
      setParseError(t("importCsvErrorColumns"));
      return;
    }

    const parsed: CsvImportRow[] = [];
    for (const line of table.slice(1)) {
      const dateIso = parseFlexibleDate(line[dateCol] || "");
      const peptideName = (line[peptideCol] || "").trim();
      if (!dateIso || !peptideName) continue;
      parsed.push({
        peptideName,
        dateIso,
        time: timeCol >= 0 ? (line[timeCol] || "08:00").trim() : "08:00",
        amount: (line[amountCol] || "").trim(),
        unit: unitCol >= 0 ? (line[unitCol] || "mg").trim() : "mg",
        done: doneCol >= 0 ? /^(s[ií]|yes|true|1)$/i.test((line[doneCol] || "").trim()) : false,
      });
    }
    if (parsed.length === 0) {
      setParseError(t("importCsvErrorNoRows"));
      return;
    }
    setRows(parsed);
  }

  async function handleImport() {
    setImporting(true);
    try {
      const summary = await importCsvDoses(data, rows);
      setResult(summary);
      await onImported();
    } finally {
      setImporting(false);
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <ModalShell open={open} onClose={handleClose} title={t("importCsvTitle")} icon={<Upload className="size-5 text-primary" aria-hidden />}>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{t("importCsvDesc")}</p>

        {!result && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Upload className="size-4" aria-hidden /> {fileName || t("importCsvChooseFile")}
            </button>

            {parseError && <p className="text-xs text-destructive">{parseError}</p>}

            {rows.length > 0 && !parseError && (
              <p className="rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
                {t("importCsvPreview", { count: rows.length })}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={rows.length === 0 || importing}
                onClick={handleImport}
                className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {importing ? t("importing") : t("importCsvCta")}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
              >
                {t("cancel")}
              </button>
            </div>
          </>
        )}

        {result && (
          <>
            <p className="rounded-lg bg-accent px-3 py-3 text-sm text-accent-foreground">
              {t("importCsvResult", { imported: result.imported, newPeptides: result.newPeptides, failed: result.failed })}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            >
              {t("close")}
            </button>
          </>
        )}
      </div>
    </ModalShell>
  );
}
