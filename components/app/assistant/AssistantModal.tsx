"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Send } from "lucide-react";
import { ModalShell } from "@/components/app/shell/ModalShell";
import type { AppData } from "@/lib/app-data";

type ChatMessage = { role: "user" | "assistant"; text: string };

function buildContext(data: AppData): string {
  const parts: string[] = [];
  if (data.peptides.length) {
    parts.push(`Péptidos: ${data.peptides.map((p) => p.name).join(", ")}`);
  }
  const pendingDoses = data.doses.filter((d) => !d.done).slice(0, 3);
  if (pendingDoses.length) {
    parts.push(`Próximas dosis: ${pendingDoses.map((d) => `${d.amount}${d.unit} (${d.when})`).join("; ")}`);
  }
  const lastWeight = data.healthLogs.find((h) => h.weightKg);
  if (lastWeight) parts.push(`Último peso registrado: ${lastWeight.weightKg} kg (${lastWeight.date})`);
  const recentSideEffects = data.healthLogs.filter((h) => h.sideEffect).slice(0, 3);
  if (recentSideEffects.length) {
    parts.push(`Efectos secundarios recientes: ${recentSideEffects.map((h) => h.sideEffect).join("; ")}`);
  }
  return parts.join("\n");
}

export function AssistantModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: AppData;
}) {
  const t = useTranslations("Assistant");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setErrorKey(null);
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context: buildContext(data) }),
      });
      const body = await res.json();
      if (!res.ok) {
        setErrorKey(
          body.error === "daily_limit_reached"
            ? "limitReached"
            : body.error === "service_paused"
              ? "servicePaused"
              : "genericError"
        );
        return;
      }
      setMessages((m) => [...m, { role: "assistant", text: body.reply }]);
    } catch {
      setErrorKey("genericError");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("title")}
      icon={<Sparkles className="size-5 text-primary" aria-hidden />}
    >
      <p className="mb-3 text-xs text-muted-foreground">{t("disclaimer")}</p>

      <div className="mb-3 max-h-72 min-h-32 space-y-2 overflow-y-auto rounded-lg border border-border bg-secondary/30 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-card text-foreground"
              }`}
            >
              {m.text}
            </div>
          ))
        )}
        {loading && <p className="text-xs text-muted-foreground">{t("thinking")}</p>}
      </div>

      {errorKey && (
        <p className="mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{t(errorKey)}</p>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={t("inputPlaceholder")}
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          aria-label={t("send")}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="size-4" aria-hidden />
        </button>
      </div>
    </ModalShell>
  );
}
