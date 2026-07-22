import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Gemini (Google) vía su endpoint compatible con OpenAI — fiable y con plan gratis
// generoso. El modelo y la URL son env vars por si algún día se cambia de proveedor
// sin tocar código (cualquier API compatible-OpenAI funciona igual).
const AI_MODEL = process.env.ASSISTANT_AI_MODEL || "gemini-flash-latest";
const AI_BASE_URL =
  process.env.ASSISTANT_AI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const MAX_MESSAGES_PER_DAY = 20;
const MAX_TOKENS = 512;
// Kill-switch: tope de mensajes de TODOS los usuarios juntos, por día. Protege
// contra una factura sorpresa si el modelo pasa a ser de pago o el uso se dispara.
const MAX_GLOBAL_MESSAGES_PER_DAY = Number(process.env.ASSISTANT_GLOBAL_DAILY_LIMIT) || 500;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const SYSTEM_PROMPT = `Eres el Asistente de PeptiBrain, una app de seguimiento personal de péptidos y bienestar.
Reglas estrictas:
- NO eres médico ni das consejo médico. No diagnostiques, no receta dosis, no valides si algo es seguro para una persona.
- Puedes explicar en general qué es un péptido y ayudar a interpretar los datos que el usuario ya registró en su propia app (dosis, viales, peso, hidratación, efectos secundarios, comidas).
- Si preguntan algo médico ("¿es seguro para mí?", "¿qué dosis debo usar?"), responde que no puedes dar consejo médico y que consulten a un profesional de salud.
- Respuestas cortas y claras, en el idioma del usuario. Nunca inventes datos que el usuario no registró.`;

async function alertOwnerOnce(admin: ReturnType<typeof createAdminClient>, date: string, count: number) {
  const resendKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_ALERT_EMAIL;
  if (!resendKey || !ownerEmail) return; // sin esto configurado, solo queda registrado en la tabla

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PeptiBrain <hello@peptibrain.com>",
        to: ownerEmail,
        subject: "⚠️ Asistente IA pausado — se llegó al límite diario",
        text: `El Asistente de PeptiBrain llegó a ${count} mensajes hoy (${date}), el tope configurado. Se pausó automáticamente para evitar un gasto inesperado. Súbelo en ASSISTANT_GLOBAL_DAILY_LIMIT si quieres permitir más, o revisa tu saldo en OpenRouter.`,
      }),
    });
  } catch {
    // si falla el envío del aviso, no bloqueamos la respuesta al usuario por esto
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (!profile || profile.plan === "free") {
    return NextResponse.json({ error: "premium_required" }, { status: 403 });
  }

  const { message, context } = (await request.json()) as { message?: string; context?: string };
  if (!message || !message.trim()) {
    return NextResponse.json({ error: "missing_message" }, { status: 400 });
  }

  const admin = createAdminClient();
  const date = todayIso();

  const [{ data: usage }, { data: globalUsage }] = await Promise.all([
    admin
      .from("assistant_usage")
      .select("message_count")
      .eq("user_id", user.id)
      .eq("usage_date", date)
      .maybeSingle(),
    admin.from("assistant_global_usage").select("message_count, alert_sent").eq("usage_date", date).maybeSingle(),
  ]);

  const globalCount = globalUsage?.message_count || 0;
  if (globalCount >= MAX_GLOBAL_MESSAGES_PER_DAY) {
    if (!globalUsage?.alert_sent) {
      await alertOwnerOnce(admin, date, globalCount);
      await admin
        .from("assistant_global_usage")
        .upsert({ usage_date: date, message_count: globalCount, alert_sent: true }, { onConflict: "usage_date" });
    }
    return NextResponse.json({ error: "service_paused" }, { status: 503 });
  }

  if ((usage?.message_count || 0) >= MAX_MESSAGES_PER_DAY) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "assistant_not_configured" }, { status: 503 });
  }

  const userMessage = context
    ? `Contexto de mis datos registrados:\n${context.slice(0, 2000)}\n\nMi pregunta: ${message.trim()}`
    : message.trim();

  let reply: string;
  try {
    const res = await fetch(AI_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "assistant_error" }, { status: 502 });
    }
    const body = await res.json();
    reply = body.choices?.[0]?.message?.content || "";
  } catch {
    return NextResponse.json({ error: "assistant_error" }, { status: 502 });
  }

  await Promise.all([
    admin
      .from("assistant_usage")
      .upsert(
        { user_id: user.id, usage_date: date, message_count: (usage?.message_count || 0) + 1 },
        { onConflict: "user_id,usage_date" }
      ),
    admin
      .from("assistant_global_usage")
      .upsert({ usage_date: date, message_count: globalCount + 1 }, { onConflict: "usage_date" }),
  ]);

  return NextResponse.json({ reply, remaining: MAX_MESSAGES_PER_DAY - ((usage?.message_count || 0) + 1) });
}
