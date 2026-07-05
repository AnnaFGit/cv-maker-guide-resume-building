import { Metadata } from "next";
import ATSCheckerClient from "@/components/ats/ATSCheckerClient";
import JsonLd from "@/components/ui/JsonLd";
import { CANONICAL_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ATS Resume Checker",
  description: "Check your resume match score against any job description. Scan for missing keywords, format errors, and keyword density issues.",
};

export default function ATSPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${SITE_NAME} ATS Checker`,
    "url": `${CANONICAL_URL}/ats-checker/`,
    "description": "An offline-safe, browser-based tool to check resume ATS compatibility and keyword matching score.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <JsonLd data={jsonLdData} />
      
      {/* Intro block */}
      <div className="max-w-2xl">
        <span className="label-micro text-xs text-accent-text">Optimization Tool</span>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-ink tracking-tight mt-1.5 mb-3">
          ATS Resume Match Checker
        </h1>
        <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
          Pasting a job description extracts industry-standard key terms. Select your saved resume to check overlap, review formatting alerts, and see missing terms.
        </p>
      </div>

      <ATSCheckerClient />
    </div>
  );
}
