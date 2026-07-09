"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { X, Plus } from "lucide-react";

const SOCIAL_NETWORKS = ["Instagram", "TikTok", "Telegram", "WhatsApp", "X (Twitter)", "Reddit", "Otra"];

export type ProviderDraft = {
  name: string;
  website: string;
  socialNetwork: string;
  socialHandle: string;
  phone: string;
  email: string;
  brands: string[];
  notes: string;
};

export function ProviderModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (draft: ProviderDraft) => Promise<void>;
}) {
  const t = useTranslations("Providers");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [socialNetwork, setSocialNetwork] = useState("Instagram");
  const [socialHandle, setSocialHandle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setWebsite("");
    setSocialNetwork("Instagram");
    setSocialHandle("");
    setPhone("");
    setEmail("");
    setBrands([]);
    setBrandInput("");
    setNotes("");
  }

  function addBrand() {
    const b = brandInput.trim();
    if (b && !brands.includes(b)) setBrands((prev) => [...prev, b]);
    setBrandInput("");
  }

  async function handleSave() {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), website, socialNetwork, socialHandle, phone, email, brands, notes });
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl sm:rounded-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
              <h2 className="font-display text-xl font-bold text-foreground">{t("modalTitle")}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <div>
                <label className={labelClass}>{t("name")}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("website")}</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." inputMode="url" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("social")}</label>
                <div className="flex gap-2">
                  <select
                    value={socialNetwork}
                    onChange={(e) => setSocialNetwork(e.target.value)}
                    className="h-11 w-36 shrink-0 rounded-lg border border-input bg-background px-2 text-base text-foreground"
                  >
                    {SOCIAL_NETWORKS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input value={socialHandle} onChange={(e) => setSocialHandle(e.target.value)} placeholder={t("socialPlaceholder")} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("phone")}</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+57 300 123 4567" inputMode="tel" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("email")}</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@proveedor.com" inputMode="email" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t("brands")}</label>
                <div className="flex gap-2">
                  <input
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBrand();
                      }
                    }}
                    placeholder={t("brandsPlaceholder")}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={addBrand}
                    className="flex h-11 shrink-0 items-center gap-1 rounded-lg bg-accent px-3 text-sm font-semibold text-primary"
                  >
                    <Plus className="size-4" aria-hidden /> {t("add")}
                  </button>
                </div>
                {brands.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {brands.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {b}
                        <button
                          type="button"
                          onClick={() => setBrands((prev) => prev.filter((x) => x !== b))}
                          aria-label={`Quitar ${b}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-3" aria-hidden />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>{t("notes")}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("notesPlaceholder")}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="flex shrink-0 gap-2 border-t border-border p-4">
              <button
                type="button"
                disabled={!name.trim() || saving}
                onClick={handleSave}
                className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {t("save")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
              >
                {t("cancel")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
