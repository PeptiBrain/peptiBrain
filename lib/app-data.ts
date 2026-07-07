import { createClient } from "@/lib/supabase/client";
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
  date: string; // ISO yyyy-mm-dd
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
  plan: "free" | "premium" | "family";
};

const EMPTY: AppData = {
  peptides: [],
  vials: [],
  doses: [],
  healthLogs: [],
  familyMembers: [],
  plan: "free",
};

export class PlanLimitError extends Error {
  constructor(message = "PLAN_LIMIT_REACHED") {
    super(message);
    this.name = "PlanLimitError";
  }
}

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  return { supabase, user };
}

export async function loadAppData(): Promise<AppData> {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, onboarding_completed_at")
    .eq("id", user.id)
    .single();

  if (profile && !profile.onboarding_completed_at) {
    await seedFromOnboarding(user.id);
    await supabase
      .from("profiles")
      .update({ onboarding_completed_at: new Date().toISOString() })
      .eq("id", user.id);
  }

  const [{ data: peptides }, { data: vials }, { data: doses }, { data: healthLogs }, { data: family }] =
    await Promise.all([
      supabase.from("peptides").select("*").order("created_at", { ascending: true }),
      supabase.from("vials").select("*").order("created_at", { ascending: true }),
      supabase.from("doses").select("*").order("created_at", { ascending: true }),
      supabase.from("health_logs").select("*").order("log_date", { ascending: false }),
      supabase.from("family_members").select("*").order("created_at", { ascending: true }),
    ]);

  return {
    plan: (profile?.plan as AppData["plan"]) || "free",
    peptides: (peptides || []).map((p) => ({
      id: p.id,
      name: p.name,
      route: p.route,
      typicalDose: p.typical_dose != null ? String(p.typical_dose) : "",
      typicalUnit: p.typical_unit,
    })),
    vials: (vials || []).map((v) => ({
      id: v.id,
      peptideId: v.peptide_id,
      amount: String(v.amount),
      unit: v.unit,
      bacWater: v.bac_water != null ? String(v.bac_water) : "",
      syringeType: v.syringe_type || undefined,
      createdAt: v.created_at,
    })),
    doses: (doses || []).map((d) => ({
      id: d.id,
      peptideId: d.peptide_id,
      amount: String(d.amount),
      unit: d.unit,
      when: d.when_label,
      done: d.done,
      injectionSite: d.injection_site || undefined,
    })),
    healthLogs: (healthLogs || []).map((h) => ({
      id: h.id,
      date: h.log_date,
      weightKg: h.weight_kg != null ? String(h.weight_kg) : undefined,
      hydrationMl: h.hydration_ml != null ? String(h.hydration_ml) : undefined,
      exerciseMin: h.exercise_min != null ? String(h.exercise_min) : undefined,
      sideEffect: h.side_effect || undefined,
    })),
    familyMembers: (family || []).map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      visibility: f.visibility,
    })),
  };
}

async function seedFromOnboarding(userId: string) {
  const onboarding = loadOnboarding();
  if (!onboarding.peptideName) return;

  const supabase = createClient();
  const { data: peptide } = await supabase
    .from("peptides")
    .insert({
      user_id: userId,
      name: onboarding.peptideName,
      route: onboarding.peptideRoute || "Subcutánea",
      typical_dose: onboarding.doseAmount ? Number(onboarding.doseAmount) : null,
      typical_unit: onboarding.doseUnit || "mg",
    })
    .select()
    .single();

  if (!peptide) return;

  if (onboarding.vialAmount) {
    await supabase.from("vials").insert({
      user_id: userId,
      peptide_id: peptide.id,
      amount: Number(onboarding.vialAmount),
      unit: onboarding.vialUnit,
      bac_water: onboarding.bacWater ? Number(onboarding.bacWater) : null,
    });
  }

  if (onboarding.doseAmount) {
    await supabase.from("doses").insert({
      user_id: userId,
      peptide_id: peptide.id,
      amount: Number(onboarding.doseAmount),
      unit: onboarding.doseUnit,
      when_label: onboarding.doseWhen || "Hoy",
      done: false,
    });
  }
}

export async function addPeptide(
  data: AppData,
  peptide: Omit<Peptide, "id">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  if (data.plan === "free" && data.peptides.length >= 1) {
    throw new PlanLimitError();
  }
  const { error } = await supabase.from("peptides").insert({
    user_id: user.id,
    name: peptide.name,
    route: peptide.route,
    typical_dose: peptide.typicalDose ? Number(peptide.typicalDose) : null,
    typical_unit: peptide.typicalUnit,
  });
  if (error) throw error;
  return loadAppData();
}

export async function addVial(
  data: AppData,
  vial: Omit<Vial, "id" | "createdAt">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  if (data.plan === "free" && data.vials.length >= 1) {
    throw new PlanLimitError();
  }
  const { error } = await supabase.from("vials").insert({
    user_id: user.id,
    peptide_id: vial.peptideId,
    amount: Number(vial.amount),
    unit: vial.unit,
    bac_water: vial.bacWater ? Number(vial.bacWater) : null,
    syringe_type: vial.syringeType || null,
  });
  if (error) throw error;
  return loadAppData();
}

export async function addDose(
  data: AppData,
  dose: Omit<Dose, "id" | "done">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("doses").insert({
    user_id: user.id,
    peptide_id: dose.peptideId,
    amount: Number(dose.amount),
    unit: dose.unit,
    when_label: dose.when,
    done: false,
  });
  if (error) throw error;
  return loadAppData();
}

export async function markDoseDone(data: AppData, doseId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("doses").update({ done: true }).eq("id", doseId);
  if (error) throw error;
  return loadAppData();
}

export async function addHealthLog(
  data: AppData,
  log: Omit<HealthLog, "id">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("health_logs").upsert(
    {
      user_id: user.id,
      log_date: log.date,
      weight_kg: log.weightKg ? Number(log.weightKg) : null,
      hydration_ml: log.hydrationMl ? Number(log.hydrationMl) : null,
      exercise_min: log.exerciseMin ? Number(log.exerciseMin) : null,
      side_effect: log.sideEffect || null,
    },
    { onConflict: "user_id,log_date" }
  );
  if (error) throw error;
  return loadAppData();
}

export async function addFamilyMember(
  data: AppData,
  member: Omit<FamilyMember, "id">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("family_members").insert({
    owner_id: user.id,
    name: member.name,
    email: member.email,
    visibility: member.visibility,
  });
  if (error) throw error;
  return loadAppData();
}

export async function updateFamilyVisibility(
  data: AppData,
  memberId: string,
  visibility: FamilyMember["visibility"]
): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("family_members")
    .update({ visibility })
    .eq("id", memberId);
  if (error) throw error;
  return loadAppData();
}

export async function removeFamilyMember(data: AppData, memberId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("family_members").delete().eq("id", memberId);
  if (error) throw error;
  return loadAppData();
}

export function computeStreak(doses: Dose[]): number {
  return doses.filter((d) => d.done).length;
}
