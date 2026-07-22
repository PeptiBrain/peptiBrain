"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Link2, Loader2 } from "lucide-react";
import { ADMIN } from "@/components/app/admin/AdminCharts";

export function IntegrationsPanel() {
  const [gaId, setGaId] = useState("");
  const [savedGaId, setSavedGaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : { settings: {} }))
      .then((d) => {
        const v = d.settings?.ga_measurement_id || "";
        setGaId(v);
        setSavedGaId(v);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveGa() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gaId: gaId.trim() }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setError(b.error === "invalid_ga_id" ? "Ese ID no tiene el formato correcto (debe ser G-XXXXXXXX)." : "No se pudo guardar.");
        return;
      }
      setSavedGaId(gaId.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  const card = { background: ADMIN.surface, border: `1px solid ${ADMIN.border}` };

  return (
    <div className="space-y-4">
      {/* Mixpanel — ya conectado */}
      <div className="flex items-center justify-between gap-3 rounded-2xl p-5" style={card}>
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: ADMIN.text }}>
            Mixpanel
          </p>
          <p className="text-xs" style={{ color: ADMIN.textMuted }}>
            Analítica de producto (qué hacen los usuarios dentro de la app).
          </p>
        </div>
        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: "rgba(52,211,153,0.12)", color: ADMIN.positive }}
        >
          <CheckCircle2 className="size-3.5" aria-hidden /> Conectado
        </span>
      </div>

      {/* Google Analytics — conectable pegando el ID */}
      <div className="rounded-2xl p-5" style={card}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: ADMIN.text }}>
              Google Analytics
            </p>
            <p className="text-xs" style={{ color: ADMIN.textMuted }}>
              Tráfico de tu web (de dónde viene la gente, páginas más vistas).
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={
              savedGaId
                ? { background: "rgba(52,211,153,0.12)", color: ADMIN.positive }
                : { background: ADMIN.bg, color: ADMIN.textMuted, border: `1px solid ${ADMIN.border}` }
            }
          >
            {savedGaId ? "Conectado" : "No conectado"}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={gaId}
            onChange={(e) => setGaId(e.target.value)}
            placeholder="Pega tu ID de medición (G-XXXXXXXX)"
            disabled={loading}
            className="h-11 flex-1 rounded-lg border px-3 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
            style={{ background: ADMIN.bg, borderColor: ADMIN.border, color: ADMIN.text }}
          />
          <button
            type="button"
            onClick={saveGa}
            disabled={saving || loading || gaId.trim() === savedGaId}
            className="flex h-11 items-center justify-center gap-1.5 rounded-lg px-5 text-sm font-semibold transition-transform active:scale-97 disabled:opacity-50"
            style={{ background: ADMIN.accent, color: "#04140F" }}
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {saved ? "Guardado ✓" : savedGaId && !gaId.trim() ? "Desconectar" : "Guardar"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs" style={{ color: ADMIN.negative }}>
            {error}
          </p>
        )}
        <p className="mt-3 text-xs" style={{ color: ADMIN.textMuted }}>
          El ID lo sacas de tu cuenta de Google Analytics (Administrar → Flujos de datos). Empieza por{" "}
          <code className="rounded px-1" style={{ background: ADMIN.bg }}>
            G-
          </code>
          . Solo se activa para quien acepte las cookies. Deja el campo vacío y guarda para desconectarlo.
        </p>
      </div>

      {/* Futuras integraciones */}
      <div className="rounded-2xl p-5" style={{ ...card, borderStyle: "dashed" }}>
        <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: ADMIN.text }}>
          <Link2 className="size-4" aria-hidden /> Más integraciones
        </p>
        <p className="mt-1 text-xs" style={{ color: ADMIN.textMuted }}>
          Próximamente: otras herramientas de analítica y de apps móviles (Firebase, Amplitude, Meta Pixel…). Cuando
          quieras conectar alguna, la sumamos aquí.
        </p>
      </div>
    </div>
  );
}
