import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Space_Mono } from "next/font/google";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import {
  APPLE_TOUCH_ICON,
  FAVICON_ICO,
  FAVICON_PNG,
  FAVICON_SVG,
} from "@/lib/brand";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "MURMUR — Anonymous Community Intelligence",
  description:
    "Organisation-scoped anonymous feeds. Where the real talk lives.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: FAVICON_ICO, sizes: "32x32" },
      { url: FAVICON_SVG, type: "image/svg+xml" },
      { url: FAVICON_PNG, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: APPLE_TOUCH_ICON, sizes: "180x180", type: "image/png" }],
    shortcut: FAVICON_ICO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebas.variable} ${dmSans.variable} ${spaceMono.variable} h-full`}
    >
      <head>
        <ThemeScript />
        <link rel="icon" href={FAVICON_ICO} sizes="32x32" />
        <link rel="icon" href={FAVICON_SVG} type="image/svg+xml" />
        <link rel="icon" href={FAVICON_PNG} type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON} sizes="180x180" />
        <link rel="shortcut icon" href={FAVICON_ICO} />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-canvas text-ink">
        <ThemeProvider>
          {children}
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
