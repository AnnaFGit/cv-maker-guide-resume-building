"use client";

import React, { useEffect, useState } from "react";
import { WINDOWS_STORE_CONFIG } from "@/lib/constants";
import { openExternal } from "@/lib/bridge";
import Toast from "@/components/ui/Toast";

export default function ShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-share-modal", handleOpen);
    return () => window.removeEventListener("open-share-modal", handleOpen);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(WINDOWS_STORE_CONFIG.shareUrl);
      setCopied(true);
      setToastMessage("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      window.prompt("Copy link:", WINDOWS_STORE_CONFIG.shareUrl);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: WINDOWS_STORE_CONFIG.shareTitle,
        text: WINDOWS_STORE_CONFIG.shareText,
        url: WINDOWS_STORE_CONFIG.shareUrl,
      });
      setIsOpen(false);
      setToastMessage("Thank you for sharing! ❤️");
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.warn("Share failed:", err);
      }
    }
  };

  const shareLinks = [
    {
      name: "LinkedIn",
      color: "hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/40 hover:text-[#0A66C2]",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        WINDOWS_STORE_CONFIG.shareUrl
      )}`,
    },
    {
      name: "WhatsApp",
      color: "hover:bg-[#25D366]/10 hover:border-[#25D366]/40 hover:text-[#25D366]",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.19 8.19 0 0 1-5.82 2.42c-1.45 0-2.88-.38-4.14-1.11l-.3-.18-3.08.81.82-3-.2-.31a8.21 8.21 0 0 1-1.26-4.45c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${WINDOWS_STORE_CONFIG.shareText} ${WINDOWS_STORE_CONFIG.shareUrl}`
      )}`,
    },
    {
      name: "X / Twitter",
      color: "hover:bg-ink/10 hover:border-ink/40 hover:text-ink",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        WINDOWS_STORE_CONFIG.shareText
      )}&url=${encodeURIComponent(WINDOWS_STORE_CONFIG.shareUrl)}`,
    },
    {
      name: "Facebook",
      color: "hover:bg-[#1877F2]/10 hover:border-[#1877F2]/40 hover:text-[#1877F2]",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        WINDOWS_STORE_CONFIG.shareUrl
      )}`,
    },
    {
      name: "Email",
      color: "hover:bg-accent/10 hover:border-accent/40 hover:text-accent-text",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      url: `mailto:?subject=${encodeURIComponent(
        WINDOWS_STORE_CONFIG.shareTitle
      )}&body=${encodeURIComponent(
        `${WINDOWS_STORE_CONFIG.shareText}\n\nCheck it out here: ${WINDOWS_STORE_CONFIG.shareUrl}`
      )}`,
    },
  ];

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
          duration={3000}
        />
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="w-full max-w-md bg-paper border border-border-strong rounded-3xl p-6 sm:p-7 shadow-2xl relative flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink p-1.5 rounded-full hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close share dialog"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent-text shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 id="share-modal-title" className="font-serif text-xl font-bold text-ink leading-tight">
                  Share {WINDOWS_STORE_CONFIG.shareTitle}
                </h3>
                <p className="text-xs text-muted">
                  Help friends and colleagues build ATS-optimized CVs
                </p>
              </div>
            </div>

            {/* Native Share Sheet Button (Windows 10/11) */}
            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className="mt-4 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-accent to-[#D46B47] hover:opacity-95 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer focus-ring"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3-3m0 0 3 3m-3-3v10.5" />
                </svg>
                <span>Open Windows Share Sheet</span>
              </button>
            )}

            {/* Link Copy Box */}
            <div className="mt-4 flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
                Microsoft Store App Link
              </label>
              <div className="flex items-center gap-2 p-1.5 pl-3.5 rounded-2xl border border-border-strong bg-surface">
                <span className="text-xs font-mono text-ink truncate flex-1 select-all">
                  {WINDOWS_STORE_CONFIG.shareUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className={`py-2 px-3.5 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    copied
                      ? "bg-success text-white shadow-sm"
                      : "bg-paper hover:bg-surface border border-border-strong text-ink shadow-xs"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 text-muted-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9 9.06 9.06 0 0 0-1.5.124m7.5 10.376h-3.375a1.125 1.125 0 0 1-1.125-1.125V7.875m3.375 9.375a1.125 1.125 0 0 1-1.125-1.125v-3.75a1.125 1.125 0 0 1 1.125-1.125h3.75a1.125 1.125 0 0 1 1.125 1.125v3.75a1.125 1.125 0 0 1-1.125 1.125z" />
                      </svg>
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="mt-4 flex flex-col gap-2 text-left">
              <label className="text-[11px] font-semibold text-muted-2 uppercase tracking-wider">
                Quick Share
              </label>
              <div className="grid grid-cols-5 gap-2">
                {shareLinks.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => openExternal(item.url)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border border-border bg-surface text-ink-2 transition-all cursor-pointer ${item.color}`}
                    title={`Share on ${item.name}`}
                  >
                    {item.icon}
                    <span className="text-[10px] font-medium leading-none truncate max-w-full">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
