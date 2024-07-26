import ClientProvider from "@/contexts/ClientProvider";
import { cn } from "@/lib/utils";
import { getAuthActions } from "@/store/auth-store";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import "./tree.css";

import Notify from "@/components/ui/notify";
import { Toaster } from "@/components/ui/toaster";
import HydrationProvider from "@/contexts/HydrationProvider";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#FFFFFF",
};

const timeZone = "Asia/Bangkok";

export default async function RootLayout({ children, modal, params: { locale } }: { children: React.ReactNode; modal: React.ReactNode; params: { locale: string } }) {
  const { init } = getAuthActions();

  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  init();

  return (
    <html lang={locale}>
      <body className={cn("grid h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <HydrationProvider userAgent={userAgent}>
          <ClientProvider>
            <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
              {children}
              {modal}
            </NextIntlClientProvider>
          </ClientProvider>
        </HydrationProvider>
        <Toaster />
        <Notify />
      </body>
    </html>
  );
}
