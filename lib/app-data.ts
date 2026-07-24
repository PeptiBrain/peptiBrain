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

export type VialShare = { memberId: string; percent: number };

export type Vial = {
  id: string;
  peptideId: string;
  amount: string;
  unit: string;
  bacWater: string;
  syringeType?: SyringeType;
  cost?: string;
  createdAt: string;
  shares: VialShare[]; // reparto con familiares — puede ser con varios a la vez
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
  forMemberId?: string; // si el vial es compartido: para quién fue esta dosis (undefined = para mí)
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

export type ProgressPhoto = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  storagePath: string;
  url: string; // URL firmada, válida por 1 hora desde loadAppData()
  note?: string;
  createdAt: string;
};

export type LabResult = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  marker: string;
  value: string;
  unit?: string;
  note?: string;
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
  phone?: string;
  phoneCode?: string;
  relationship?: FamilyRelationship;
  photoUrl?: string;
  sharePeptides: boolean;
  shareDoses: boolean;
  shareHealth: boolean;
  sharedPeptideIds?: string[]; // undefined/vacío = comparte todos los péptidos
};

export type ReceivedInvitation = {
  id: string;
  ownerId: string;
  ownerName: string;
  inviteStatus: "pending" | "accepted" | "revoked";
};

export type SharedOwnerData = {
  ownerId: string;
  ownerName: string;
  peptides: Peptide[];
  vials: Vial[];
  doses: Dose[];
  healthLogs: HealthLog[];
  meals: Meal[];
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
  progressPhotos: ProgressPhoto[];
  labResults: LabResult[];
  providers: Provider[];
  trips: Trip[];
  familyMembers: FamilyMember[];
  plan: "free" | "premium" | "family";
  extraFamilySeats: number;
};

const EMPTY: AppData = {
  peptides: [],
  trips: [],
  vials: [],
  doses: [],
  healthLogs: [],
  meals: [],
  progressPhotos: [],
  labResults: [],
  providers: [],
  familyMembers: [],
  plan: "free",
  extraFamilySeats: 0,
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
    { data: progressPhotos },
    { data: labResults },
    { data: providers },
    { data: trips },
    { data: family },
    { data: vialShares },
  ] = await Promise.all([
    supabase.from("peptides").select("*").order("created_at", { ascending: true }),
    supabase.from("vials").select("*").order("created_at", { ascending: true }),
    supabase.from("doses").select("*").order("created_at", { ascending: true }),
    supabase.from("health_logs").select("*").order("log_date", { ascending: false }),
    supabase.from("meals").select("*").order("log_date", { ascending: false }),
    supabase.from("progress_photos").select("*").order("log_date", { ascending: false }),
    supabase.from("lab_results").select("*").order("log_date", { ascending: false }),
    supabase.from("providers").select("*").order("created_at", { ascending: true }),
    supabase.from("trips").select("*").order("start_date", { ascending: false }),
    supabase.from("family_members").select("*").order("created_at", { ascending: true }),
    supabase.from("vial_shares").select("*"),
  ]);

  // Bucket privado: hay que firmar cada URL (expira en 1h) — a diferencia de
  // avatars, que es público y usa getPublicUrl.
  const photoPaths = (progressPhotos || []).map((p) => p.storage_path);
  const { data: signedPhotos } = photoPaths.length
    ? await supabase.storage.from("progress-photos").createSignedUrls(photoPaths, 3600)
    : { data: [] as { path: string | null; signedUrl: string }[] | null };
  const signedUrlByPath = new Map((signedPhotos || []).map((s) => [s.path, s.signedUrl]));

  const { count: extraFamilySeats } = await supabase
    .from("family_extra_seats")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("status", "active");

  const sharesByVial = new Map<string, VialShare[]>();
  for (const s of vialShares || []) {
    const list = sharesByVial.get(s.vial_id) || [];
    list.push({ memberId: s.member_id, percent: Number(s.percent) });
    sharesByVial.set(s.vial_id, list);
  }

  return {
    plan: (profile?.plan as AppData["plan"]) || "free",
    extraFamilySeats: extraFamilySeats || 0,
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
      shares: sharesByVial.get(v.id) || [],
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
      forMemberId: d.for_member_id || undefined,
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
    progressPhotos: (progressPhotos || []).map((p) => ({
      id: p.id,
      date: p.log_date,
      storagePath: p.storage_path,
      url: signedUrlByPath.get(p.storage_path) || "",
      note: p.note || undefined,
      createdAt: p.created_at,
    })),
    labResults: (labResults || []).map((l) => ({
      id: l.id,
      date: l.log_date,
      marker: l.marker,
      value: String(l.value),
      unit: l.unit || undefined,
      note: l.note || undefined,
      createdAt: l.created_at,
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
      phone: f.phone || undefined,
      phoneCode: f.phone_code || undefined,
      relationship: f.relationship || undefined,
      photoUrl: f.photo_url || undefined,
      sharePeptides: f.share_peptides,
      shareDoses: f.share_doses,
      shareHealth: f.share_health,
      sharedPeptideIds: Array.isArray(f.shared_peptide_ids) && f.shared_peptide_ids.length > 0 ? f.shared_peptide_ids : undefined,
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
  vial: Omit<Vial, "id" | "createdAt" | "shares">
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

// Un vial se puede repartir con varios familiares a la vez, cada uno con su %.
export async function addVialShare(
  data: AppData,
  vialId: string,
  memberId: string,
  percent: number
): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("vial_shares")
    .upsert({ vial_id: vialId, member_id: memberId, percent }, { onConflict: "vial_id,member_id" });
  if (error) throw error;
  return loadAppData();
}

export async function removeVialShare(data: AppData, vialId: string, memberId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("vial_shares")
    .delete()
    .eq("vial_id", vialId)
    .eq("member_id", memberId);
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
    for_member_id: dose.forMemberId || null,
  });
  if (error) throw error;
  return loadAppData();
}

export async function markDoseDone(data: AppData, doseId: string, injectionSite?: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("doses")
    .update({ done: true, ...(injectionSite ? { injection_site: injectionSite } : {}) })
    .eq("id", doseId);
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

export async function addProgressPhoto(
  data: AppData,
  photo: { date: string; file: File; note?: string }
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const ext = (photo.file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${user.id}/${photo.date}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from("progress-photos").upload(path, photo.file);
  if (upErr) throw upErr;
  const { error } = await supabase.from("progress_photos").insert({
    user_id: user.id,
    log_date: photo.date,
    storage_path: path,
    note: photo.note || null,
  });
  if (error) throw error;
  return loadAppData();
}

export async function removeProgressPhoto(data: AppData, photoId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const photo = data.progressPhotos.find((p) => p.id === photoId);
  const { error } = await supabase.from("progress_photos").delete().eq("id", photoId);
  if (error) throw error;
  if (photo) await supabase.storage.from("progress-photos").remove([photo.storagePath]);
  return loadAppData();
}

export async function addLabResult(
  data: AppData,
  result: Omit<LabResult, "id" | "createdAt">
): Promise<AppData> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("lab_results").insert({
    user_id: user.id,
    log_date: result.date,
    marker: result.marker,
    value: Number(result.value),
    unit: result.unit || null,
    note: result.note || null,
  });
  if (error) throw error;
  return loadAppData();
}

export async function removeLabResult(data: AppData, resultId: string): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("lab_results").delete().eq("id", resultId);
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
    phone: member.phone?.trim() || null,
    phone_code: member.phone?.trim() ? member.phoneCode || null : null,
    relationship: member.relationship || null,
    share_peptides: member.sharePeptides,
    share_doses: member.shareDoses,
    share_health: member.shareHealth,
    owner_name: myProfile?.name || "",
  });
  if (error) throw error;
  return loadAppData();
}

