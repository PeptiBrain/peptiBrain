"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Link2, Loader2 } from "lucide-react";
import { ADMIN } from "@/components/app/admin/AdminCharts";

// Un ajuste de integración editable (GA, Clarity…). Guarda mandando { [field]: value }
// al endpoint admin; muestra estado Conectado/No conectado y errores en simple.
function IdSetting({
  title,
  description,
  placeholder,
  help,
  field,
  initial,
  invalidError,
}: {
  title: string;
  description: string;
  placeholder: string;
  help: React.ReactNode;
  field: "gaId" | "clarityId";
  initial: string;
  invalidError: string;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value.trim() }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setError(b.error?.startsWith("invalid_") ? invalidError : "No se pudo guardar.");
        return;
      }
      setSaved(value.trim());
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch {
      setError("No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  const card = { background: ADMIN.surface, border: `1px solid ${ADMIN.border}` };

  return (
    <div className="rounded-2xl p-5" style={card}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: ADMIN.text }}>
            {title}
          </p>
          <p className="text-xs" style={{ color: ADMIN.textMuted }}>
            {description}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={
            saved
              ? { background: "rgba(52,211,153,0.12)", color: ADMIN.positive }
              : { background: ADMIN.bg, color: ADMIN.textMuted, border: `1px solid ${ADMIN.border}` }
          }
        >
          {saved ? "Conectado" : "No conectado"}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-11 flex-1 rounded-lg border px-3 text-sm outline-none focus-visible:ring-2"
          style={{ background: ADMIN.bg, borderColor: ADMIN.border, color: ADMIN.text }}
        />
        <button
          type="button"
          onClick={save}
          disabled={saving || value.trim() === saved}
          className="flex h-11 items-center justify-center gap-1.5 rounded-lg px-5 text-sm font-semibold transition-transform active:scale-97 disabled:opacity-50"
          style={{ background: ADMIN.accent, color: "#04140F" }}
        >
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {ok ? "Guardado ✓" : saved && !value.trim() ? "Desconectar" : "Guardar"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs" style={{ color: ADMIN.negative }}>
          {error}
        </p>
      )}
      <p className="mt-3 text-xs" style={{ color: ADMIN.textMuted }}>
        {help}
      </p>
    </div>
  );
}

export function IntegrationsPanel() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : { settings: {} }))
      .then((d) => setSettings(d.settings || {}))
      .catch(() => setSettings({}));
  }, []);

  const card = { background: ADMIN.surface, border: `1px solid ${ADMIN.border}` };

  if (!settings) {
    return (
      <p className="flex items-center gap-2 text-sm" style={{ color: ADMIN.textMuted }}>
        <Loader2 className="size-4 animate-spin" aria-hidden /> Cargando integraciones…
      </p>
    );
  }

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

      {/* Google Analytics */}
      <IdSetting
        title="Google Analytics"
        description="Tráfico de tu web (de dónde viene la gente, páginas más vistas)."
        placeholder="Pega tu ID de medición (G-XXXXXXXX)"
        field="gaId"
        initial={settings.ga_measurement_id || ""}
        invalidError="Ese ID no tiene el formato correcto (debe ser G-XXXXXXXX)."
        help={
          <>
            El ID lo sacas de Google Analytics (Administrar → Flujos de datos). Empieza por{" "}
            <code className="rounded px-1" style={{ background: ADMIN.bg }}>
              G-
            </code>
            . Solo se activa para quien acepte las cookies. Vacío + Guardar = desconectar.
          </>
        }
      />

      {/* Microsoft Clarity */}
      <IdSetting
        title="Microsoft Clarity"
        description="Mapas de calor y grabaciones de sesión (cómo usan tu web de verdad)."
        placeholder="Pega tu Project ID (ej. xqwlpj6o3f)"
        field="clarityId"
        initial={settings.clarity_project_id || ""}
        invalidError="Ese Project ID no tiene el formato correcto."
        help={
          <>
            El Project ID lo sacas de{" "}
            <code className="rounded px-1" style={{ background: ADMIN.bg }}>
              clarity.microsoft.com
            </code>{" "}
            (Settings → Overview). Solo se activa para quien acepte las cookies. Vacío + Guardar = desconectar.
          </>
        }
      />

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
