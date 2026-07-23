"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ChevronUp, Plus, Loader2, Map, Lightbulb } from "lucide-react";
import { ROADMAP_STATUSES, IDEA_CATEGORIES, IDEA_STATUSES, type Idea, type IdeaStatus } from "@/lib/ideas";

const STATUS_TONE: Record<IdeaStatus, string> = {
  open: "bg-secondary text-secondary-foreground",
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  declined: "bg-muted text-muted-foreground",
};

export function IdeasBoard({
  initialIdeas,
  votedIds,
  isLoggedIn,
  isAdmin,
}: {
  initialIdeas: Idea[];
  votedIds: string[];
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const t = useTranslations("Ideas");
  const router = useRouter();

  const [tab, setTab] = useState<"ideas" | "roadmap">("ideas");
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [voted, setVoted] = useState<Set<string>>(new Set(votedIds));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("otra");
  const [submitting, setSubmitting] = useState(false);

  const sortedIdeas = useMemo(
    () => [...ideas].sort((a, b) => b.vote_count - a.vote_count || +new Date(b.created_at) - +new Date(a.created_at)),
    [ideas],
  );

  const roadmapGroups = useMemo(
    () => ROADMAP_STATUSES.map((status) => ({ status, items: sortedIdeas.filter((i) => i.status === status) })),
    [sortedIdeas],
  );

  async function toggleVote(idea: Idea) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const hasVoted = voted.has(idea.id);
    // Optimista: actualiza al instante y revierte si falla.
    setVoted((prev) => {
      const next = new Set(prev);
      if (hasVoted) next.delete(idea.id);
      else next.add(idea.id);
      return next;
    });
    setIdeas((prev) =>
      prev.map((i) => (i.id === idea.id ? { ...i, vote_count: i.vote_count + (hasVoted ? -1 : 1) } : i)),
    );
    const res = await fetch("/api/ideas/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaId: idea.id }),
    }).catch(() => null);
    if (!res || !res.ok) {
      // Revertir
      setVoted((prev) => {
        const next = new Set(prev);
        if (hasVoted) next.add(idea.id);
        else next.delete(idea.id);
        return next;
      });
      setIdeas((prev) =>
        prev.map((i) => (i.id === idea.id ? { ...i, vote_count: i.vote_count + (hasVoted ? 1 : -1) } : i)),
      );
    }
  }

  async function submitIdea(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (title.trim().length < 3) return;
    setSubmitting(true);
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim(), category }),
    }).catch(() => null);
    setSubmitting(false);
    if (res && res.ok) {
      const data = await res.json();
      if (data.idea) {
        setIdeas((prev) => [data.idea as Idea, ...prev]);
        setVoted((prev) => new Set(prev).add(data.idea.id));
        setTitle("");
        setDescription("");
        setCategory("otra");
      }
    }
  }

  async function changeStatus(ideaId: string, status: string) {
    setIdeas((prev) => prev.map((i) => (i.id === ideaId ? { ...i, status: status as IdeaStatus } : i)));
    await fetch("/api/ideas/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaId, status }),
    }).catch(() => null);
  }

  return (
    <div className="mt-6">
      <div className="mb-5 inline-flex rounded-full border border-border bg-card p-0.5">
        <TabButton active={tab === "ideas"} onClick={() => setTab("ideas")} icon={Lightbulb}>
          {t("tabIdeas")}
        </TabButton>
        <TabButton active={tab === "roadmap"} onClick={() => setTab("roadmap")} icon={Map}>
          {t("tabRoadmap")}
        </TabButton>
      </div>

      {tab === "ideas" ? (
        <>
          <form onSubmit={submitIdea} className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-display text-base font-bold text-foreground">{t("submitTitle")}</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder={t("fieldTitlePlaceholder")}
              className="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={2}
              placeholder={t("fieldDescriptionPlaceholder")}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                {IDEA_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`cat_${c}`)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting || title.trim().length < 3}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-50 sm:ml-auto"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Plus className="size-4" aria-hidden />
                )}
                {isLoggedIn ? t("submitButton") : t("loginToPost")}
              </button>
            </div>
          </form>

          <div className="mt-4 space-y-3">
            {sortedIdeas.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                {t("empty")}
              </p>
            ) : (
              sortedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  voted={voted.has(idea.id)}
                  onVote={() => toggleVote(idea)}
                  isAdmin={isAdmin}
                  onStatus={changeStatus}
                  t={t}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {roadmapGroups.map((group) => (
            <section key={group.status}>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[group.status]}`}>
                  {t(`status_${group.status}`)}
                </span>
                <span className="text-xs text-muted-foreground">{group.items.length}</span>
              </div>
              {group.items.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">{t("emptyRoadmap")}</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {group.items.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      voted={voted.has(idea.id)}
                      onVote={() => toggleVote(idea)}
                      isAdmin={isAdmin}
                      onStatus={changeStatus}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Lightbulb;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="size-4" aria-hidden />
      {children}
    </button>
  );
}

function IdeaCard({
  idea,
  voted,
  onVote,
  isAdmin,
  onStatus,
  t,
}: {
  idea: Idea;
  voted: boolean;
  onVote: () => void;
  isAdmin: boolean;
  onStatus: (id: string, status: string) => void;
  t: ReturnType<typeof useTranslations<"Ideas">>;
}) {
  return (
    <article className="flex gap-3 rounded-2xl border border-border bg-card p-4">
      <button
        type="button"
        onClick={onVote}
        aria-pressed={voted}
        aria-label={t("voteLabel")}
        className={`flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl border transition-colors ${
          voted
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-background text-foreground hover:bg-muted"
        }`}
      >
        <ChevronUp className="size-4" aria-hidden />
        <span className="text-sm font-bold tabular-nums">{idea.vote_count}</span>
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_TONE[idea.status]}`}>
            {t(`status_${idea.status}`)}
          </span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {t(`cat_${(IDEA_CATEGORIES as readonly string[]).includes(idea.category) ? idea.category : "otra"}`)}
          </span>
        </div>
        <h3 className="mt-2 font-display text-base font-bold text-foreground">{idea.title}</h3>
        {idea.description && (
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{idea.description}</p>
        )}
        {isAdmin && (
          <select
            value={idea.status}
            onChange={(e) => onStatus(idea.id, e.target.value)}
            className="mt-3 h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
          >
            {IDEA_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status_${s}`)}
              </option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
