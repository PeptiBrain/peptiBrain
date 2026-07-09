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
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  }, [users, query]);

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setDraftPlan(user.plan);
    setDraftStatus(user.planStatus);
  }

  async function saveEdit(userId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: draftPlan, planStatus: draftStatus }),
      });
      if (res.ok) {
        setUsers((list) =>
          list.map((u) =>
            u.id === userId ? { ...u, plan: draftPlan as AdminUser["plan"], planStatus: draftStatus } : u
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
        placeholder="Buscar por correo o nombre..."
        className="mb-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Nombre</th>
              <th className="px-3 py-2 font-medium">Correo</th>
              <th className="px-3 py-2 font-medium">Plan</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Alta</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="max-w-[8rem] truncate px-3 py-2 text-foreground">{u.name}</td>
                <td className="max-w-[10rem] truncate px-3 py-2 text-muted-foreground">{u.email}</td>
                <td className="px-3 py-2">
                  {editingId === u.id ? (
                    <select
                      value={draftPlan}
                      onChange={(e) => setDraftPlan(e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-1 text-xs text-foreground"
                    >
                      {PLANS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  ) : (
                    u.plan
                  )}
                </td>
                <td className="px-3 py-2">
                  {editingId === u.id ? (
                    <select
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-1 text-xs text-foreground"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    u.planStatus
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("es")}
                </td>
                <td className="px-3 py-2">
                  {editingId === u.id ? (
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
                        className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                      >
                        <X className="size-3.5" aria-hidden />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(u)}
                      aria-label={`Editar a ${u.name}`}
                      className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
                    >
                      <Pencil className="size-3.5" aria-hidden />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-4 text-center text-sm text-muted-foreground">Sin resultados.</p>
        )}
      </div>
    </div>
  );
}
