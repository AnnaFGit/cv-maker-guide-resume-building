export const SITE_NAME = "CV Maker Guide";
export const CANONICAL_URL = "https://resume-building.juforce.com";
export const ADSENSE_PUB_ID = "ca-pub-1115448685357017";

// Per-placement AdSense slot IDs
// All use the same unit for now; create separate units in the
// AdSense dashboard later for per-position revenue reporting.
export const AD_SLOTS = {
  HOME: "2174721638",
  COURSE_LIST: "2174721638",
  LESSON: "2174721638",
  BUILDER: "2174721638",
  ATS_CHECKER: "2174721638",
  COVER_LETTER: "2174721638",
  CV_TEMPLATES: "2174721638",
  // Vertical side rails (wide desktop screens only). Uses the same responsive
  // unit at a fixed 160x600 size; create a dedicated "Skyscraper" display unit
  // in AdSense later for separate reporting.
  SKYSCRAPER_LEFT: "2174721638",
  SKYSCRAPER_RIGHT: "2174721638",
} as const;

// Routes where ads are suppressed (editor workspaces)
export const AD_EXCLUDED_ROUTES = ["/builder/edit/", "/cover-letter/edit/"];

/**
 * Platform Ad Configuration:
 * - Web: false (disabled so Microsoft Store certification sees zero ads)
 * - Windows: false (disabled for Microsoft Store approval)
 * - iOS: true (enabled for the iOS mobile app)
 */
export const WEB_ADS_ENABLED = false;
export const WINDOWS_ADS_ENABLED = false;
export const IOS_ADS_ENABLED = true;

export interface WindowsStoreConfig {
  productId: string;
  storeUrl: string;
  reviewProtocol: string;
  shareTitle: string;
  shareText: string;
  shareUrl: string;
}

/**
 * Windows Store & App Sharing Configuration
 */
export const WINDOWS_STORE_CONFIG: WindowsStoreConfig = {
  // Microsoft Partner Center Product ID
  productId: "9NGH332SBNJS",
  storeUrl: "https://apps.microsoft.com/detail/9NGH332SBNJS",
  reviewProtocol: "ms-windows-store://review/?ProductId=",
  shareTitle: "CV Resume Writing Course",
  shareText: "Check out CV Resume Writing Course on Microsoft Store — build ATS-friendly resumes and tailored cover letters for free.",
  shareUrl: "https://apps.microsoft.com/detail/9NGH332SBNJS",
};
