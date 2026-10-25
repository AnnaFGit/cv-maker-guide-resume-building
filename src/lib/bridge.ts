import { getPlatform } from "@/lib/platform";

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        bridge?: {
          postMessage: (message: unknown) => void;
        };
      };
    };
    onExportComplete?: (ok: boolean) => void;
  }
}

/** True inside a native shell (iOS WKWebView or Windows WebView2). */
export function isNative(): boolean {
  const platform = getPlatform();
  return platform === "ios" || platform === "windows";
}

export function postMessage(message: { type: string; [key: string]: unknown }): void {
  const platform = getPlatform();
  try {
    if (platform === "ios") {
      window.webkit?.messageHandlers?.bridge?.postMessage(message);
      return;
    }
    if (platform === "windows") {
      window.chrome?.webview?.postMessage(message);
      return;
    }
  } catch (err) {
    console.error("Failed to post message to native bridge:", err);
    return;
  }
  console.log("Native Bridge (Browser Fallback):", message);
}

export function openExternal(url: string): void {
  if (isNative()) {
    postMessage({ type: "openExternal", url });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Tells the Windows shell the current theme so it can colour the title bar.
 * No-op on iOS and web (iOS shell does not handle this message).
 */
export function notifyTheme(theme: "light" | "dark"): void {
  if (getPlatform() === "windows") {
    postMessage({ type: "themeChanged", theme });
  }
}

/** Touch-first devices (phones/tablets) get the share sheet; desktops get a file download. */
function prefersShareSheet(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return navigator.maxTouchPoints > 0 && window.matchMedia("(pointer: coarse)").matches;
}

export function exportPDF(filename: string, dataBase64: string): void {
  if (isNative()) {
    postMessage({ type: "exportPDF", filename, dataBase64 });
    return;
  }

  try {
    const byteCharacters = atob(dataBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // 1. Try Web Share API (navigator.share) for iOS Safari and mobile wrappers.
    //    Desktop browsers also support file sharing, but users there expect a download.
    const file = new File([blob], filename, { type: "application/pdf" });
    if (
      prefersShareSheet() &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      navigator.share({
        files: [file],
        title: filename,
      }).catch((err) => {
        // If the user cancelled or finished, keep them in the app
        console.log("Share completed or cancelled:", err);
      });
      return;
    }

    // 2. Fallback to standard anchor link download for desktop/non-share environments
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed PDF export:", err);
  }
}
