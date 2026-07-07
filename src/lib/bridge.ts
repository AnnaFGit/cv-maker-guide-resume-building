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

export function isNative(): boolean {
  return typeof window !== "undefined" && !!window.webkit?.messageHandlers?.bridge;
}

export function postMessage(message: { type: string; [key: string]: unknown }): void {
  if (isNative()) {
    try {
      window.webkit?.messageHandlers?.bridge?.postMessage(message);
    } catch (err) {
      console.error("Failed to post message to native bridge:", err);
    }
  } else {
    console.log("Native Bridge (Browser Fallback):", message);
  }
}

export function openExternal(url: string): void {
  if (isNative()) {
    postMessage({ type: "openExternal", url });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
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

    // 1. Try Web Share API (navigator.share) for iOS Safari and mobile wrappers
    const file = new File([blob], filename, { type: "application/pdf" });
    if (
      typeof navigator !== "undefined" &&
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
