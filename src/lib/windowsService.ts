import { WINDOWS_STORE_CONFIG } from "@/lib/constants";
import { openExternal } from "@/lib/bridge";
import { getPlatform } from "@/lib/platform";

const STORAGE_KEYS = {
  SESSION_COUNT: "cv_session_count",
  SESSION_COUNTED: "cv_session_counted",
  REVIEW_PROMPTED: "cv_review_prompted",
  REVIEW_DEFERRED_SESSION: "cv_review_deferred_session",
};

export const windowsService = {
  /**
   * Returns whether the active platform is Windows desktop app.
   */
  isWindows(): boolean {
    return getPlatform() === "windows";
  },

  /**
   * Gets current session count (or 1 if none).
   */
  getSessionCount(): number {
    if (typeof window === "undefined") return 1;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION_COUNT);
      return stored ? parseInt(stored, 10) : 1;
    } catch {
      return 1;
    }
  },

  /**
   * Increments session count once per browser/app window session.
   */
  incrementSession(): number {
    if (typeof window === "undefined") return 1;
    try {
      const alreadyCounted = sessionStorage.getItem(STORAGE_KEYS.SESSION_COUNTED);
      let count = this.getSessionCount();
      if (!alreadyCounted) {
        count = (parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_COUNT) || "0", 10) || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.SESSION_COUNT, String(count));
        sessionStorage.setItem(STORAGE_KEYS.SESSION_COUNTED, "1");
      }
      return count;
    } catch {
      return 1;
    }
  },

  /**
   * Determines whether the review popup should automatically show.
   * Criteria:
   * - Must be running on Windows (or allow manual dev trigger)
   * - Has not already been permanently prompted or rated
   * - Session count >= 2
   * - Not deferred for the current session
   */
  shouldPromptReview(): boolean {
    if (typeof window === "undefined") return false;
    try {
      // Check if already permanently reviewed or dismissed
      if (localStorage.getItem(STORAGE_KEYS.REVIEW_PROMPTED) === "true") {
        return false;
      }

      const currentSession = this.getSessionCount();
      const deferredSession = parseInt(
        localStorage.getItem(STORAGE_KEYS.REVIEW_DEFERRED_SESSION) || "0",
        10
      );

      // Must be at least session 2, and not deferred in this same session
      return currentSession >= 2 && currentSession > deferredSession;
    } catch {
      return false;
    }
  },

  /**
   * Defers review prompt for this session ("Maybe Later").
   */
  deferReview(): void {
    if (typeof window === "undefined") return;
    try {
      const currentSession = this.getSessionCount();
      localStorage.setItem(
        STORAGE_KEYS.REVIEW_DEFERRED_SESSION,
        String(currentSession)
      );
    } catch (err) {
      console.warn("Failed to defer review:", err);
    }
  },

  /**
   * Permanently marks review as prompted ("Don't ask again" or after clicking Rate).
   */
  dismissReviewPermanently(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEW_PROMPTED, "true");
    } catch (err) {
      console.warn("Failed to dismiss review:", err);
    }
  },

  /**
   * Resolves the Store review URI.
   * If ProductId is set, targets direct Store protocol; otherwise web Store details.
   */
  getReviewUrl(): string {
    const { productId, reviewProtocol, storeUrl } = WINDOWS_STORE_CONFIG;
    const trimmedId = (productId || "").trim();
    if (trimmedId.length > 0) {
      return `${reviewProtocol}${trimmedId}`;
    }
    return storeUrl;
  },

  /**
   * Launches the Microsoft Store review dialog and marks review as completed.
   */
  openStoreReview(): void {
    this.dismissReviewPermanently();
    const url = this.getReviewUrl();
    openExternal(url);
  },

  /**
   * Dispatches event to open the Review Modal in-app.
   */
  triggerReviewModal(): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-review-modal"));
    }
  },

  /**
   * Dispatches event to open the Share Modal in-app.
   */
  triggerShareModal(): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-share-modal"));
    }
  },

  /**
   * Direct Web Share API trigger or opens Share Modal fallback.
   */
  async shareOrOpenModal(): Promise<void> {
    if (typeof window === "undefined") return;

    const { shareTitle, shareText, shareUrl } = WINDOWS_STORE_CONFIG;
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // If aborted by user, do nothing
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback: open customized share modal
    this.triggerShareModal();
  },
};
