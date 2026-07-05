import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ATS Resume Templates - Best Layouts for Job Applications",
  description: "Browse single-column, ATS-safe CV templates. Learn why traditional layout formats pass recruitment software and download templates for free.",
};

export default function TemplatesPillarPage() {
  const templatesInfo = [
    {
      name: "Editorial Template (Default)",
      style: "Serif newsreader headings, terracotta rules, warm editorial look.",
      audience: "Great for creative roles, marketing, writing, and general business applications where a touch of warmth and editorial elegance stands out.",
      atsFriendly: "100% ATS-safe. Uses a single-column layout without sidebars or graphic elements."
    },
    {
      name: "Classic Template",
      style: "Traditional Georgia serif, dark dividers, formal spacing, centered details.",
      audience: "Best suited for conservative industries such as finance, accounting, law, banking, government, and academic positions.",
      atsFriendly: "100% ATS-safe. Centered alignment is parsed easily by bots, and traditional structures match expectations."
    },
    {
      name: "Compact Template",
      style: "Clean Hanken Grotesk sans-serif, tight margins, high layout density.",
      audience: "Ideal for senior professionals, engineers, and candidates with dense work histories who need to fit a large volume of details into 1 or 2 pages.",
      atsFriendly: "100% ATS-safe. Maximizes whitespace efficiency and text selection flow."
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <span className="label-micro text-xs text-accent-text">Design Pillar</span>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-ink tracking-tight mt-1.5 mb-3">
          ATS Resume Templates
        </h1>
        <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
          The layout of your resume can be the difference between getting a callback or an automatic rejection. Learn how to choose the right template for your target industry.
        </p>
      </div>

      {/* Why Single Column Section */}
      <section className="bg-surface/50 border border-border rounded-2xl p-6 flex flex-col gap-3">
        <h2 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
          <svg className="h-5 w-5 text-accent-text shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Why Single-Column Templates are Mandatory
        </h2>
        <p className="font-sans text-sm text-ink-2 leading-relaxed">
          Many modern job seekers use visually busy, multi-column templates with icons and progress bars thinking it makes them stand out. However, Applicant Tracking Systems (ATS) read text left-to-right, top-to-bottom. When a parser encounters a two-column layout, it often reads straight across the columns, splicing sentences together into incomprehensible junk text. 
        </p>
        <p className="font-sans text-sm text-ink-2 leading-relaxed">
          Keeping your CV format strictly single-column guarantees that both human recruiters and parsing software read your credentials in the correct chronological order.
        </p>
      </section>

      {/* Templates Information Grid */}
      <div className="flex flex-col gap-6">
        <h2 className="label-micro text-xs text-muted">Available Layouts in {SITE_NAME}</h2>
        {templatesInfo.map((tmpl, idx) => (
          <Card key={idx} className="flex flex-col gap-3">
            <h3 className="font-serif text-xl font-bold text-ink">{tmpl.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs border-t border-border pt-3">
              <div>
                <span className="font-bold text-muted-2 block mb-0.5">Style Details</span>
                <span className="text-ink-2 font-sans">{tmpl.style}</span>
              </div>
              <div>
                <span className="font-bold text-muted-2 block mb-0.5">Best For</span>
                <span className="text-ink-2 font-sans">{tmpl.audience}</span>
              </div>
              <div>
                <span className="font-bold text-muted-2 block mb-0.5">ATS Safe</span>
                <span className="text-success font-semibold flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {tmpl.atsFriendly.split(".")[0]}
                </span>
                <span className="text-muted-2 block mt-0.5 leading-snug">{tmpl.atsFriendly.split(".")[1]}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface border border-border p-6 rounded-2xl">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink">Ready to write your resume?</h3>
          <p className="text-xs text-muted-2 mt-0.5">Load one of these templates pre-filled with sample data in our builder.</p>
        </div>
        <Link href="/builder/" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full">
            Open CV Builder
          </Button>
        </Link>
      </div>
    </div>
  );
}
