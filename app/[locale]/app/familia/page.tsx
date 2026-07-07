"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Users, Plus, Trash2, Download } from "lucide-react";
import {
  addFamilyMember,
  loadAppData,
  removeFamilyMember,
  updateFamilyVisibility,
  type AppData,
} from "@/lib/app-data";

export default function FamiliaPage() {
  const t = useTranslations("Familia");
  const [data, setData] = useState<AppData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  if (!data) return null;

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "peptibrain-datos.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleInvite() {
    if (!name.trim() || !email.trim() || !data) return;
    const next = await addFamilyMember(data, { name: name.trim(), email: email.trim(), visibility: "resumen" });
    setData(next);
    setName("");
    setEmail("");
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-5">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          aria-label={t("inviteAria")}
          className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
        >
          <Plus className="size-5" aria-hidden />
        </button>
      </div>

      {showForm && (
        <div className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("nameLabel")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("emailLabel")}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t("emailPlaceholder")}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("inviteNote")}</p>
          <button
            type="button"
            disabled={!name.trim() || !email.trim()}
            onClick={handleInvite}
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("sendInvite")}
          </button>
        </div>
      )}

      {data.familyMembers.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
          <Users className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {data.familyMembers.map((member) => (
            <div key={member.id} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(t("confirmRemove", { name: member.name }))) {
                      setData(await removeFamilyMember(data, member.id));
                    }
                  }}
                  aria-label={t("removeAria", { name: member.name })}
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={async () => setData(await updateFamilyVisibility(data, member.id, "resumen"))}
                  className={`h-8 flex-1 rounded-full text-xs font-medium ${
                    member.visibility === "resumen"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {t("viewSummary")}
                </button>
                <button
                  type="button"
                  onClick={async () => setData(await updateFamilyVisibility(data, member.id, "completo"))}
                  className={`h-8 flex-1 rounded-full text-xs font-medium ${
                    member.visibility === "completo"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {t("viewFull")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleExport}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
      >
        <Download className="size-4" aria-hidden /> {t("exportData")}
      </button>
    </div>
  );
}
