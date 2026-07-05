import { Metadata } from "next";
import ChecklistClient from "@/components/checklist/ChecklistClient";
import JsonLd from "@/components/ui/JsonLd";
import { CANONICAL_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ATS Resume Checklist",
  description: "Verify your CV formatting, section layout, and content guidelines against this comprehensive ATS compliance checklist.",
};

export default function ChecklistPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${SITE_NAME} Checklist`,
    "url": `${CANONICAL_URL}/checklist/`,
    "description": "An interactive checklist for checking resume ATS compatibility and layout guidelines.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": CANONICAL_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "CV Checklist",
        "item": `${CANONICAL_URL}/checklist/`
      }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLd data={breadcrumbSchema} />
      <ChecklistClient />
    </>
  );
}
