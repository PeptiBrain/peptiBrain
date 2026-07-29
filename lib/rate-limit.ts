import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Protección anti-abuso: máximo 180 peticiones por minuto por IP. Si se excede,
// esa IP queda bloqueada 5 minutos (no solo hasta que pase la ventana de 60s) —
// evita que alguien reintente justo al segundo siguiente.
//
// El límite anterior (60/min) era demasiado ajustado para uso real: cada
// navegación entre páginas cuenta como petición, y Next.js precarga en segundo
// plano los enlaces visibles en pantalla (nav, footer, tarjetas del blog,
// enlaces cruzados de herramientas) — navegar con normalidad por varias
// páginas seguidas ya podía acumular 60 peticiones y bloquear a un usuario
// real (bug reportado: 429 en /compatibilidad tras navegar un rato).
const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 180;
const BLOCK_SECONDS = 5 * 60;

// Sin Upstash configurado, el rate limit simplemente no se aplica (no rompe nada,
// igual que el resto de integraciones opcionales de este proyecto — ver Resend/Hotmart).
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
      prefix: "peptibrain:ratelimit",
      analytics: false,
    })
  : null;

export type RateLimitResult = { blocked: boolean; retryAfterSeconds?: number };

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (!redis || !ratelimit) return { blocked: false };

  const blockKey = `peptibrain:blocked:${ip}`;
  const blockedTtl = await redis.ttl(blockKey);
  if (blockedTtl && blockedTtl > 0) {
    return { blocked: true, retryAfterSeconds: blockedTtl };
  }

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    await redis.set(blockKey, "1", { ex: BLOCK_SECONDS });
    return { blocked: true, retryAfterSeconds: BLOCK_SECONDS };
  }

  return { blocked: false };
}
