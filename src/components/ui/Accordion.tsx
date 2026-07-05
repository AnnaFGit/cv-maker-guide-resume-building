"use client";

import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={`border-b border-border transition-colors duration-200 ${className}`}>
      <button
        onClick={toggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-4 text-left font-serif text-lg font-bold text-ink hover:text-accent-text transition-colors focus-ring rounded-lg"
      >
        <span>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-5 w-5 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="font-sans text-sm text-ink-2 leading-relaxed whitespace-pre-line">
          {children}
        </div>
      </div>
    </div>
  );
}
