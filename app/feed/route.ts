import { buildBlogRssXml } from "@/lib/rss";

// Alias de /rss.xml — algunos lectores RSS y checklists de SEO prueban esta
// ruta por convención (WordPress la usa por defecto). Mismo feed, mismo contenido.
export async function GET() {
  return new Response(buildBlogRssXml(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
