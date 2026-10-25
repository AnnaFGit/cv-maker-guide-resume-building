"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notifyTheme } from "@/lib/bridge";
import { windowsService } from "@/lib/windowsService";

export default function AppHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isWindows, setIsWindows] = useState(() => {
    if (typeof window !== "undefined") {
      return windowsService.isWindows();
    }
    return false;
  });

  useEffect(() => {
    setIsWindows(windowsService.isWindows());

    // Read theme from localStorage or system preferences on mount
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTimeout(() => setTheme(initialTheme), 0);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    notifyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    notifyTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md px-4 py-3 transition-colors duration-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-lg p-1">
          <Image
            src="/icons/icon.svg"
            alt="CV Maker Guide Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="font-serif text-xl font-bold tracking-tight text-ink">
            CV Maker
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-sans text-sm font-medium text-ink-2 hover:text-accent-text transition-colors">Home</Link>
          <Link href="/builder/" className="font-sans text-sm font-medium text-ink-2 hover:text-accent-text transition-colors">CV Builder</Link>
          <Link href="/ats-checker/" className="font-sans text-sm font-medium text-ink-2 hover:text-accent-text transition-colors">ATS Match</Link>
          <Link href="/cover-letter/" className="font-sans text-sm font-medium text-ink-2 hover:text-accent-text transition-colors">Cover Letter</Link>
          <Link href="/course/" className="font-sans text-sm font-medium text-ink-2 hover:text-accent-text transition-colors">Course</Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Rate App Button (visible on Windows Desktop) */}
          {isWindows && (
            <button
              onClick={() => windowsService.triggerReviewModal()}
              aria-label="Rate App on Microsoft Store"
              title="Rate on Microsoft Store"
              className="flex h-10 px-3 items-center gap-1.5 rounded-xl border border-border-strong bg-paper text-ink transition-all hover:bg-surface hover:text-amber-500 focus-ring cursor-pointer text-xs font-semibold"
            >
              <svg
                className="h-4 w-4 text-amber-500 fill-amber-500"
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
              <span className="hidden sm:inline">Rate</span>
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={() => windowsService.triggerShareModal()}
            aria-label="Share CV Maker Guide"
            title="Share app"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-paper text-ink transition-all hover:bg-surface hover:text-accent-text focus-ring cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z"
              />
            </svg>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-paper text-ink transition-all hover:bg-surface focus-ring cursor-pointer"
          >
            {theme === "light" ? (
              // Moon icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-accent-text"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            ) : (
              // Sun icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m0 13.5V21M9.75 15h.008v.008H9.75V15Zm0-6h.008v.008H9.75V9ZM3 12h2.25m13.5 0H21M5.757 6.579l1.591 1.59m11.192 11.192l1.591 1.59m-.002-14.382l-1.591 1.59M6.579 18.172l-1.59 1.591M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
