import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppHeader from "@/components/ui/AppHeader";
import BottomTabBar from "@/components/ui/BottomTabBar";
import JsonLd from "@/components/ui/JsonLd";
import ConsentProvider from "@/components/ads/ConsentProvider";
import SkyscraperRails from "@/components/ads/SkyscraperRails";
import ReviewModal from "@/components/modals/ReviewModal";
import ShareModal from "@/components/modals/ShareModal";
import { ADSENSE_PUB_ID, CANONICAL_URL, SITE_NAME, WEB_ADS_ENABLED, WINDOWS_ADS_ENABLED, IOS_ADS_ENABLED } from "@/lib/constants";

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
        {/* All Juforce - Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NBPTW2LBGZ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NBPTW2LBGZ');
            `,
          }}
        />

        {/* resume-building.juforce.com - Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R44PJB4BYH" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R44PJB4BYH');
            `,
          }}
        />

        {/* Google AdSense Account verification meta tag */}
        <meta name="google-adsense-account" content={ADSENSE_PUB_ID} />

        {/* Early Platform & Windows Desktop App Setup.
            Tag documentElement immediately, purge stale service worker caches on Windows,
            and strictly block AdSense scripts when WINDOWS_ADS_ENABLED is false. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
                var search = (typeof window !== 'undefined' && window.location && window.location.search) || '';
                var isWinParam = search.indexOf('platform=windows') !== -1;
                var isIOSParam = search.indexOf('platform=ios') !== -1;
                var isWinStored = false;
                var isIOSStored = false;
                try {
                  isWinStored = sessionStorage.getItem('cv_platform') === 'windows' ||
                                localStorage.getItem('cv_platform') === 'windows';
                  isIOSStored = sessionStorage.getItem('cv_platform') === 'ios' ||
                                localStorage.getItem('cv_platform') === 'ios';
                } catch(e){}

                var isWindowsApp = ua.indexOf('CVMakerWindows') !== -1 ||
                                   isWinParam ||
                                   isWinStored ||
                                   (typeof window !== 'undefined' && (
                                     window.__CVMAKER_PLATFORM__ === 'windows' ||
                                     window.APP_PLATFORM === 'windows' ||
                                     (window.chrome && window.chrome.webview)
                                   ));

                var isIOSApp = isIOSParam ||
                               isIOSStored ||
                               ua.indexOf('CVMakerIOS') !== -1 ||
                               (typeof window !== 'undefined' && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.bridge);

                if (isWindowsApp) {
                  try {
                    sessionStorage.setItem('cv_platform', 'windows');
                    localStorage.setItem('cv_platform', 'windows');
                  } catch(e){}
                  if (document.documentElement) {
                    document.documentElement.setAttribute('data-platform', 'windows');
                    document.documentElement.classList.add('platform-windows');
                  }
                  // Clean up any stale Service Worker or cache left behind in WebView2 profile
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      for (var i = 0; i < regs.length; i++) regs[i].unregister();
                    });
                  }
                  if ('caches' in window) {
                    caches.keys().then(function(keys) {
                      for (var j = 0; j < keys.length; j++) caches.delete(keys[j]);
                    });
                  }
                }

                // Determine if ads are allowed: ONLY on iOS, NEVER on web or Windows
                var adsAllowed = false;
                if (isIOSApp && !isWindowsApp) {
                  adsAllowed = ${IOS_ADS_ENABLED ? 'true' : 'false'};
                } else if (isWindowsApp) {
                  adsAllowed = ${WINDOWS_ADS_ENABLED ? 'true' : 'false'};
                } else {
                  adsAllowed = ${WEB_ADS_ENABLED ? 'true' : 'false'};
                }

                if (!adsAllowed) {
                  // Prevent any ad pushes or accidental script execution
                  window.adsbygoogle = { push: function() {} };
                  return;
                }

                window.googlefc = window.googlefc || {};
                window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

                var fc = document.createElement('script');
                fc.async = true;
                fc.src = 'https://fundingchoices.google.com/i/${ADSENSE_PUB_ID}?ers=1';
                document.head.appendChild(fc);

                var ad = document.createElement('script');
                ad.async = true;
                ad.crossOrigin = 'anonymous';
                ad.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}';
                document.head.appendChild(ad);
              })();
            `,
          }}
        />

        {/* Service Worker registration (strictly excluded in Windows desktop app) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
                var isWin = ua.indexOf('CVMakerWindows') !== -1 || 
                            (typeof window !== 'undefined' && (
                              window.__CVMAKER_PLATFORM__ === 'windows' || 
                              window.APP_PLATFORM === 'windows' || 
                              (window.chrome && window.chrome.webview) ||
                              (window.location && window.location.search && window.location.search.indexOf('platform=windows') !== -1)
                            ));
                if (!isWin && 'serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-bg text-ink-2 selection:bg-accent/20 selection:text-accent-text overflow-x-hidden max-w-full"
        suppressHydrationWarning
      >
        <ConsentProvider>
          <JsonLd data={organizationSchema} />
          <JsonLd data={websiteSchema} />
          <AppHeader />
          <SkyscraperRails />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-12 min-w-0 overflow-x-hidden">
            {children}
          </main>
          <BottomTabBar />
          <ReviewModal />
          <ShareModal />
        </ConsentProvider>
      </body>
    </html>
  );
}
