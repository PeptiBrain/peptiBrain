// Parser de CSV sencillo: soporta comillas, comas dentro de comillas, y \r\n.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const clean = text.replace(/^﻿/, "");

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && clean[i + 1] === "\n") i++;
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
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export type ImportedRow = {
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
};

// Reconoce columnas por nombre (en español o inglés), sin importar el orden.
export function csvToFamilyRows(text: string): ImportedRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const header = rows[0].map(normalizeHeader);
  const idx = {
    name: header.findIndex((h) => ["nombre", "name"].includes(h)),
    email: header.findIndex((h) => ["correo", "email", "correo electronico"].includes(h)),
    phone: header.findIndex((h) => ["telefono", "whatsapp", "phone"].includes(h)),
    relationship: header.findIndex((h) => ["relacion", "relationship"].includes(h)),
  };
  if (idx.name === -1 || idx.email === -1) return [];

  return rows
    .slice(1)
    .map((r) => ({
      name: (r[idx.name] || "").trim(),
      email: (r[idx.email] || "").trim(),
      phone: idx.phone !== -1 ? (r[idx.phone] || "").trim() || undefined : undefined,
      relationship: idx.relationship !== -1 ? (r[idx.relationship] || "").trim() || undefined : undefined,
    }))
    .filter((r) => r.name && r.email && r.email.includes("@"));
}
