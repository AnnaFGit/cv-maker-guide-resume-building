"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_PUB_ID } from "@/lib/constants";

interface AdSlotProps {
  slotId: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: "true" | "false";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  slotId,
  format = "auto",
  responsive = "true",
  className = "",
}: AdSlotProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsOnline(navigator.onLine), 0);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // Reset loading state on pathname change to allow pushing for new pages
    setTimeout(() => {
      setAdLoaded(false);
    }, 0);
  }, [pathname]);

  useEffect(() => {
    // Only run if online, in browser, and adsbygoogle is available
    if (!isOnline || typeof window === "undefined" || !window.adsbygoogle) {
      return;
    }

    // Check if the current route is the CV Editor (excluded from ads)
    if (pathname.includes("/builder/edit/")) {
      return;
    }

    try {
      const insElement = adRef.current;
      // Guard double-push: only push if the ins tag has not been processed yet
      if (insElement && !insElement.hasAttribute("data-adsbygoogle-status") && !adLoaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setTimeout(() => {
          setAdLoaded(true);
        }, 0);
      }
    } catch (err) {
      console.warn("AdSense push failed:", err);
    }
  }, [pathname, isOnline, adLoaded]);

  // Comment out ads for now. Can be enabled in the future.
  return null;

  return (
    <div className={`my-6 flex justify-center items-center overflow-hidden bg-surface/50 border border-dashed border-border-strong rounded-2xl min-h-[90px] w-full text-center ${className}`}>
      <div className="w-full">
        {/* AdSense ins tag */}
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_PUB_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
        {!adLoaded && (
          <span className="label-micro text-[10px] text-muted-2 block py-2">
            Advertisement
          </span>
        )}
      </div>
    </div>
  );
}
