// Conector con la API de Hotmart para traer las VENTAS REALES al panel (los
// números de "Finanzas" del panel son estimados; estos son los de verdad).
// El token de acceso se pide UNA vez y se reutiliza hasta que caduca — el endpoint
// de token de Hotmart limita fuerte las peticiones, así que jamás se pide por cada
// llamada. Solo lee el servidor (credenciales = secretos en env vars).

const TOKEN_URL = "https://api-sec-vlc.hotmart.com/security/oauth/token";
const SALES_URL = "https://developers.hotmart.com/payments/api/v1/sales/history";

let cachedToken: { token: string; expiresAt: number } | null = null;

function hotmartConfigured(): boolean {
  return Boolean(
    process.env.HOTMART_CLIENT_ID && process.env.HOTMART_CLIENT_SECRET && process.env.HOTMART_BASIC_TOKEN
  );
}

function peptibrainProductIds(): Set<string> {
  const raw = process.env.HOTMART_PRODUCT_IDS || "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

async function getToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;
  if (!hotmartConfigured()) return null;

  const clientId = process.env.HOTMART_CLIENT_ID!;
  const clientSecret = process.env.HOTMART_CLIENT_SECRET!;
  const basic = process.env.HOTMART_BASIC_TOKEN!; // solo la parte base64, sin "Basic "

  try {
    const res = await fetch(
      `${TOKEN_URL}?grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`,
      { method: "POST", headers: { Authorization: `Basic ${basic}` } }
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!body.access_token) return null;
    // expires_in viene en segundos; si no llega, asumimos 1h conservador.
    const ttlMs = (body.expires_in && body.expires_in > 0 ? body.expires_in : 3600) * 1000;
    cachedToken = { token: body.access_token, expiresAt: Date.now() + ttlMs };
    return body.access_token;
  } catch {
    return null;
  }
}

export type HotmartSummary = {
  configured: boolean;
  ok: boolean;
  currency: string;
  revenueTotal: number;
  revenueThisMonth: number;
  salesCount: number;
  refundsCount: number;
  activeSubscriptions: number | null;
};

const APPROVED = new Set(["APPROVED", "COMPLETE"]);
const REFUNDED = new Set(["REFUNDED", "CHARGEBACK", "DISPUTE"]);

// Trae las ventas de los productos de PeptiBrain y las agrega. Recorre varias
// páginas con tope, para no colgarse si hay muchísimas transacciones.
export async function getHotmartSummary(): Promise<HotmartSummary> {
  const empty: HotmartSummary = {
    configured: hotmartConfigured(),
    ok: false,
    currency: "EUR",
    revenueTotal: 0,
    revenueThisMonth: 0,
    salesCount: 0,
    refundsCount: 0,
    activeSubscriptions: null,
  };
  const token = await getToken();
  if (!token) return empty;

  const productIds = peptibrainProductIds();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let revenueTotal = 0;
  let revenueThisMonth = 0;
  let salesCount = 0;
  let refundsCount = 0;
  let currency = "EUR";
  let pageToken: string | undefined;
  let pages = 0;

  try {
    do {
      const url = new URL(SALES_URL);
      url.searchParams.set("max_results", "100");
      if (pageToken) url.searchParams.set("page_token", pageToken);
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return { ...empty, ok: false };
      const body = (await res.json()) as {
        items?: Array<{
          product?: { id?: number | string };
          purchase?: {
            status?: string;
            order_date?: number;
            approved_date?: number;
            price?: { value?: number; currency_code?: string };
          };
        }>;
        page_info?: { next_page_token?: string };
      };

      for (const it of body.items || []) {
        const pid = it.product?.id != null ? String(it.product.id) : "";
        if (productIds.size > 0 && !productIds.has(pid)) continue;
        const status = (it.purchase?.status || "").toUpperCase();
        const value = Number(it.purchase?.price?.value) || 0;
        if (it.purchase?.price?.currency_code) currency = it.purchase.price.currency_code;
        const when = it.purchase?.approved_date || it.purchase?.order_date || 0;

        if (APPROVED.has(status)) {
          revenueTotal += value;
          salesCount += 1;
          if (when >= monthStart) revenueThisMonth += value;
        } else if (REFUNDED.has(status)) {
          refundsCount += 1;
        }
      }

      pageToken = body.page_info?.next_page_token;
      pages += 1;
    } while (pageToken && pages < 20);

    return {
      configured: true,
      ok: true,
      currency,
      revenueTotal: Math.round(revenueTotal * 100) / 100,
      revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
      salesCount,
      refundsCount,
      activeSubscriptions: null,
    };
  } catch {
    return { ...empty, ok: false };
  }
}
