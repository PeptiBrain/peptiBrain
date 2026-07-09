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
  cost?: string;
  createdAt: string;
};

export type Dose = {
  id: string;
  peptideId: string;
  amount: string;
  unit: string;
  when: string;
  scheduledAt: string;
  done: boolean;
  injectionSite?: string;
  createdAt: string;
};

export type HealthLog = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  weightKg?: string;
  hydrationMl?: string;
  exerciseMin?: string;
  sideEffect?: string;
  notes?: string;
};

export type Meal = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  description: string;
  calories?: string;
  createdAt: string;
};

export type FamilyRelationship =
  | "pareja"
  | "hermano"
  | "hijo"
  | "padre_madre"
  | "primo"
  | "tio"
  | "sobrino"
  | "cunado"
  | "amigo"
  | "vecino"
  | "otro";

export type FamilyMember = {
  id: string;
  name: string;
  email: string;
  relationship?: FamilyRelationship;
  photoUrl?: string;
  sharePeptides: boolean;
  shareDoses: boolean;
  shareHealth: boolean;
};

export type ReceivedInvitation = {
  id: string;
  ownerId: string;
  ownerName: string;
  inviteStatus: "pending" | "accepted" | "revoked";
};

export type SharedOwnerData = {
  ownerName: string;
  peptides: Peptide[];
  vials: Vial[];
  doses: Dose[];
  healthLogs: HealthLog[];
};

export type Provider = {
  id: string;
  name: string;
  website?: string;
  socialNetwork?: string;
  socialHandle?: string;
  phone?: string;
  email?: string;
  brands: string[];
  notes?: string;
  createdAt: string;
};

export type Trip = {
  id: string;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string; // ISO yyyy-mm-dd
  destination?: string;
  createdAt: string;
};

export type AppData = {
  peptides: Peptide[];
  vials: Vial[];
  doses: Dose[];
  healthLogs: HealthLog[];
  meals: Meal[];
  providers: Provider[];
  trips: Trip[];
  familyMembers: FamilyMember[];
  plan: "free" | "premium" | "family";
};

const EMPTY: AppData = {
  peptides: [],
  trips: [],
  vials: [],
  doses: [],
  healthLogs: [],
  meals: [],
  providers: [],
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

  const [
    { data: peptides },
    { data: vials },
    { data: doses },
    { data: healthLogs },
    { data: meals },
    { data: providers },
    { data: trips },
    { data: family },
  ] = await Promise.all([
    supabase.from("peptides").select("*").order("created_at", { ascending: true }),
    supabase.from("vials").select("*").order("created_at", { ascending: true }),
    supabase.from("doses").select("*").order("created_at", { ascending: true }),
    supabase.from("health_logs").select("*").order("log_date", { ascending: false }),
    supabase.from("meals").select("*").order("log_date", { ascending: false }),
    supabase.from("providers").select("*").order("created_at", { ascending: true }),
    supabase.from("trips").select("*").order("start_date", { ascending: false }),
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
      cost: v.cost != null ? String(v.cost) : undefined,
      createdAt: v.created_at,
    })),
    doses: (doses || []).map((d) => ({
      id: d.id,
      peptideId: d.peptide_id,
      amount: String(d.amount),
      unit: d.unit,
      when: d.when_label,
      scheduledAt: d.scheduled_at,
      done: d.done,
      injectionSite: d.injection_site || undefined,
      createdAt: d.created_at,
    })),
    healthLogs: (healthLogs || []).map((h) => ({
      id: h.id,
      date: h.log_date,
      weightKg: h.weight_kg != null ? String(h.weight_kg) : undefined,
      hydrationMl: h.hydration_ml != null ? String(h.hydration_ml) : undefined,
      exerciseMin: h.exercise_min != null ? String(h.exercise_min) : undefined,
      sideEffect: h.side_effect || undefined,
      notes: h.notes || undefined,
    })),
    meals: (meals || []).map((m) => ({
      id: m.id,
      date: m.log_date,
      description: m.description,
      calories: m.calories != null ? String(m.calories) : undefined,
      createdAt: m.created_at,
    })),
    providers: (providers || []).map((p) => ({
      id: p.id,
      name: p.name,
      website: p.website || undefined,
      socialNetwork: p.social_network || undefined,
      socialHandle: p.social_handle || undefined,
      phone: p.phone || undefined,
      email: p.email || undefined,
      brands: Array.isArray(p.brands) ? p.brands : [],
      notes: p.notes || undefined,
      createdAt: p.created_at,
    })),
    trips: (trips || []).map((tr) => ({
      id: tr.id,
      startDate: tr.start_date,
      endDate: tr.end_date,
      destination: tr.destination || undefined,
      createdAt: tr.created_at,
    })),
    familyMembers: (family || []).map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      relationship: f.relationship || undefined,
      photoUrl: f.photo_url || undefined,
      sharePeptides: f.share_peptides,
      shareDoses: f.share_doses,
      shareHealth: f.share_health,
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
      scheduled_at: onboarding.doseScheduledAt || new Date().toISOString(),
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
  if (error) {
    if (error.message.includes("PLAN_LIMIT_REACHED")) throw new PlanLimitError();
    throw error;
  }
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
    cost: vial.cost ? Number(vial.cost) : null,
  });
  if (error) {
    if (error.message.includes("PLAN_LIMIT_REACHED")) throw new PlanLimitError();
    throw error;
  }
  return loadAppData();
}

