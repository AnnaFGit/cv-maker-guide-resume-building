"use client";

import React, { useEffect, useState } from "react";
import { windowsService } from "@/lib/windowsService";
import Toast from "@/components/ui/Toast";

export default function ReviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Increment session count on mount
    windowsService.incrementSession();

    // 2. Check if automated review prompt is due on Windows desktop
    if (windowsService.isWindows() && windowsService.shouldPromptReview()) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // 3. Listen for manual trigger events (e.g. from header or settings)
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-review-modal", handleOpen);
    return () => window.removeEventListener("open-review-modal", handleOpen);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleMaybeLater();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleRateNow = () => {
    windowsService.openStoreReview();
    setIsOpen(false);
    setToastMessage("Thank you so much for your rating and support! ❤️");
  };

  const handleMaybeLater = () => {
    windowsService.deferReview();
    setIsOpen(false);
  };

  const handleNever = () => {
    windowsService.dismissReviewPermanently();
    setIsOpen(false);
  };

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
          duration={3500}
        />
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in"
          onClick={handleMaybeLater}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div
            className="w-full max-w-md bg-paper border border-border-strong rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col items-center text-center animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleMaybeLater}
              className="absolute top-4 right-4 text-muted hover:text-ink p-1.5 rounded-full hover:bg-surface transition-colors"
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Top Stars Banner */}
            <div
              className="flex items-center gap-1.5 mb-3 cursor-pointer py-1"
              onMouseLeave={() => setHoverRating(5)}
              aria-hidden="true"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  className={`h-8 w-8 transition-all duration-150 transform hover:scale-125 ${
                    star <= hoverRating
                      ? "text-amber-500 fill-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
                      : "text-border fill-transparent"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              ))}
            </div>

            <span className="text-[11px] font-bold tracking-widest text-accent-text uppercase bg-accent/10 px-3 py-1 rounded-full mb-3">
              Microsoft Store Rating
            </span>

            <h3 id="review-modal-title" className="font-serif text-2xl font-bold text-ink mb-2">
              Enjoying CV Maker Guide?
            </h3>

            <p className="text-sm text-muted leading-relaxed mb-6 max-w-sm">
              Your 5-star review helps fellow job seekers discover free, professional, ATS-friendly resume tools without hidden fees or paywalls. Would you take 30 seconds to rate us?
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={handleRateNow}
                className="w-full py-3.5 px-6 rounded-2xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer focus-ring"
              >
                <span>Rate on Microsoft Store ★★★★★</span>
              </button>

              <button
                onClick={handleMaybeLater}
                className="w-full py-2.5 px-4 rounded-xl border border-border-strong hover:bg-surface text-ink-2 font-medium text-xs transition-colors cursor-pointer"
              >
                Maybe Later
              </button>

              <button
                onClick={handleNever}
                className="text-[11px] text-muted-2 hover:text-ink hover:underline transition-colors mt-1 py-1 cursor-pointer"
              >
                Don&apos;t ask again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
