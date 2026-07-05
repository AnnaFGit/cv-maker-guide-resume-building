import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppHeader from "@/components/ui/AppHeader";
import BottomTabBar from "@/components/ui/BottomTabBar";
import JsonLd from "@/components/ui/JsonLd";
import { CANONICAL_URL, SITE_NAME, ADSENSE_PUB_ID } from "@/lib/constants";

const newsreader = localFont({
  src: [
    {
      path: "../fonts/Newsreader-normal.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../fonts/Newsreader-italic.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const hankenGrotesk = localFont({
  src: [
    {
      path: "../fonts/HankenGrotesk-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/HankenGrotesk-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const splineSansMono = localFont({
  src: [
    {
      path: "../fonts/SplineSansMono-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../fonts/SplineSansMono-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    default: `${SITE_NAME} - Free CV Builder & ATS Match Checker`,
    template: `%s · ${SITE_NAME}`,
  },
  description: "Learn to write a resume, build an ATS-friendly CV, check keyword matches, and test your knowledge.",
  manifest: "/manifest.json",
  openGraph: {
    title: SITE_NAME,
    description: "Learn to write a resume, build an ATS-friendly CV, and check keyword matches.",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Resume Building`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": CANONICAL_URL,
    "logo": `${CANONICAL_URL}/icons/icon-512.png`,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": CANONICAL_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${CANONICAL_URL}/course/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${hankenGrotesk.variable} ${splineSansMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-bg text-ink-2 selection:bg-accent/20 selection:text-accent-text"
        suppressHydrationWarning
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <AppHeader />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-12">
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  );
}
