import { WEB_ADS_ENABLED, WINDOWS_ADS_ENABLED, IOS_ADS_ENABLED } from "@/lib/constants";

export type Platform = "web" | "ios" | "windows";

declare global {
  interface Window {
    /** Set by the Windows shell before any page script runs. */
    __CVMAKER_PLATFORM__?: Platform;
    APP_PLATFORM?: string;
    /** Injected by Microsoft Edge WebView2 (Windows desktop app). */
    chrome?: {
      webview?: {
        postMessage: (message: unknown) => void;
        addEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
        removeEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
      };
    };
  }
}

/**
 * Detects which surface the shared web UI is running in.
 * - "windows": Windows desktop app (WPF / WinUI 3 + WebView2)
 * - "ios":     iOS app (WKWebView with the `bridge` message handler)
 * - "web":     regular browser
 */
export function getPlatform(): Platform {
  if (typeof window === "undefined") return "web";

  // 1. URL search param check (?platform=windows|ios)
  try {
    if (window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("platform");
      if (p === "windows" || p === "ios") {
        try {
          sessionStorage.setItem("cv_platform", p);
          localStorage.setItem("cv_platform", p);
        } catch {}
        return p as Platform;
      }
    }
  } catch {}

  // 2. Storage persistence (sessionStorage + localStorage)
  try {
    const sp = sessionStorage.getItem("cv_platform") || localStorage.getItem("cv_platform");
    if (sp === "windows" || sp === "ios") {
      return sp as Platform;
    }
  } catch {}

  // 3. User agent check (appended by WPF shell: "CVMakerWindows/1.0")
  if (
    typeof navigator !== "undefined" &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CVMakerWindows") !== -1
  ) {
    try {
      sessionStorage.setItem("cv_platform", "windows");
      localStorage.setItem("cv_platform", "windows");
    } catch {}
    return "windows";
  }

  // 4. Injected native flags
  if (
    window.__CVMAKER_PLATFORM__ === "windows" ||
    window.APP_PLATFORM === "windows" ||
    (typeof window.chrome !== "undefined" && Boolean(window.chrome?.webview))
  ) {
    try {
      sessionStorage.setItem("cv_platform", "windows");
      localStorage.setItem("cv_platform", "windows");
    } catch {}
    return "windows";
  }

  // 5. Document attribute tag set by early layout script
  if (
    typeof document !== "undefined" &&
    document.documentElement &&
    (document.documentElement.getAttribute("data-platform") === "windows" ||
      document.documentElement.classList.contains("platform-windows"))
  ) {
    return "windows";
  }

  // 6. iOS native shell check
  if (
    (typeof window !== "undefined" && window.webkit?.messageHandlers?.bridge) ||
    (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.includes("CVMakerIOS"))
  ) {
    try {
      sessionStorage.setItem("cv_platform", "ios");
      localStorage.setItem("cv_platform", "ios");
    } catch {}
    return "ios";
  }

  return "web";
}

/** Whether ads (scripts, slots and "Advertisement" labels) may render on this surface. */
export function adsAllowed(): boolean {
  const platform = getPlatform();
  if (platform === "ios") return IOS_ADS_ENABLED;
  if (platform === "windows") return WINDOWS_ADS_ENABLED;
  return WEB_ADS_ENABLED;
}
