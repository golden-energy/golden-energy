// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.goldenenerggy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Golden Energy | Electrical Supply & Installation in Egypt",
    template: "%s | Golden Energy",
  },

  description:
    "شركة Golden Energy في مصر تقدم توريدات كهربائية عالية الجودة، تصميم الشبكات الكهربائية، تركيب وتشغيل الأنظمة، وصيانة دورية للمصانع والمباني التجارية. حلول كهربائية موثوقة ومتطورة لكل احتياجات الطاقة.",

  authors: [{ name: "Golden Energy" }],
  creator: "Golden Energy",
  publisher: "Golden Energy",
  applicationName: "Golden Energy",
  category: "Electrical Supply & Services",

  keywords: [
    "Golden Energy",
    "electrical supply Egypt",
    "electrical network design",
    "installation & commissioning",
    "maintenance & support",
    "low & medium voltage solutions",
    "توريدات كهربائية",
    "تركيب كهرباء",
    "صيانة كهربائية",
    "حلول كهربائية",
    "شركة كهرباء في مصر",
  ],

  alternates: {
    canonical: "https://www.goldenenerggy.com",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: siteUrl,
    siteName: "Golden Energy",
    title: "Golden Energy | Electrical Supply & Installation in Egypt",
    description:
      "Professional electrical supply, network design, installation, and maintenance services in Egypt for homes, businesses, and industrial projects.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Golden Energy electrical supply and installation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Golden Energy | Electrical Supply & Installation in Egypt",
    description:
      "Professional electrical supply, network design, installation, and maintenance services in Egypt for homes, businesses, and industrial projects.",
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
    icon: "/image/logo/logo.png",
    shortcut: "/image/logo/logo.png",
    apple: [{ url: "/image/logo/logo.png" }],
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "c4ddd16a2587b89e",
  },
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
      <html lang="ar" dir="ltr">
        <body>
          {children}

          {/* Structured Data JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Golden Energy",
                "url": "https://www.goldenenerggy.com",
                "logo": "https://www.goldenenerggy.com/image/logo/logo.png",
                "sameAs": [
                  "https://www.facebook.com/goldenenerggy",
                  "https://www.linkedin.com/company/goldenenerggy"
                ]
              }),
            }}
          />
        </body>
      </html>
    </LanguageProvider>
  );
}