export async function removeVial(data: AppData, vialId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("vials").delete().eq("id", vialId);
  if (error) throw error;
  return loadAppData();
}

export async function addProvider(
  data: AppData,
  provider: {
    name: string;
    website?: string;
    socialNetwork?: string;
    socialHandle?: string;
    phone?: string;
    email?: string;
    brands?: string[];
    notes?: string;
  }
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("providers").insert({
    user_id: user.id,
    name: provider.name,
    website: provider.website?.trim() || null,
    social_network: provider.socialNetwork?.trim() || null,
    social_handle: provider.socialHandle?.trim() || null,
    phone: provider.phone?.trim() || null,
    email: provider.email?.trim() || null,
    brands: provider.brands && provider.brands.length ? provider.brands : [],
    notes: provider.notes?.trim() || null,
  });
  if (error) throw error;
  return loadAppData();
}

export async function removeProvider(data: AppData, providerId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("providers").delete().eq("id", providerId);
  if (error) throw error;
  return loadAppData();
}

export async function addTrip(
  data: AppData,
  trip: { startDate: string; endDate: string; destination?: string }
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("trips").insert({
    user_id: user.id,
    start_date: trip.startDate,
    end_date: trip.endDate,
    destination: trip.destination?.trim() || null,
  });
  if (error) throw error;
  return loadAppData();
}

export async function removeTrip(data: AppData, tripId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  if (error) throw error;
  return loadAppData();
}

const MAX_PROTOCOL_DOSES = 60;

export async function addProtocol(
  data: AppData,
  protocol: {
    peptideId: string;
    amount: string;
    unit: string;
    startDate: string; // yyyy-mm-dd
    time: string; // HH:mm
    intervalDays: number;
    weeks: number;
  }
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const [hours, minutes] = protocol.time.split(":").map(Number);
  const totalDays = protocol.weeks * 7;
  const count = Math.min(MAX_PROTOCOL_DOSES, Math.max(1, Math.ceil(totalDays / protocol.intervalDays)));

  const rows = Array.from({ length: count }, (_, i) => {
    const scheduled = new Date(`${protocol.startDate}T00:00:00`);
    scheduled.setDate(scheduled.getDate() + i * protocol.intervalDays);
    scheduled.setHours(hours || 0, minutes || 0, 0, 0);
    return {
      user_id: user.id,
      peptide_id: protocol.peptideId,
      amount: Number(protocol.amount),
      unit: protocol.unit,
      when_label: new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(scheduled),
      scheduled_at: scheduled.toISOString(),
      done: false,
    };
  });

  const { error } = await supabase.from("doses").insert(rows);
  if (error) throw error;
  return loadAppData();
}

