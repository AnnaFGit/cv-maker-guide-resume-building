import { Metadata } from "next";
import CVList from "@/components/builder/CVList";
import JsonLd from "@/components/ui/JsonLd";
import { CANONICAL_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free ATS CV Builder",
  description: "Create a professional, ATS-optimized CV for free. Single-column layouts, industry-approved structures, and instantaneous PDF export.",
};

export default function BuilderPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${SITE_NAME} CV Builder`,
    "url": `${CANONICAL_URL}/builder/`,
    "description": "A completely free, client-side, ATS-compliant CV builder that stores data locally in the browser.",
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
      
      {/* SEO Intro Shell */}
      <div className="max-w-2xl">
        <span className="label-micro text-xs text-accent-text">Online Utility</span>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-ink tracking-tight mt-1.5 mb-3">
          Free ATS Resume Builder
        </h1>
        <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
          Design single-column resumes that easily pass applicant tracking systems. All data is kept on your device - never sent to external servers. No accounts required.
        </p>
      </div>

      {/* Client List (IndexedDB) */}
      <CVList />
    </div>
  );
}
