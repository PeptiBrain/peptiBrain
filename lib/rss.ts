import { BLOG_POSTS, localized } from "@/lib/blog/posts";

const BASE = "https://peptibrain.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Feed RSS 2.0 del blog en español (mercado principal, sin prefijo de idioma
// en la URL). Se ordena del más reciente al más viejo, igual que el índice.
export function buildBlogRssXml(): string {
  const sorted = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const items = sorted
    .map((post) => {
      const url = `${BASE}/blog/${post.slug}`;
      const title = escapeXml(localized(post.title, "es"));
      const description = escapeXml(localized(post.excerpt, "es"));
      const pubDate = new Date(`${post.publishedAt}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de PeptiBrain — Guías sobre péptidos</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Guías claras y educativas sobre péptidos: cómo reconstituir, cómo calcular dosis, semaglutida, BPC-157, GHK-Cu y más.</description>
    <language>es</language>
${items}
  </channel>
</rss>
`;
}
