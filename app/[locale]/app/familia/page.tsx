"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Users, Plus, Trash2, Download, Check, X, Eye, Lock, Camera, ChevronDown, Upload, Beaker } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  addFamilyMember,
  importFamilyMembers,
  leaveFamily,
  loadAppData,
  loadReceivedInvitations,
  removeFamilyMember,
  respondToInvitation,
  SeatLimitError,
  updateFamilySharedPeptides,
  updateFamilySharing,
  updateVialSplit,
  uploadFamilyPhoto,
  type AppData,
  type FamilyMember,
  type FamilyRelationship,
  type ReceivedInvitation,
} from "@/lib/app-data";
import { csvToFamilyRows } from "@/lib/csv";
import { loadOnboarding } from "@/lib/onboarding";
import { CURRENCY, type Locale } from "@/i18n/routing";
import { SharedDataModal } from "@/components/app/familia/SharedDataModal";

const COUNTRIES = [
  { flag: "🇪🇸", code: "+34" },
  { flag: "🇨🇴", code: "+57" },
  { flag: "🇲🇽", code: "+52" },
  { flag: "🇦🇷", code: "+54" },
  { flag: "🇵🇪", code: "+51" },
  { flag: "🇨🇱", code: "+56" },
  { flag: "🇪🇨", code: "+593" },
  { flag: "🇺🇸", code: "+1" },
];

const RELATIONSHIPS: FamilyRelationship[] = [
  "pareja",
  "hermano",
  "hijo",
  "padre_madre",
  "primo",
  "tio",
  "sobrino",
  "cunado",
  "amigo",
  "vecino",
  "otro",
];

