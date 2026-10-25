"use client";

import { useState, useEffect } from "react";
import AdSlot from "@/components/ui/AdSlot";
import { AD_SLOTS, AD_EXCLUDED_ROUTES } from "@/lib/constants";
import { adsAllowed } from "@/lib/platform";
import { usePathname } from "next/navigation";

/**
 * SkyscraperRails renders vertical 160x600 skyscraper display ads
 * pinned cleanly to the left and right gutters of the central content.
 *
 * Responsive behavior:
 * - Completely hidden on mobile, tablet, and standard laptop screens (<1440px).
 * - Appears on wide desktop viewports (>=1440px) pinned adjacent to max-w-5xl content.
 * - Suppressed on editor routes (/builder/edit/, /cover-letter/edit/).
 * - Respects the `adsAllowed()` flag (suppressed on Windows if WINDOWS_ADS_ENABLED is false).
 */
export default function SkyscraperRails() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(adsAllowed());
  }, []);

  // Suppress on editor routes
  const isExcluded = AD_EXCLUDED_ROUTES.some((route) => pathname.includes(route));
  if (isExcluded) return null;

  // Suppress if ads are disabled on the active platform
  if (!allowed || !adsAllowed()) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 mx-auto hidden max-w-5xl overflow-visible min-[1440px]:block"
    >
      {/* Left Skyscraper Rail */}
      <aside
        aria-label="Advertisement left"
        className="pointer-events-auto absolute -left-[184px] top-24 w-[160px] h-[600px] flex flex-col items-center justify-start overflow-hidden"
      >
        <AdSlot
          slotId={AD_SLOTS.SKYSCRAPER_LEFT}
          placement="skyscraper-left"
          format="vertical"
          responsive="false"
          className="my-0 w-[160px]"
          insStyle={{ display: "inline-block", width: "160px", height: "600px" }}
        />
      </aside>

      {/* Right Skyscraper Rail */}
      <aside
        aria-label="Advertisement right"
        className="pointer-events-auto absolute -right-[184px] top-24 w-[160px] h-[600px] flex flex-col items-center justify-start overflow-hidden"
      >
        <AdSlot
          slotId={AD_SLOTS.SKYSCRAPER_RIGHT}
          placement="skyscraper-right"
          format="vertical"
          responsive="false"
          className="my-0 w-[160px]"
          insStyle={{ display: "inline-block", width: "160px", height: "600px" }}
        />
      </aside>
    </div>
  );
}
