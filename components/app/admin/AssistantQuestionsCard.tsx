"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageCircleQuestion } from "lucide-react";
import { ADMIN } from "@/components/app/admin/AdminCharts";

type Question = { id: string; question: string; plan: string | null; created_at: string };
type Data = { recent: Question[]; total: number; week: number };

// Qué le pregunta la gente al Asistente IA — para que el dueño sepa qué duda tiene su
// audiencia y decida qué contenido/features crear. Solo lectura, datos reales.
export function AssistantQuestionsCard() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/questions")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const card = { background: ADMIN.surface, border: `1px solid ${ADMIN.border}` };

  return (
    <div className="mt-4 rounded-2xl p-5" style={card}>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
        <MessageCircleQuestion className="size-3.5" aria-hidden /> Qué pregunta la gente al Asistente IA
      </p>

      {loading ? (
        <p className="mt-2 flex items-center gap-2 text-sm" style={{ color: ADMIN.textMuted }}>
          <Loader2 className="size-4 animate-spin" aria-hidden /> Cargando…
        </p>
      ) : !data || data.total === 0 ? (
        <p className="mt-2 text-sm" style={{ color: ADMIN.textMuted }}>
          Todavía nadie ha usado el asistente. Cuando lo hagan, verás aquí sus preguntas para saber qué contenido crear.
        </p>
      ) : (
        <>
          <div className="mb-3 flex gap-4">
            <span className="text-sm" style={{ color: ADMIN.text }}>
              <span className="font-bold tabular-nums">{data.total}</span>{" "}
              <span style={{ color: ADMIN.textMuted }}>en total</span>
            </span>
            <span className="text-sm" style={{ color: ADMIN.text }}>
              <span className="font-bold tabular-nums" style={{ color: ADMIN.positive }}>
                {data.week}
              </span>{" "}
              <span style={{ color: ADMIN.textMuted }}>últimos 7 días</span>
            </span>
          </div>
          <ul className="space-y-1.5">
            {data.recent.map((q) => (
              <li
                key={q.id}
                className="rounded-lg px-3 py-2 text-sm"
                style={{ background: "rgba(255,255,255,0.03)", color: ADMIN.text }}
              >
                <span className="line-clamp-2">{q.question}</span>
                <span className="mt-0.5 block text-[11px]" style={{ color: ADMIN.textMuted }}>
                  {new Date(q.created_at).toLocaleDateString("es", { day: "numeric", month: "short" })}
                  {q.plan && q.plan !== "free" ? " · Premium" : ""}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
