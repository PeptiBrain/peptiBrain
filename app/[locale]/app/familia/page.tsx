"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Users, Plus, Trash2, Download, Check, X, Eye, Lock, Camera } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  addFamilyMember,
  loadAppData,
  loadReceivedInvitations,
  removeFamilyMember,
  respondToInvitation,
  updateFamilySharing,
  uploadFamilyPhoto,
  type AppData,
  type FamilyRelationship,
  type ReceivedInvitation,
} from "@/lib/app-data";
import { SharedDataModal } from "@/components/app/familia/SharedDataModal";

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
  const [relationship, setRelationship] = useState<FamilyRelationship>("otro");
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [viewingOwnerId, setViewingOwnerId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadAppData().then(setData);
    loadReceivedInvitations().then(setInvitations);
  }, []);

  if (!data) return null;

  const canShare = data.plan === "family";

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
      relationship,
      sharePeptides: true,
      shareDoses: true,
      shareHealth: false,
    });
    setData(next);
    setName("");
    setEmail("");
    setRelationship("otro");
    setShowForm(false);
  }

  async function handleRespond(id: string, status: "accepted" | "revoked") {
    await respondToInvitation(id, status);
    setInvitations(await loadReceivedInvitations());
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
    <div className="mx-auto max-w-sm px-4 py-5">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {canShare && (
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            aria-label={t("inviteAria")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-5" aria-hidden />
          </button>
        )}
      </div>

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
          <div>
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
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("sendInvite")}
          </button>
        </div>
      )}

      {invitations && invitations.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-foreground">{t("sharedWithMeTitle")}</p>
          <div className="space-y-2">
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
                {inv.inviteStatus === "accepted" && (
                  <button
                    type="button"
                    onClick={() => setViewingOwnerId(inv.ownerId)}
                    className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                  >
                    <Eye className="size-3.5" aria-hidden /> {t("viewSharedData")}
                  </button>
                )}
              </div>
            ))}
          </div>
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

      <SharedDataModal
        open={viewingOwnerId !== null}
        onClose={() => setViewingOwnerId(null)}
        ownerId={viewingOwnerId}
      />
    </div>
  );
}