const RELATIONSHIP_ALIASES: Record<string, FamilyRelationship> = {
  pareja: "pareja", esposa: "pareja", esposo: "pareja", marido: "pareja", mujer: "pareja", partner: "pareja",
  hermano: "hermano", hermana: "hermano", sibling: "hermano",
  hijo: "hijo", hija: "hijo", child: "hijo",
  padre: "padre_madre", madre: "padre_madre", parent: "padre_madre",
  primo: "primo", prima: "primo", cousin: "primo",
  tio: "tio", tia: "tio", uncle: "tio", aunt: "tio",
  sobrino: "sobrino", sobrina: "sobrino", nephew: "sobrino", niece: "sobrino",
  cunado: "cunado", cunada: "cunado",
  amigo: "amigo", amiga: "amigo", friend: "amigo",
  vecino: "vecino", vecina: "vecino", neighbor: "vecino",
};

function normalizeRelationship(raw?: string): FamilyRelationship {
  if (!raw) return "otro";
  const key = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return RELATIONSHIP_ALIASES[key] || "otro";
}

export type FamilyImportRow = { name: string; email: string; phone?: string; relationship?: string };
export type FamilyImportResult = { data: AppData; imported: number; skipped: number };

// Agrega varios familiares/clientes de golpe (caso empresa: dar de alta muchos
// clientes a la vez). Duplicados por correo se saltan solos, no rompen el resto.
export async function importFamilyMembers(
  data: AppData,
  rows: FamilyImportRow[]
): Promise<FamilyImportResult> {
  const { supabase, user } = await requireUser();
  const { data: myProfile } = await supabase.from("profiles").select("name").eq("id", user.id).single();

  const payload = rows.map((r) => ({
    owner_id: user.id,
    name: r.name,
    email: r.email,
    phone: r.phone || null,
    phone_code: r.phone ? "+34" : null,
    relationship: normalizeRelationship(r.relationship),
    share_peptides: true,
    share_doses: true,
    share_health: false,
    owner_name: myProfile?.name || "",
  }));

  const { data: inserted, error } = await supabase
    .from("family_members")
    .upsert(payload, { onConflict: "owner_id,email", ignoreDuplicates: true })
    .select("id");
  if (error) throw error;

  const next = await loadAppData();
  return { data: next, imported: inserted?.length || 0, skipped: rows.length - (inserted?.length || 0) };
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

// Trae los datos que cada familiar que te invitó (y aceptaste) decidió compartir contigo.
export async function loadFamilySharedData(): Promise<SharedOwnerData[]> {
  const invitations = await loadReceivedInvitations();
  const accepted = invitations.filter((i) => i.inviteStatus === "accepted");
  return Promise.all(accepted.map((i) => loadSharedOwnerData(i.ownerId)));
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

export async function updateFamilySharedPeptides(
  data: AppData,
  memberId: string,
  peptideIds: string[] | null
): Promise<AppData> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("family_members")
    .update({ shared_peptide_ids: peptideIds && peptideIds.length > 0 ? peptideIds : null })
    .eq("id", memberId);
  if (error) throw error;
  return loadAppData();
}

export class SeatLimitError extends Error {
  constructor(message = "SEAT_LIMIT_REACHED") {
    super(message);
    this.name = "SeatLimitError";
  }
}

export async function respondToInvitation(
  invitationId: string,
  status: "accepted" | "revoked"
): Promise<void> {
  const res = await fetch("/api/family/membership", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: status === "accepted" ? "accept" : "decline", memberId: invitationId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (body?.error === "seat_limit_reached") throw new SeatLimitError();
    throw new Error(body?.error || "request_failed");
  }
}

export async function loadSharedOwnerData(ownerId: string): Promise<SharedOwnerData> {
  const { supabase, user } = await requireUser();
  const { data: myProfile } = await supabase.from("profiles").select("email").eq("id", user.id).single();
  const { data: shareRow } = await supabase
    .from("family_members")
    .select("share_peptides, share_doses, share_health, shared_peptide_ids")
    .eq("owner_id", ownerId)
    .ilike("email", myProfile?.email || "")
    .maybeSingle();
  const sharePeptides = shareRow?.share_peptides ?? false;
  const shareDoses = shareRow?.share_doses ?? false;
  const shareHealth = shareRow?.share_health ?? false;
  const restrictedIds: string[] | null =
    Array.isArray(shareRow?.shared_peptide_ids) && shareRow.shared_peptide_ids.length > 0
      ? shareRow.shared_peptide_ids
      : null;

  const [{ data: ownerProfile }, { data: peptides }, { data: vials }, { data: doses }, { data: healthLogs }, { data: meals }] =
    await Promise.all([
      supabase.from("profiles").select("name").eq("id", ownerId).single(),
      sharePeptides
        ? (() => {
            let q = supabase.from("peptides").select("*").eq("user_id", ownerId);
            if (restrictedIds) q = q.in("id", restrictedIds);
            return q.order("created_at", { ascending: true });
          })()
        : Promise.resolve({ data: [] as never[] }),
      sharePeptides
        ? (() => {
            let q = supabase.from("vials").select("*").eq("user_id", ownerId);
            if (restrictedIds) q = q.in("peptide_id", restrictedIds);
            return q.order("created_at", { ascending: true });
          })()
        : Promise.resolve({ data: [] as never[] }),
      shareDoses
        ? (() => {
            let q = supabase.from("doses").select("*").eq("user_id", ownerId);
            if (restrictedIds) q = q.in("peptide_id", restrictedIds);
            return q.order("scheduled_at", { ascending: false });
          })()
        : Promise.resolve({ data: [] as never[] }),
      shareHealth
        ? supabase
            .from("health_logs")
            .select("*")
            .eq("user_id", ownerId)
            .order("log_date", { ascending: false })
        : Promise.resolve({ data: [] as never[] }),
      shareHealth
        ? supabase.from("meals").select("*").eq("user_id", ownerId).order("log_date", { ascending: false })
        : Promise.resolve({ data: [] as never[] }),
    ]);

  return {
    ownerId,
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
      cost: v.cost != null ? String(v.cost) : undefined,
      createdAt: v.created_at,
      shares: [],
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
  };
}

export async function removeFamilyMember(data: AppData, memberId: string): Promise<AppData> {
  const res = await fetch("/api/family/membership", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "remove", memberId }),
  });
  if (!res.ok) throw new Error("request_failed");
  return loadAppData();
}

// Un invitado que ya aceptó puede salirse de la familia de otra persona
// (pierde el asiento Premium que había heredado, si lo tenía).
export async function leaveFamily(invitationId: string): Promise<void> {
  const res = await fetch("/api/family/membership", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "leave", memberId: invitationId }),
  });
  if (!res.ok) throw new Error("request_failed");
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
