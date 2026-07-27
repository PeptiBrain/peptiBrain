import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MixpanelProvider } from "@/components/app/MixpanelProvider";
import { ServiceWorkerRegister } from "@/components/app/ServiceWorkerRegister";
import { ThemeScope } from "@/components/app/ThemeScope";
import { CookieConsentBanner } from "@/components/app/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/app/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/app/MicrosoftClarity";
import { getPublicSetting } from "@/lib/app-settings";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// El título y la descripción eran fijos en español, así que /en/ se anunciaba
// en español en la pestaña del navegador, en Google y al compartir el enlace
// (bug #62). Ahora dependen del idioma de la página.
const SITE_META = {
  es: {
    title: "PeptiBrain — GLP-1, péptidos y TRT en un solo lugar",
    desc: "Registra tus dosis de GLP-1, péptidos y terapia de testosterona (TRT), tus viales y tu bienestar en un solo lugar. Nunca pierdas el hilo de tu protocolo, y compártelo con quien tú elijas.",
  },
  en: {
    title: "PeptiBrain — GLP-1, peptides and TRT in one place",
    desc: "Track your GLP-1, peptide and testosterone (TRT) doses, your vials and your wellbeing in one place. Never lose track of your protocol, and share it with whoever you choose.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = SITE_META[locale as keyof typeof SITE_META] || SITE_META.es;
  const url = locale === "en" ? "https://peptibrain.com/en" : "https://peptibrain.com";
  return {
    metadataBase: new URL("https://peptibrain.com"),
    title: meta.title,
    description: meta.desc,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "PeptiBrain",
    },
    // Vista previa al compartir enlaces (la imagen la aporta app/opengraph-image.tsx).
    openGraph: {
      type: "website",
      siteName: "PeptiBrain",
      title: meta.title,
      description: meta.desc,
      url,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.desc,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const [gaId, clarityId] = await Promise.all([
    getPublicSetting("ga_measurement_id"),
    getPublicSetting("clarity_project_id"),
  ]);

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#FAFBFA" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=location.pathname;var inApp=/^\\/(en\\/)?app(\\/|$)/.test(p);if(inApp&&localStorage.getItem('peptibrain_theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <ServiceWorkerRegister />
        <NextIntlClientProvider messages={messages}>
          <ThemeScope />
          <MixpanelProvider>{children}</MixpanelProvider>
          <CookieConsentBanner />
          {gaId && <GoogleAnalytics gaId={gaId} />}
          {clarityId && <MicrosoftClarity clarityId={clarityId} />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
