"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Package } from "lucide-react";
import { addPeptide, loadAppData, type AppData } from "@/lib/app-data";
import { PeptideCard } from "@/components/app/peptidos/PeptideCard";

const ROUTES = ["Subcutánea", "Intramuscular", "Oral", "Nasal"];

export default function PeptidosPage() {
  const t = useTranslations("Peptidos");
  const [data, setData] = useState<AppData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [route, setRoute] = useState("Subcutánea");

  useEffect(() => {
    setData(loadAppData());
  }, []);

  if (!data) return null;

  function handleAdd() {
    if (!name.trim() || !data) return;
    const next = addPeptide(data, { name: name.trim(), route, typicalDose: "", typicalUnit: "mg" });
    setData(next);
    setName("");
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          aria-label={t("addPeptideAria")}
          className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
        >
          <Plus className="size-5" aria-hidden />
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {t("peptideNameLabel")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("peptideNamePlaceholder")}
            className="mb-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {t("routeLabel")}
          </label>
          <div className="mb-3 grid grid-cols-2 gap-2">
            {ROUTES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoute(r)}
                className={`h-10 rounded-lg border text-sm font-medium ${
                  route === r
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleAdd}
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("savePeptide")}
          </button>
        </div>
      )}

      {data.peptides.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <Package className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.peptides.map((p) => (
            <PeptideCard key={p.id} peptide={p} data={data} onChange={setData} />
          ))}
        </div>
      )}
    </div>
  );
}