export default function FamiliaPage() {
  const t = useTranslations("Familia");
  const [data, setData] = useState<AppData | null>(null);
  const [invitations, setInvitations] = useState<ReceivedInvitation[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+34");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState<FamilyRelationship>("otro");
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [viewingOwnerId, setViewingOwnerId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [peptidePickerOpenId, setPeptidePickerOpenId] = useState<string | null>(null);
  const [seatLimitId, setSeatLimitId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadAppData().then(setData);
    loadReceivedInvitations().then(setInvitations);
  }, []);

  if (!data) return null;

  const canShare = data.plan === "family";

  function selectedPeptideIds(memberId: string): Set<string> {
    const member = data!.familyMembers.find((m) => m.id === memberId);
    const restricted = member?.sharedPeptideIds;
    return new Set(restricted && restricted.length > 0 ? restricted : data!.peptides.map((p) => p.id));
  }

  async function togglePeptideForMember(memberId: string, peptideId: string) {
    const selected = selectedPeptideIds(memberId);
    if (selected.has(peptideId)) selected.delete(peptideId);
    else selected.add(peptideId);
    const allIds = data!.peptides.map((p) => p.id);
    const isAll = allIds.length > 0 && allIds.every((id) => selected.has(id));
    setData(await updateFamilySharedPeptides(data!, memberId, isAll ? null : Array.from(selected)));
  }

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
    if (!canShare || !name.trim() || !email.trim() || !data) return;
    const next = await addFamilyMember(data, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      phoneCode: phone.trim() ? phoneCode : undefined,
      relationship,
      sharePeptides: true,
      shareDoses: true,
      shareHealth: false,
    });
    setData(next);
    notifyInviteEmail(email.trim(), name.trim());
    setName("");
    setEmail("");
    setPhone("");
    setRelationship("otro");
    setShowForm(false);
  }

  function notifyInviteEmail(toEmail: string, toName: string) {
    fetch("/api/family/invite-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toEmail, toName, ownerName: loadOnboarding().name }),
    }).catch(() => {});
  }

  async function handleCsvFile(file: File) {
    if (!data || !canShare) return;
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const rows = csvToFamilyRows(text);
      const result = await importFamilyMembers(data, rows);
      setData(result.data);
      setImportResult({ imported: result.imported, skipped: result.skipped });
      for (const r of rows) notifyInviteEmail(r.email, r.name);
    } finally {
      setImporting(false);
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
  }

  async function handleRespond(id: string, status: "accepted" | "revoked") {
    setSeatLimitId(null);
    try {
      await respondToInvitation(id, status);
      setInvitations(await loadReceivedInvitations());
    } catch (err) {
      if (err instanceof SeatLimitError) {
        setSeatLimitId(id);
      } else {
        throw err;
      }
    }
  }

  async function handleLeave(id: string) {
    await leaveFamily(id);
    setInvitations(await loadReceivedInvitations());
    setData(await loadAppData());
  }

  async function handlePhoto(memberId: string, file: File) {
    if (!data) return;
    setUploadingId(memberId);
    try {
      setData(await uploadFamilyPhoto(data, memberId, file));
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {canShare && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => csvInputRef.current?.click()}
              disabled={importing}
              aria-label={t("importCsvAria")}
              className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition-transform active:scale-97 disabled:opacity-50"
            >
              <Upload className="size-3.5" aria-hidden /> {importing ? t("importing") : t("importCsv")}
            </button>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCsvFile(file);
              }}
            />
            <button
              type="button"
              onClick={() => setShowForm((s) => !s)}
              aria-label={t("inviteAria")}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
            >
              <Plus className="size-5" aria-hidden />
            </button>
          </div>
        )}
      </div>

      {importResult && (
        <div className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-foreground">
          {t("importResult", { imported: importResult.imported, skipped: importResult.skipped })}
        </div>
      )}

      {!canShare && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-secondary/40 p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5 shrink-0" aria-hidden /> {t("planRequired")}
          </p>
          <Link href="/paywall" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            {t("planRequiredCta")}
          </Link>
        </div>
      )}

      {canShare && showForm && (
        <div className="mt-4 space-y-3 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
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
              <p className="mt-1 text-[11px] text-muted-foreground">{t("emailWhyNote")}</p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("phoneLabel")}</label>
            <div className="flex gap-2">
              <select
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="h-11 w-24 shrink-0 rounded-lg border border-input bg-background px-2 text-base text-foreground"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder={t("phonePlaceholder")}
                className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="sm:max-w-xs">
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("relationshipLabel")}</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {t(`relationship_${r}`)}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">{t("inviteNote")}</p>
          <button
            type="button"
            disabled={!name.trim() || !email.trim()}
            onClick={handleInvite}
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {t("sendInvite")}
          </button>
        </div>
      )}

      {invitations && invitations.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-foreground">{t("sharedWithMeTitle")}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {invitations.map((inv) => (
              <div key={inv.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{inv.ownerName}</p>
                  {inv.inviteStatus === "pending" && (
                    <span className="shrink-0 rounded-full bg-[var(--notice-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--notice-icon)]">
                      {t("statusPending")}
                    </span>
                  )}
                </div>
                {inv.inviteStatus === "pending" && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRespond(inv.id, "accepted")}
                      className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground"
                    >
                      <Check className="size-3.5" aria-hidden /> {t("acceptInvite")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRespond(inv.id, "revoked")}
                      className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground"
                    >
                      <X className="size-3.5" aria-hidden /> {t("declineInvite")}
                    </button>
                  </div>
                )}
                {seatLimitId === inv.id && (
                  <p className="mt-2 text-xs text-destructive">{t("seatLimitReached")}</p>
                )}
                {inv.inviteStatus === "accepted" && (
                  <div className="mt-2 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setViewingOwnerId(inv.ownerId)}
                      className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                    >
                      <Eye className="size-3.5" aria-hidden /> {t("viewSharedData")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLeave(inv.id)}
                      className="flex h-8 w-full items-center justify-center text-xs font-medium text-muted-foreground hover:text-destructive"
                    >
                      {t("leaveFamily")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.familyMembers.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-card/60 p-10 text-center">
          <Users className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">{t("emptyState")}</p>
          {canShare && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mx-auto mt-4 flex h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              <Plus className="size-4" aria-hidden /> {t("addFamilyCta")}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.familyMembers.map((member) => (
            <div key={member.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="relative shrink-0">
                    <div className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-accent">
                      {member.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.photoUrl} alt="" className="size-full object-cover" />
                      ) : (
                        <span className="font-display text-base font-bold text-primary">
                          {member.name.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRefs.current[member.id]?.click()}
                      disabled={uploadingId === member.id}
                      aria-label={t("changePhotoAria", { name: member.name })}
                      className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card disabled:opacity-50"
                    >
                      <Camera className="size-2.5" aria-hidden />
                    </button>
                    <input
                      ref={(el) => {
                        fileRefs.current[member.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhoto(member.id, file);
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.relationship ? t(`relationship_${member.relationship}`) : member.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmRemoveId(member.id)}
                  aria-label={t("removeAria", { name: member.name })}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>

              {member.phone && (
                <div className="mt-2 flex gap-2">
                  <a
                    href={`https://wa.me/${(member.phoneCode || "").replace("+", "")}${member.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-secondary text-xs font-medium text-foreground hover:bg-accent"
                  >
                    {t("contactWhatsApp")}
                  </a>
                  <a
                    href={`tel:${member.phoneCode || ""}${member.phone}`}
                    className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-secondary text-xs font-medium text-foreground hover:bg-accent"
                  >
                    {t("contactCall")}
                  </a>
                </div>
              )}

              {confirmRemoveId === member.id && (
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
                  <p className="text-xs text-foreground">{t("confirmRemove", { name: member.name })}</p>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfirmRemoveId(null)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary"
                    >
                      {t("cancelRemove")}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setData(await removeFamilyMember(data, member.id));
                        setConfirmRemoveId(null);
                      }}
                      className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
                    >
                      {t("confirmRemoveCta")}
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("sharingTitle")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["sharePeptides", "sharingPeptides"],
                    ["shareDoses", "sharingDoses"],
                    ["shareHealth", "sharingHealth"],
                  ] as const
                ).map(([key, labelKey]) => {
                  const active = member[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={async () =>
                        setData(
                          await updateFamilySharing(data, member.id, {
                            sharePeptides: member.sharePeptides,
                            shareDoses: member.shareDoses,
                            shareHealth: member.shareHealth,
                            [key]: !active,
                          })
                        )
                      }
                      className={`h-8 rounded-full px-3 text-xs font-medium transition-colors ${
                        active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {t(labelKey)}
                    </button>
                  );
                })}
              </div>

              {member.sharePeptides && data.peptides.length > 0 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPeptidePickerOpenId((id) => (id === member.id ? null : member.id))
                    }
                    className="flex items-center gap-1 text-xs font-medium text-primary"
                  >
                    <ChevronDown
                      className={`size-3.5 transition-transform ${
                        peptidePickerOpenId === member.id ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                    {t("choosePeptidesToggle")}
                  </button>
                  {peptidePickerOpenId === member.id && (
                    <div className="mt-2 space-y-1.5 rounded-lg border border-border bg-secondary/30 p-2.5">
                      {data.peptides.map((p) => {
                        const checked = selectedPeptideIds(member.id).has(p.id);
                        return (
                          <label key={p.id} className="flex items-center gap-2 text-xs text-foreground">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePeptideForMember(member.id, p.id)}
                            />
                            {p.name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <MemberVialShare member={member} data={data} onChange={setData} t={t} />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleExport}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary sm:w-auto sm:px-6"
      >
        <Download className="size-4" aria-hidden /> {t("exportData")}
      </button>

      <SharedDataModal
        open={viewingOwnerId !== null}
        onClose={() => setViewingOwnerId(null)}
        ownerId={viewingOwnerId}
      />
    </div>
  );
}

function MemberVialShare({
  member,
  data,
  onChange,
  t,
}: {
  member: FamilyMember;
  data: AppData;
  onChange: (next: AppData) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const locale = useLocale() as Locale;
  const symbol = CURRENCY[locale].symbol;
  const [adding, setAdding] = useState(false);
  const [vialId, setVialId] = useState("");
  const [pct, setPct] = useState(50);

  const sharedVials = data.vials.filter((v) => v.sharedWithMemberId === member.id);
  const availableVials = data.vials.filter((v) => !v.sharedWithMemberId);

  async function save() {
    if (!vialId) return;
    const next = await updateVialSplit(data, vialId, { sharedWithMemberId: member.id, splitPercent: pct });
    onChange(next);
    setAdding(false);
    setVialId("");
    setPct(50);
  }

  async function unshare(vId: string) {
    const next = await updateVialSplit(data, vId, { sharedWithMemberId: null, splitPercent: null });
    onChange(next);
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {t("sharedVialsTitle")}
      </p>
      {sharedVials.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {sharedVials.map((v) => {
            const peptide = data.peptides.find((p) => p.id === v.peptideId);
            const mine = v.splitPercent ?? 50;
            return (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-2.5 py-1.5 text-xs">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Beaker className="size-3.5 text-primary" aria-hidden /> {peptide?.name || "—"}
                  <span className="text-muted-foreground">
                    ({mine}% / {100 - mine}%{v.cost ? ` · ${symbol}${((parseFloat(v.cost) * (100 - mine)) / 100).toFixed(0)}` : ""})
                  </span>
                </span>
                <button type="button" onClick={() => unshare(v.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {adding ? (
        <div className="rounded-lg border border-dashed border-border p-2.5">
          <select
            value={vialId}
            onChange={(e) => setVialId(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-2 text-xs text-foreground"
          >
            <option value="">{t("chooseVial")}</option>
            {availableVials.map((v) => {
              const peptide = data.peptides.find((p) => p.id === v.peptideId);
              return (
                <option key={v.id} value={v.id}>
                  {peptide?.name || "—"} ({v.amount} {v.unit})
                </option>
              );
            })}
          </select>
          {vialId && (
            <div className="mt-2">
              <p className="mb-1 text-xs text-muted-foreground">{t("splitLabel", { mine: pct, theirs: 100 - pct })}</p>
              <input type="range" min={1} max={99} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full" />
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="h-8 flex-1 rounded-lg border border-border text-xs font-medium text-foreground">
              {t("cancelRemove")}
            </button>
            <button type="button" disabled={!vialId} onClick={save} className="h-8 flex-1 rounded-lg bg-primary text-xs font-semibold text-primary-foreground disabled:opacity-50">
              {t("saveShare")}
            </button>
          </div>
        </div>
      ) : availableVials.length > 0 ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground"
        >
          <Beaker className="size-3.5" aria-hidden /> {t("shareVialFromHere")}
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">{t("noVialsToShare")}</p>
      )}
    </div>
  );
}
