"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, X, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TRT_QUIZ_QUESTION_COUNT, scoreTrtQuiz, type TrtQuizBand } from "@/lib/trt-quiz";

const BAND_COLOR: Record<TrtQuizBand, string> = {
  bajo: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  medio: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  alto: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

export function TrtQuizTool() {
  const t = useTranslations("TrtQuiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const done = step >= TRT_QUIZ_QUESTION_COUNT;
  const result = done ? scoreTrtQuiz(answers) : null;

  function answer(value: boolean) {
    setAnswers((prev) => [...prev.slice(0, step), value]);
    setStep((s) => s + 1);
  }

  function restart() {
    setStep(0);
    setAnswers([]);
  }

  if (done && result) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {t("resultScoreLabel", { score: result.score, total: TRT_QUIZ_QUESTION_COUNT })}
        </p>
        <div className={`mx-auto mt-3 max-w-sm rounded-xl p-4 text-center ${BAND_COLOR[result.band]}`}>
          <p className="font-display text-lg font-bold">{t(`band.${result.band}.title`)}</p>
          <p className="mt-1.5 text-sm leading-relaxed">{t(`band.${result.band}.body`)}</p>
        </div>
        <div className="mx-auto mt-5 max-w-sm rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
          {t("notDiagnosis")}
        </div>
        <div className="mt-5 flex flex-col items-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-12 w-full max-w-sm items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            {t("ctaButton")}
          </Link>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden /> {t("restart")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(step / TRT_QUIZ_QUESTION_COUNT) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-xs font-semibold text-muted-foreground">
        {t("stepLabel", { step: step + 1, total: TRT_QUIZ_QUESTION_COUNT })}
      </p>
      <p className="mt-2 font-display text-lg font-bold text-foreground">{t(`question.${step}`)}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => answer(false)}
          className="flex h-14 items-center justify-center gap-2 rounded-lg border border-input bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <X className="size-4" aria-hidden /> {t("no")}
        </button>
        <button
          type="button"
          onClick={() => answer(true)}
          className="flex h-14 items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
        >
          <Check className="size-4" aria-hidden /> {t("yes")}
        </button>
      </div>
    </div>
  );
}