export async function addDose(
  data: AppData,
  dose: Omit<Dose, "id" | "done" | "createdAt">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("doses").insert({
    user_id: user.id,
    peptide_id: dose.peptideId,
    amount: Number(dose.amount),
    unit: dose.unit,
    when_label: dose.when,
    scheduled_at: dose.scheduledAt,
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
  // health_logs guarda un registro por día — si ya existe uno (ej. con el peso
  // de hoy) y ahora solo se está agregando la hidratación, hay que conservar
  // los campos que no vinieron en esta llamada (si no, el upsert los borraría).
  const existing = data.healthLogs.find((h) => h.date === log.date);
  const { error } = await supabase.from("health_logs").upsert(
    {
      user_id: user.id,
      log_date: log.date,
      weight_kg: log.weightKg ?? existing?.weightKg ? Number(log.weightKg ?? existing?.weightKg) : null,
      hydration_ml:
        log.hydrationMl ?? existing?.hydrationMl ? Number(log.hydrationMl ?? existing?.hydrationMl) : null,
      exercise_min:
        log.exerciseMin ?? existing?.exerciseMin ? Number(log.exerciseMin ?? existing?.exerciseMin) : null,
      side_effect: log.sideEffect ?? existing?.sideEffect ?? null,
      notes: log.notes ?? existing?.notes ?? null,
    },
    { onConflict: "user_id,log_date" }
  );
  if (error) throw error;
  return loadAppData();
}

export async function addMeal(data: AppData, meal: Omit<Meal, "id" | "createdAt">): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("meals").insert({
    user_id: user.id,
    log_date: meal.date,
    description: meal.description,
    calories: meal.calories ? Number(meal.calories) : null,
  });
  if (error) throw error;
  return loadAppData();
}

export async function removeMeal(data: AppData, mealId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("meals").delete().eq("id", mealId);
  if (error) throw error;
  return loadAppData();
}

export async function addFamilyMember(
  data: AppData,
  member: Omit<FamilyMember, "id" | "photoUrl">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { data: myProfile } = await supabase.from("profiles").select("name").eq("id", user.id).single();
  const { error } = await supabase.from("family_members").insert({
    owner_id: user.id,
    name: member.name,
    email: member.email,
    relationship: member.relationship || null,
    share_peptides: member.sharePeptides,
    share_doses: member.shareDoses,
    share_health: member.shareHealth,
    owner_name: myProfile?.name || "",
  });
  if (error) throw error;
  return loadAppData();
}

export async function uploadFamilyPhoto(data: AppData, memberId: string, file: File): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${user.id}/family-${memberId}.${ext}`;
  const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = `${pub.publicUrl}?v=${Date.now()}`;
  const { error } = await supabase.from("family_members").update({ photo_url: url }).eq("id", memberId);
  if (error) throw error;
  return loadAppData();
}

export async function loadReceivedInvitations(): Promise<ReceivedInvitation[]> {
  const { supabase, user } = await requireUser();
  const { data: rows } = await supabase
    .from("family_members")
    .select("id, owner_id, owner_name, invite_status")
    .neq("owner_id", user.id);
  return (rows || []).map((r) => ({
    id: r.id,
    ownerId: r.owner_id,
    ownerName: r.owner_name || "—",
    inviteStatus: r.invite_status,
  }));
}

export async function updateFamilySharing(
  data: AppData,
  memberId: string,
  sharing: { sharePeptides: boolean; shareDoses: boolean; shareHealth: boolean }
): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("family_members")
    .update({
      share_peptides: sharing.sharePeptides,
      share_doses: sharing.shareDoses,
      share_health: sharing.shareHealth,
    })
    .eq("id", memberId);
  if (error) throw error;
  return loadAppData();
}

export async function respondToInvitation(
  invitationId: string,
  status: "accepted" | "revoked"
): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("family_members")
    .update({ invite_status: status })
    .eq("id", invitationId);
  if (error) throw error;
}

export async function loadSharedOwnerData(ownerId: string): Promise<SharedOwnerData> {
  const { supabase, user } = await requireUser();
  const { data: myProfile } = await supabase.from("profiles").select("email").eq("id", user.id).single();
  const { data: shareRow } = await supabase
    .from("family_members")
    .select("share_peptides, share_doses, share_health")
    .eq("owner_id", ownerId)
    .ilike("email", myProfile?.email || "")
    .maybeSingle();
  const sharePeptides = shareRow?.share_peptides ?? false;
  const shareDoses = shareRow?.share_doses ?? false;
  const shareHealth = shareRow?.share_health ?? false;

  const [{ data: ownerProfile }, { data: peptides }, { data: vials }, { data: doses }, { data: healthLogs }] =
    await Promise.all([
      supabase.from("profiles").select("name").eq("id", ownerId).single(),
      sharePeptides
        ? supabase.from("peptides").select("*").eq("user_id", ownerId).order("created_at", { ascending: true })
        : Promise.resolve({ data: [] as never[] }),
      sharePeptides
        ? supabase.from("vials").select("*").eq("user_id", ownerId).order("created_at", { ascending: true })
        : Promise.resolve({ data: [] as never[] }),
      shareDoses
        ? supabase.from("doses").select("*").eq("user_id", ownerId).order("scheduled_at", { ascending: false })
        : Promise.resolve({ data: [] as never[] }),
      shareHealth
        ? supabase
            .from("health_logs")
            .select("*")
            .eq("user_id", ownerId)
            .order("log_date", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [] as never[] }),
    ]);

  return {
    ownerName: ownerProfile?.name || "—",
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
    doses: (doses || []).slice(0, 10).map((d) => ({
      id: d.id,
      peptideId: d.peptide_id,
      amount: String(d.amount),
      unit: d.unit,
      when: d.when_label,
      scheduledAt: d.scheduled_at,
      done: d.done,
      injectionSite: d.injection_site || undefined,
      createdAt: d.created_at,
    })),
    healthLogs: (healthLogs || []).map((h) => ({
      id: h.id,
      date: h.log_date,
      weightKg: h.weight_kg != null ? String(h.weight_kg) : undefined,
      hydrationMl: h.hydration_ml != null ? String(h.hydration_ml) : undefined,
      exerciseMin: h.exercise_min != null ? String(h.exercise_min) : undefined,
      sideEffect: h.side_effect || undefined,
      notes: h.notes || undefined,
    })),
  };
}

export async function removeFamilyMember(data: AppData, memberId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("family_members").delete().eq("id", memberId);
  if (error) throw error;
  return loadAppData();
}

export function computeStreak(doses: Dose[]): number {
  const doneDays = new Set(
    doses.filter((d) => d.done).map((d) => new Date(d.scheduledAt).toDateString())
  );

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  // Si hoy todavía no se marcó ninguna dosis, no rompemos la racha aún —
  // empezamos a contar desde ayer (el usuario tiene hasta el fin del día).
  if (!doneDays.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (doneDays.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
