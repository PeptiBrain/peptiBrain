export type OnboardingData = {
  name: string;
  email: string;
  phoneCode: string;
  phone: string;
  peptideName: string;
  peptideRoute: string;
  vialAmount: string;
  vialUnit: string;
  bacWater: string;
  doseAmount: string;
  doseUnit: string;
  doseWhen: string;
  plan: "gratis" | "premium" | "family" | null;
};

export const EMPTY_ONBOARDING: OnboardingData = {
  name: "",
  email: "",
  phoneCode: "+34",
  phone: "",
  peptideName: "",
  peptideRoute: "Subcutánea",
  vialAmount: "",
  vialUnit: "mg",
  bacWater: "",
  doseAmount: "",
  doseUnit: "mg",
  doseWhen: "",
  plan: null,
};

const KEY = "peptibrain_onboarding";

export function loadOnboarding(): OnboardingData {
  if (typeof window === "undefined") return EMPTY_ONBOARDING;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_ONBOARDING;
    return { ...EMPTY_ONBOARDING, ...JSON.parse(raw) };
  } catch {
    return EMPTY_ONBOARDING;
  }
}

export function saveOnboarding(data: Partial<OnboardingData>) {
  if (typeof window === "undefined") return;
  const current = loadOnboarding();
  const next = { ...current, ...data };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
