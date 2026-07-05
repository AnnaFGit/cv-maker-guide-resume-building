"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AppHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
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
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md px-4 py-3 transition-colors duration-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
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

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-paper text-ink transition-all hover:bg-surface focus-ring"
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
    </header>
  );
}
