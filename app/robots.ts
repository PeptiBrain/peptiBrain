import type { MetadataRoute } from "next";

const BASE_URL = "https://peptibrain.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/app",
        "/app/",
        "/api/",
        "/onboarding",
        "/restablecer-password",
        "/en/app",
        "/en/app/",
        "/en/onboarding",
        "/en/restablecer-password",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
