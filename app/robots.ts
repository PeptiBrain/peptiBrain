import type { MetadataRoute } from "next";

const BASE_URL = "https://peptibrain.com";

const DISALLOW = [
  "/app",
  "/app/",
  "/api/",
  "/onboarding",
  "/restablecer-password",
  "/en/app",
  "/en/app/",
  "/en/onboarding",
  "/en/restablecer-password",
];

// Bots de IA declarados explícitamente: autorizamos que indexen/entrenen con
// el contenido público del blog (misma regla que ya aplica a "*" vía allow:"/"),
// apostando a aparecer citados en respuestas de ChatGPT/Claude/Perplexity.
const AI_BOTS = ["GPTBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
