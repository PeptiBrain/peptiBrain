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
// 512 cortaba las respuestas a mitad de frase (bug #10 del QA). 1024 es el
// tope por defecto del sistema: suficiente para una respuesta completa sin
// abrir la puerta a respuestas kilométricas (que además cuestan y se leen mal
// en móvil). Si aun así se corta, se avisa al usuario en vez de disimularlo.
const MAX_TOKENS = 1024;
// Kill-switch: tope de mensajes de TODOS los usuarios juntos, por día. Protege
// contra una factura sorpresa si el modelo pasa a ser de pago o el uso se dispara.
const MAX_GLOBAL_MESSAGES_PER_DAY = Number(process.env.ASSISTANT_GLOBAL_DAILY_LIMIT) || 500;

// Precio del modelo en USD por cada millón de tokens, para calcular el costo
// REAL de cada llamada (antes el panel mostraba un 0 fijo escrito a mano).
// El modelo de hoy (gemini-flash-latest) es GRATIS, así que por defecto es 0 y
// el panel dirá 0 € — que es la verdad. Si algún día se cambia a un modelo de
// pago, se ponen estas dos variables en Vercel y el gasto empieza a contarse
// solo, sin tocar código ni esperar a la factura.
const AI_PRICE_INPUT_PER_1M = Number(process.env.AI_PRICE_INPUT_PER_1M) || 0;
const AI_PRICE_OUTPUT_PER_1M = Number(process.env.AI_PRICE_OUTPUT_PER_1M) || 0;

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
        text: `El Asistente de PeptiBrain llegó a ${count} mensajes hoy (${date}), el tope configurado. Se pausó automáticamente para evitar un gasto inesperado. Súbelo en ASSISTANT_GLOBAL_DAILY_LIMIT si quieres permitir más, o revisa tu cuota en Google AI Studio (Gemini).`,
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
  let truncated = false;
  let inputTokens = 0;
  let outputTokens = 0;
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
    // Si el modelo se quedó sin espacio, decirlo: una respuesta cortada a
    // media frase sin explicación parece un fallo de la app.
    if (body.choices?.[0]?.finish_reason === "length" && reply) {
      truncated = true;
    }
    inputTokens = Number(body.usage?.prompt_tokens) || 0;
    outputTokens = Number(body.usage?.completion_tokens) || 0;
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

  // Registra el costo REAL de esta llamada para el panel. Como el de abajo,
  // va aparte y tolera fallos: si la migración 0044 aún no se corrió, NO debe
  // romper la respuesta que el usuario ya está esperando.
  try {
    const costUsd =
      (inputTokens / 1_000_000) * AI_PRICE_INPUT_PER_1M +
      (outputTokens / 1_000_000) * AI_PRICE_OUTPUT_PER_1M;
    await admin.from("ai_calls").insert({
      user_id: user.id,
      feature: "assistant",
      model: AI_MODEL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: costUsd,
    });
  } catch {
    // medir el costo nunca puede romper la función que el usuario pagó
  }

  // Registra la pregunta para que el dueño vea qué duda la gente (solo lectura admin).
  // Se guarda solo el texto de la pregunta, no el contexto de datos personales. Va
  // aparte y tolera fallos: si la tabla aún no existe (migración sin correr), NO debe
  // romper la respuesta del asistente que el usuario ya está esperando.
  try {
    await admin
      .from("assistant_questions")
      .insert({ user_id: user.id, plan: profile.plan, question: message.trim().slice(0, 500) });
  } catch {
    // el registro es "nice to have"; nunca bloquea la respuesta al usuario
  }

  return NextResponse.json({
    reply,
    truncated,
    remaining: MAX_MESSAGES_PER_DAY - ((usage?.message_count || 0) + 1),
  });
}
