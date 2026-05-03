import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Golden Energy | Solar Energy Solutions in Egypt",
    template: "%s | Golden Energy",
  },

  description:
    "Golden Energy provides professional solar energy solutions, renewable energy systems, installation services, and sustainable power solutions for homes, businesses, and projects in Egypt.",

  keywords: [
    "Golden Energy",
    "solar energy Egypt",
    "solar panels Egypt",
    "renewable energy",
    "solar installation",
    "solar power systems",
    "energy solutions",
    "clean energy",
    "sustainable energy",
    "solar company in Egypt",
    "إنتاج الطاقة الشمسية",
    "الطاقة الشمسية في مصر",
  ],

  authors: [{ name: "Golden Energy" }],
  creator: "Golden Energy",
  publisher: "Golden Energy",

  applicationName: "Golden Energy",

  category: "Renewable Energy",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: siteUrl,
    siteName: "Golden Energy",
    title: "Golden Energy | Solar Energy Solutions in Egypt",
    description:
      "Professional solar energy solutions, renewable energy systems, installation services, and sustainable power solutions in Egypt.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Golden Energy solar energy solutions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Golden Energy | Solar Energy Solutions in Egypt",
    description:
      "Professional solar energy solutions, renewable energy systems, installation services, and sustainable power solutions in Egypt.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },

  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5b400",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="en" dir="ltr">
        <body>{children}</body>
      </html>
    </LanguageProvider>
  );
}
