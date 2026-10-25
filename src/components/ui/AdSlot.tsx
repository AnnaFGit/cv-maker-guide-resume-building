"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_PUB_ID, AD_EXCLUDED_ROUTES } from "@/lib/constants";
import { useConsent } from "@/components/ads/ConsentProvider";
import { adsAllowed } from "@/lib/platform";

interface AdSlotProps {
  slotId: string;
  placement: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: "true" | "false";
  className?: string;
  insStyle?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * AdSlot — renders an AdSense display ad unit.
 *
 * SPA-safe: uses `key={pathname}` on the container to force React to
 * unmount/remount the <ins> element on each soft navigation, clearing
 * the stale `data-adsbygoogle-status` attribute that blocks re-push.
 *
 * Consent-gated: renders nothing until ConsentProvider signals
 * `consentReady === true` (Funding Choices CMP has resolved).
 *
 * Route-excluded: returns null on editor routes defined in AD_EXCLUDED_ROUTES.
 */
export default function AdSlot({
  slotId,
  placement,
  format = "auto",
  responsive = "true",
  className = "",
  insStyle,
}: AdSlotProps) {
  const pathname = usePathname();
  const { consentReady } = useConsent();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(adsAllowed());
  }, []);

  // Strict Windows desktop suppression: never render ad, label, or container
  if (!allowed || !adsAllowed()) return null;

  // Suppress ads on excluded routes (editor workspaces)
  const isExcluded = AD_EXCLUDED_ROUTES.some((route) =>
    pathname.includes(route)
  );
  if (isExcluded) return null;

  // Don't render anything until consent resolves
  if (!consentReady) return null;

  return (
    <div
      className={`my-6 -mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-[100vw] sm:max-w-full min-w-0 flex flex-col justify-center items-center text-center overflow-hidden ${className}`}
      data-ad-placement={placement}
    >
      <span className="text-[10px] uppercase tracking-wider text-muted-2 block mb-1">
        Advertisement
      </span>
      <div className="w-full max-w-full min-w-0 flex justify-center items-center overflow-hidden">
        {/*
          key={pathname} forces a fresh <ins> on every route change,
          so adsbygoogle.push({}) gets a clean element without
          a stale data-adsbygoogle-status attribute.
        */}
        <AdSlotInner
          key={pathname}
          slotId={slotId}
          format={format}
          responsive={responsive}
          insStyle={insStyle}
        />
      </div>
    </div>
  );
}

/**
 * Inner component that mounts a fresh <ins> tag and pushes to adsbygoogle.
 * Separated so the `key={pathname}` in the parent causes full unmount/remount.
 */
function AdSlotInner({
  slotId,
  format,
  responsive,
  insStyle,
}: {
  slotId: string;
  format: string;
  responsive: string;
  insStyle?: React.CSSProperties;
}) {
  const adRef = useRef<HTMLModElement>(null);
  const [pushed, setPushed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Track online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Push the ad once the <ins> element is mounted and adsbygoogle is available
  useEffect(() => {
    if (pushed || !isOnline || typeof window === "undefined") return;
    if (!window.adsbygoogle) return;

    const insElement = adRef.current;
    if (!insElement) return;

    // Guard: only push if the element hasn't been processed yet
    if (insElement.hasAttribute("data-adsbygoogle-status")) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setPushed(true);
    } catch (err) {
      console.warn("AdSense push failed:", err);
    }
  }, [pushed, isOnline]);

  // Retry push when adsbygoogle becomes available (script may still be loading)
  useEffect(() => {
    if (pushed || !isOnline) return;
    if (window.adsbygoogle) return; // Already available, the other effect will handle it

    const checkInterval = setInterval(() => {
      if (window.adsbygoogle && adRef.current && !pushed) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setPushed(true);
        } catch (err) {
          console.warn("AdSense push failed:", err);
        }
        clearInterval(checkInterval);
      }
    }, 200);

    return () => clearInterval(checkInterval);
  }, [pushed, isOnline]);

  return (
    <div className="w-full max-w-full min-w-0 flex justify-center overflow-hidden">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={insStyle || { display: "block", width: "100%", maxWidth: "100%" }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
