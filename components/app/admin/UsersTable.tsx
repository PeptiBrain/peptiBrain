"use client";

import { useMemo, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import type { AdminUser } from "@/lib/admin-data";

const PLANS = ["free", "premium", "family"] as const;
const STATUSES = ["active", "past_due", "canceled", "refunded", "chargeback"] as const;

export function UsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPlan, setDraftPlan] = useState<string>("free");
  const [draftStatus, setDraftStatus] = useState<string>("active");
  const [draftPhone, setDraftPhone] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.source.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }, [users, query]);

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
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre, correo, país, origen o teléfono…"
        className="mb-3 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-400">
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
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => {
              const editing = editingId === u.id;
              return (
                <tr key={u.id} className="text-slate-700">
                  <td className="max-w-[8rem] truncate px-3 py-2 font-medium text-slate-900">{u.name}</td>
                  <td className="max-w-[11rem] truncate px-3 py-2 text-slate-500">{u.email}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {u.countryFlag} {u.country}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <input
                        value={draftPhone}
                        onChange={(e) => setDraftPhone(e.target.value)}
                        placeholder="teléfono"
                        className="h-8 w-28 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900"
                      />
                    ) : (
                      <span className="whitespace-nowrap text-slate-500">
                        {u.phone ? `${u.phoneCode} ${u.phone}` : "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 capitalize text-slate-500">{u.source}</td>
                  <td className="px-3 py-2 text-slate-500">{u.platform}</td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <select
                        value={draftPlan}
                        onChange={(e) => setDraftPlan(e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-1 text-xs text-slate-900"
                      >
                        {PLANS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-medium text-slate-900">{u.plan}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editing ? (
                      <select
                        value={draftStatus}
                        onChange={(e) => setDraftStatus(e.target.value)}
                        className="h-8 rounded-md border border-slate-200 bg-white px-1 text-xs text-slate-900"
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
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-400">
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
                          className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                        >
                          <Check className="size-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          aria-label="Cancelar"
                          className="flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                        >
                          <X className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(u)}
                        aria-label={`Editar a ${u.name}`}
                        className="flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-primary"
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
          <p className="p-4 text-center text-sm text-slate-500">Sin resultados.</p>
        )}
      </div>
    </div>
  );
}
