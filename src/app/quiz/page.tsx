import { Metadata } from "next";
import QuizClient from "@/components/quiz/QuizClient";
import JsonLd from "@/components/ui/JsonLd";
import { CANONICAL_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CV Writing Knowledge Quiz",
  description: "Test your understanding of resume formatting, ATS systems, and professional writing standards.",
};

export default function QuizPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${SITE_NAME} Knowledge Quiz`,
    "url": `${CANONICAL_URL}/quiz/`,
    "description": "An interactive knowledge quiz to test resume formatting, ATS systems, and writing standards.",
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
        "name": "CV Quiz",
        "item": `${CANONICAL_URL}/quiz/`
      }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLd data={breadcrumbSchema} />
      <QuizClient />
    </>
  );
}
