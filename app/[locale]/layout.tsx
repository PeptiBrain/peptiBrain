import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MixpanelProvider } from "@/components/app/MixpanelProvider";
import { ServiceWorkerRegister } from "@/components/app/ServiceWorkerRegister";
import { CookieConsentBanner } from "@/components/app/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/app/GoogleAnalytics";
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

export const metadata: Metadata = {
  title: "PeptiBrain — Tu diario de péptidos y bienestar",
  description:
    "Registra tus dosis, viales y bienestar en un solo lugar. Nunca pierdas el hilo de tu protocolo, y compártelo con quien tú elijas.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PeptiBrain",
  },
};

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
  const gaId = await getPublicSetting("ga_measurement_id");

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
              "try{if(localStorage.getItem('peptibrain_theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <ServiceWorkerRegister />
        <NextIntlClientProvider messages={messages}>
          <MixpanelProvider>{children}</MixpanelProvider>
          <CookieConsentBanner />
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
