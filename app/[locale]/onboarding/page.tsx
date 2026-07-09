"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { AnimatePresence } from "motion/react";
import { OnboardingProgress } from "@/components/app/onboarding/OnboardingProgress";
import { WelcomeStep } from "@/components/app/onboarding/WelcomeStep";
import { GoalStep } from "@/components/app/onboarding/GoalStep";
import { StepPeptide } from "@/components/app/onboarding/StepPeptide";
import { StepVial } from "@/components/app/onboarding/StepVial";
import { StepDose } from "@/components/app/onboarding/StepDose";
import { BuildingScreen } from "@/components/app/onboarding/BuildingScreen";
import { loadOnboarding, saveOnboarding, type OnboardingData } from "@/lib/onboarding";

const STEP_PERCENTS = [10, 32, 54, 76, 100];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    setData(loadOnboarding());
  }, []);

  if (!data) return null;

  function startWizard() {
    if (!data!.startedAt) {
      const next = saveOnboarding({ startedAt: new Date().toISOString() });
      if (next) setData(next);
    }
    setStep(0);
  }

  if (step === -1) {
    return (
      <main className="flex flex-1 flex-col">
        <WelcomeStep
          onStart={startWizard}
          onSkip={() => {
            startWizard();
            router.push("/paywall");
          }}
        />
      </main>
    );
  }

  if (step === 4) {
    return (
      <main className="flex flex-1 flex-col">
        <BuildingScreen
          peptideName={data.peptideName}
          doseWhen={data.doseWhen}
          onDone={() => router.push("/paywall")}
        />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <OnboardingProgress
        percent={STEP_PERCENTS[step]}
        showBack={step > 0}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onSkip={() => router.push("/paywall")}
      />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <GoalStep
            key="goal"
            initialGoal={data.goal}
            onContinue={(goal) => {
              const next = saveOnboarding({ goal });
              if (next) setData(next);
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <StepPeptide
            key="peptide"
            initialName={data.peptideName}
            initialRoute={data.peptideRoute}
            initialCategory={data.goal}
            onContinue={(peptideName, peptideRoute) => {
              const next = saveOnboarding({ peptideName, peptideRoute });
              if (next) setData(next);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <StepVial
            key="vial"
            peptideName={data.peptideName}
            initialAmount={data.vialAmount}
            initialUnit={data.vialUnit}
            initialBacWater={data.bacWater}
            onContinue={(vialAmount, vialUnit, bacWater) => {
              const next = saveOnboarding({ vialAmount, vialUnit, bacWater });
              if (next) setData(next);
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <StepDose
            key="dose"
            peptideName={data.peptideName}
            initialAmount={data.doseAmount}
            initialUnit={data.doseUnit}
            onFinish={(doseWhen, doseScheduledAt, doseAmount, doseUnit) => {
              const next = saveOnboarding({ doseWhen, doseScheduledAt, doseAmount, doseUnit });
              if (next) setData(next);
              setStep(4);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
