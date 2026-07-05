import { loadOnboarding } from "@/lib/onboarding";

export type Peptide = {
  id: string;
  name: string;
  route: string;
  typicalDose: string;
  typicalUnit: string;
};

export type SyringeType = "u30" | "u50" | "u100";

export type Vial = {
  id: string;
  peptideId: string;
  amount: string;
  unit: string;
  bacWater: string;
  syringeType?: SyringeType;
  createdAt: string;
};

export type Dose = {
  id: string;
  peptideId: string;
  amount: string;
  unit: string;
  when: string;
  done: boolean;
  injectionSite?: string;
};

export type HealthLog = {
  id: string;
  date: string;
  weightKg?: string;
  hydrationMl?: string;
  exerciseMin?: string;
  sideEffect?: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  email: string;
  visibility: "resumen" | "completo";
};

export type AppData = {
  peptides: Peptide[];
  vials: Vial[];
  doses: Dose[];
  healthLogs: HealthLog[];
  familyMembers: FamilyMember[];
  seeded: boolean;
};

const KEY = "peptibrain_app_data";

const EMPTY: AppData = {
  peptides: [],
  vials: [],
  doses: [],
  healthLogs: [],
  familyMembers: [],
  seeded: false,
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function loadAppData(): AppData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    const data: AppData = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
    if (!data.seeded) return seedFromOnboarding(data);
    return data;
  } catch {
    return EMPTY;
  }
}

export function saveAppData(data: AppData): AppData {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  }
  return data;
}

function seedFromOnboarding(base: AppData): AppData {
  const onboarding = loadOnboarding();
  if (!onboarding.peptideName) {
    return saveAppData({ ...base, seeded: true });
  }

  const peptideId = uid();
  const peptide: Peptide = {
    id: peptideId,
    name: onboarding.peptideName,
    route: onboarding.peptideRoute || "Subcutánea",
    typicalDose: onboarding.doseAmount || "",
    typicalUnit: onboarding.doseUnit || "mg",
  };

  const vials: Vial[] = onboarding.vialAmount
    ? [
        {
          id: uid(),
          peptideId,
          amount: onboarding.vialAmount,
          unit: onboarding.vialUnit,
          bacWater: onboarding.bacWater,
          createdAt: new Date().toISOString(),
        },
      ]
    : [];

  const doses: Dose[] = onboarding.doseAmount
    ? [
        {
          id: uid(),
          peptideId,
          amount: onboarding.doseAmount,
          unit: onboarding.doseUnit,
          when: onboarding.doseWhen || "Hoy",
          done: false,
        },
      ]
    : [];

  return saveAppData({
    ...base,
    peptides: [peptide],
    vials,
    doses,
    seeded: true,
  });
}

export function addPeptide(data: AppData, peptide: Omit<Peptide, "id">): AppData {
  return saveAppData({ ...data, peptides: [...data.peptides, { ...peptide, id: uid() }] });
}

export function addVial(data: AppData, vial: Omit<Vial, "id" | "createdAt">): AppData {
  return saveAppData({
    ...data,
    vials: [...data.vials, { ...vial, id: uid(), createdAt: new Date().toISOString() }],
  });
}

export function addDose(data: AppData, dose: Omit<Dose, "id" | "done">): AppData {
  return saveAppData({ ...data, doses: [...data.doses, { ...dose, id: uid(), done: false }] });
}

export function markDoseDone(data: AppData, doseId: string): AppData {
  return saveAppData({
    ...data,
    doses: data.doses.map((d) => (d.id === doseId ? { ...d, done: true } : d)),
  });
}

export function addHealthLog(data: AppData, log: Omit<HealthLog, "id">): AppData {
  return saveAppData({ ...data, healthLogs: [{ ...log, id: uid() }, ...data.healthLogs] });
}

export function addFamilyMember(data: AppData, member: Omit<FamilyMember, "id">): AppData {
  return saveAppData({
    ...data,
    familyMembers: [...data.familyMembers, { ...member, id: uid() }],
  });
}

export function updateFamilyVisibility(
  data: AppData,
  memberId: string,
  visibility: FamilyMember["visibility"]
): AppData {
  return saveAppData({
    ...data,
    familyMembers: data.familyMembers.map((m) => (m.id === memberId ? { ...m, visibility } : m)),
  });
}

export function removeFamilyMember(data: AppData, memberId: string): AppData {
  return saveAppData({
    ...data,
    familyMembers: data.familyMembers.filter((m) => m.id !== memberId),
  });
}

export function computeStreak(doses: Dose[]): number {
  const doneCount = doses.filter((d) => d.done).length;
  return doneCount;
}
