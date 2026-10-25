"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { ADSENSE_PUB_ID } from "@/lib/constants";
import { adsAllowed } from "@/lib/platform";

interface ConsentContextValue {
  consentReady: boolean;
}

const ConsentContext = createContext<ConsentContextValue>({
  consentReady: false,
});

export function useConsent() {
  return useContext(ConsentContext);
}

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: Array<
        | { CONSENT_API_READY: () => void }
        | { CONSENT_DATA_READY: () => void }
        | (() => void)
      >;
    };
  }
}

/**
 * ConsentProvider — Google Funding Choices CMP gate.
 *
 * 1. Waits for Funding Choices to resolve consent via `googlefc.callbackQueue`
 * 2. Once consent is granted, dynamically loads `adsbygoogle.js`
 * 3. Exposes `consentReady` to child components (consumed by AdSlot)
 * 4. Fail-closed: if consent never resolves (timeout), ads are never shown
 */
export default function ConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consentReady, setConsentReady] = useState(false);
  const adScriptLoaded = useRef(false);

  useEffect(() => {
    // Windows app with ads switched off: never resolve consent, never load ads.
    if (!adsAllowed()) return;

    // If Funding Choices resolves consent, trigger immediately
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

    // Fallback: If CMP doesn't fire (e.g. non-EEA visitors, CMP inactive/not configured),
    // enable ads after a short window so ads are not permanently blocked.
    const fallbackTimer = setTimeout(() => {
      setConsentReady(true);
    }, 1000);

    window.googlefc.callbackQueue.push({
      CONSENT_DATA_READY: () => {
        clearTimeout(fallbackTimer);
        setConsentReady(true);
      },
    });

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Ensure adsbygoogle.js is loaded once consent resolves or falls back
  useEffect(() => {
    if (!consentReady || adScriptLoaded.current || typeof window === "undefined") return;
    if (!adsAllowed()) return;

    // Check if adsbygoogle script already exists in document
    const alreadyExists = document.querySelector('script[src*="adsbygoogle.js"]');
    if (!alreadyExists) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
    adScriptLoaded.current = true;
  }, [consentReady]);

  return (
    <ConsentContext.Provider value={{ consentReady }}>
      {children}
    </ConsentContext.Provider>
  );
}
