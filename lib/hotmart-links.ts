export const HOTMART_CHECKOUT_LINKS = {
  premium: {
    monthly: "https://pay.hotmart.com/Q106628596T?off=m7yz3mfb",
    yearly: "https://pay.hotmart.com/Q106628596T?off=wca2xckm",
  },
  family: {
    monthly: "https://pay.hotmart.com/Q106628596T?off=iucld0wb",
    yearly: "https://pay.hotmart.com/Q106628596T?off=lgn3ozqy",
  },
} as const;

export function hotmartCheckoutUrl(plan: "premium" | "family", period: "monthly" | "yearly", email?: string) {
  const base = HOTMART_CHECKOUT_LINKS[plan][period];
  if (!email) return base;
  const url = new URL(base);
  url.searchParams.set("email", email);
  return url.toString();
}

// Oferta de fundadores — pago único "de por vida", código de oferta configurado en Hotmart
// como producto de pago ÚNICO (no suscripción). Sin esto configurado, el CTA de la oferta
// de por vida no aparece en el paywall (no rompe nada).
export function hotmartLifetimeCheckoutUrl(email?: string): string | null {
  const offerCode = process.env.NEXT_PUBLIC_HOTMART_OFFER_LIFETIME;
  if (!offerCode) return null;
  const base = `https://pay.hotmart.com/Q106628596T?off=${offerCode}`;
  if (!email) return base;
  const url = new URL(base);
  url.searchParams.set("email", email);
  return url.toString();
}
