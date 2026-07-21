"use client";

import { useMemo, useState } from "react";
import { Pencil, Check, X, Search } from "lucide-react";
import type { AdminUser } from "@/lib/admin-data";
import { ADMIN } from "@/components/app/admin/AdminCharts";

const PLANS = ["free", "premium", "family"] as const;
const STATUSES = ["active", "past_due", "canceled", "refunded", "chargeback"] as const;

export function UsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [hideTest, setHideTest] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPlan, setDraftPlan] = useState<string>("free");
  const [draftStatus, setDraftStatus] = useState<string>("active");
  const [draftPhone, setDraftPhone] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const testCount = useMemo(() => users.filter((u) => u.isTest).length, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = users;
    if (hideTest) list = list.filter((u) => !u.isTest);
    if (!q) return list;
    return list.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.source.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }, [users, query, hideTest]);

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setDraftPlan(user.plan);
    setDraftStatus(user.planStatus);
    setDraftPhone(user.phone);
  }

  async function saveEdit(userId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: draftPlan, planStatus: draftStatus, phone: draftPhone }),
      });
      if (res.ok) {
        setUsers((list) =>
          list.map((u) =>
            u.id === userId
              ? { ...u, plan: draftPlan as AdminUser["plan"], planStatus: draftStatus, phone: draftPhone }
              : u
          )
        );
        setEditingId(null);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="relative mb-3">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          style={{ color: ADMIN.textMuted }}
          aria-hidden
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, correo, país, origen o teléfono…"
          className="h-11 w-full rounded-lg border pl-9 pr-3 text-sm outline-none focus-visible:ring-2"
          style={{ background: ADMIN.bg, borderColor: ADMIN.border, color: ADMIN.text }}
        />
      </div>
      {testCount > 0 && (
        <button
          type="button"
          onClick={() => setHideTest((v) => !v)}
          className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors active:scale-97"
          style={
            hideTest
              ? { background: ADMIN.accent, color: "#04140F" }
              : { background: ADMIN.bg, color: ADMIN.textMuted, border: `1px solid ${ADMIN.border}` }
          }
        >
          {hideTest ? "✓ " : ""}
          Ocultar {testCount} cuenta{testCount === 1 ? "" : "s"} de prueba
        </button>
      )}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: ADMIN.border }}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs" style={{ background: ADMIN.bg, color: ADMIN.textMuted }}>
            <tr>
              <th className="px-3 py-2 font-medium">Nombre</th>
              <th className="px-3 py-2 font-medium">Correo</th>
              <th className="px-3 py-2 font-medium">País</th>
              <th className="px-3 py-2 font-medium">Teléfono</th>
              <th className="px-3 py-2 font-medium">Origen</th>
              <th className="px-3 py-2 font-medium">Disp.</th>
              <th className="px-3 py-2 font-medium">Plan</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Alta</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: ADMIN.border }}>
            {filtered.map((u) => {
              const editing = editingId === u.id;
              return (
                <tr key={u.id} style={{ borderColor: ADMIN.border }}>
                  <td className="max-w-[9rem] px-3 py-2 font-medium" style={{ color: ADMIN.text }}>
                    <span className="flex items-center gap-1.5">
                      <span className="truncate">{u.name}</span>
                      {u.isTest && (
                        <span
                          className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase"
                          style={{ background: ADMIN.border, color: ADMIN.textMuted }}
                        >
                          prueba
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="max-w-[11rem] truncate px-3 py-2" style={{ color: ADMIN.textMuted }}>
                    {u.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2" style={{ color: ADMIN.textMuted }}>
                    {u.countryFlag} {u.country}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <input
                        value={draftPhone}
                        onChange={(e) => setDraftPhone(e.target.value)}
                        placeholder="teléfono"
                        className="h-8 w-28 rounded-md border px-2 text-xs"
                        style={{ background: ADMIN.bg, borderColor: ADMIN.border, color: ADMIN.text }}
                      />
                    ) : (
                      <span className="whitespace-nowrap" style={{ color: ADMIN.textMuted }}>
                        {u.phone ? `${u.phoneCode} ${u.phone}` : "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 capitalize" style={{ color: ADMIN.textMuted }}>
                    {u.source}
                  </td>
                  <td className="px-3 py-2" style={{ color: ADMIN.textMuted }}>
                    {u.platform}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <select
                        value={draftPlan}
                        onChange={(e) => setDraftPlan(e.target.value)}
                        className="h-8 rounded-md border px-1 text-xs"
                        style={{ background: ADMIN.bg, borderColor: ADMIN.border, color: ADMIN.text }}
                      >
                        {PLANS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-medium" style={{ color: ADMIN.text }}>
                        {u.plan}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2" style={{ color: ADMIN.textMuted }}>
                    {editing ? (
                      <select
                        value={draftStatus}
                        onChange={(e) => setDraftStatus(e.target.value)}
                        className="h-8 rounded-md border px-1 text-xs"
                        style={{ background: ADMIN.bg, borderColor: ADMIN.border, color: ADMIN.text }}
                      >
                        {STATUSES.map((sst) => (
                          <option key={sst} value={sst}>
                            {sst}
                          </option>
                        ))}
                      </select>
                    ) : (
                      u.planStatus
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs" style={{ color: ADMIN.textMuted }}>
                    {new Date(u.createdAt).toLocaleDateString("es")}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => saveEdit(u.id)}
                          aria-label="Guardar"
                          className="flex size-7 items-center justify-center rounded-full disabled:opacity-50"
                          style={{ background: ADMIN.accent, color: "#04140F" }}
                        >
                          <Check className="size-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          aria-label="Cancelar"
                          className="flex size-7 items-center justify-center rounded-full"
                          style={{ color: ADMIN.textMuted }}
                        >
                          <X className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(u)}
                        aria-label={`Editar a ${u.name}`}
                        className="flex size-7 items-center justify-center rounded-full"
                        style={{ color: ADMIN.textMuted }}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-4 text-center text-sm" style={{ color: ADMIN.textMuted }}>
            Sin resultados.
          </p>
        )}
      </div>
    </div>
  );
}
