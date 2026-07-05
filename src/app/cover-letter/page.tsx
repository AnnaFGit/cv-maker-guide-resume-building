import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CLList from "@/components/coverletter/CLList";
import JsonLd from "@/components/ui/JsonLd";
import Accordion from "@/components/ui/Accordion";
import { CANONICAL_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Cover Letter Builder - Write a Tailored Cover Letter",
  description:
    "Write a professional, tailored cover letter with our free builder. Choose a structure, fill in your details, and export a polished PDF - no AI, no sign-up, all data stays on your device.",
};

export default function CoverLetterPage() {
  const sections = [
    {
      title: "1. The Opening Hook",
      desc: "State clearly what role you're applying for and why you're interested. Avoid generic statements like 'I am writing to express my interest in...'. Instead, open with a strong value proposition or a notable achievement that matches their requirements.",
    },
    {
      title: "2. The Body (1–2 Paragraphs)",
      desc: "Focus on two or three concrete achievements that address the company's pain points. Do not simply restate what is in your CV; expand on the stories behind your results. Quantify your achievements (percentages, time saved, money earned) to build authority.",
    },
    {
      title: "3. The Call-to-Action Close",
      desc: "End with a confident, brief closing statement. State that you look forward to discussing how your experience can help them achieve their goals. Thank them for their time. Keep the sign-off formal ('Sincerely' or 'Best regards').",
    },
  ];

  const faqItems = [
    {
      title: "How long should a cover letter be?",
      content:
        "Keep it to one page, ideally between 150 and 250 words. Hiring managers scan quickly - a concise, results-focused letter outperforms a lengthy one every time.",
    },
    {
      title: "Should I always include a cover letter?",
      content:
        "Include one unless the posting explicitly says not to. A tailored cover letter shows effort and can differentiate you from candidates who only submit a CV.",
    },
    {
      title: "How do I tailor a cover letter to a specific job?",
      content:
        "Read the job description carefully. Identify 2–3 key requirements and address them directly with specific achievements. Mention the company by name and reference something concrete about their goals or recent work.",
    },
    {
      title: "What should I avoid in a cover letter?",
      content:
        'Avoid clichés like "I am a team player" or "I am passionate about excellence." Don\'t simply repeat your CV. Don\'t use "To Whom It May Concern" — find the hiring manager\'s name or use the team name.',
    },
    {
      title: "Is this builder free? Does it use AI?",
      content:
        "Yes, it's completely free. No AI is used - all drafts are assembled from professional sentence templates that you customize. Your data never leaves your browser.",
    },
  ];

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Write a Cover Letter",
    description:
      "A step-by-step guide to writing a professional cover letter that complements your CV.",
    step: sections.map((sec, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: sec.title,
      text: sec.desc,
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content,
      },
    })),
  };

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_NAME} Cover Letter Builder`,
    url: `${CANONICAL_URL}/cover-letter/`,
    description:
      "A free, client-side cover letter builder that stores data locally in the browser. No AI, no sign-up.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: CANONICAL_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cover Letter Builder",
        item: `${CANONICAL_URL}/cover-letter/`,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in">
      <JsonLd data={jsonLdHowTo} />
      <JsonLd data={jsonLdFaq} />
      <JsonLd data={jsonLdApp} />
      <JsonLd data={jsonLdBreadcrumb} />

      {/* Header */}
      <div>
        <span className="label-micro text-xs text-accent-text">
          Free Tool + Writing Guide
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-ink tracking-tight mt-1.5 mb-3">
          Cover Letter Builder
        </h1>
        <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
          Write a tailored cover letter that complements your resume. Choose a
          structure, fill in your details, and export a polished PDF - all on
          your device, no sign-up required.
        </p>
      </div>

      {/* Cover Letter List + CTA */}
      <CLList />

      {/* Cross-links */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/builder/" className="flex-1">
          <Card hoverEffect className="flex items-center gap-3 h-full">
            <svg className="h-6 w-6 text-accent-text shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <span className="font-serif font-bold text-sm text-ink block">Build Your CV</span>
              <span className="text-[10px] text-muted-2 font-sans">Create the resume that goes with this letter.</span>
            </div>
          </Card>
        </Link>
        <Link href="/course/cover-letter/" className="flex-1">
          <Card hoverEffect className="flex items-center gap-3 h-full">
            <svg className="h-6 w-6 text-accent-text shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <span className="font-serif font-bold text-sm text-ink block">Cover Letter Lesson</span>
              <span className="text-[10px] text-muted-2 font-sans">Learn the theory in our free course.</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Writing Guide */}
      <div className="flex flex-col gap-5">
        <h2 className="label-micro text-xs text-muted">
          The Cover Letter Blueprint
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {sections.map((sec, idx) => (
            <Card key={idx} className="flex flex-col gap-2">
              <h3 className="font-serif text-lg font-bold text-ink">
                {sec.title}
              </h3>
              <p className="font-sans text-sm text-ink-2 leading-relaxed">
                {sec.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Sample Template */}
      <section className="flex flex-col gap-3">
        <h2 className="label-micro text-xs text-muted">
          Sample Cover Letter Format
        </h2>
        <Card className="font-serif text-xs md:text-sm text-zinc-800 bg-white p-6 md:p-8 border-border-strong flex flex-col gap-4 shadow-sm select-text">
          <div className="flex flex-col gap-1 border-b border-zinc-200 pb-3 text-zinc-500 font-sans text-[11px] leading-none">
            <span>
              [Your Name] &middot; [Your Email] &middot; [Your Phone]
            </span>
            <span className="mt-1">
              [City, Country] &middot; [LinkedIn Profile URL]
            </span>
          </div>

          <div className="flex flex-col gap-0.5 text-zinc-600 font-sans text-[11px]">
            <span>Date: [Today&apos;s Date]</span>
            <span>To: [Hiring Manager Name / Title]</span>
            <span>Company: [Company Name]</span>
          </div>

          <p className="font-sans font-bold text-zinc-950 mt-1">
            Subject: Application for [Role Title] - [Your Name]
          </p>

          <p>Dear [Hiring Manager Name or Hiring Team],</p>

          <p>
            I am writing to apply for the [Role Title] position at [Company
            Name]. Having followed [Company Name]&apos;s recent milestones in
            [mention a project or company goal], I am incredibly excited to help
            your team achieve [mention a pain point or target objective]. As a
            [Your Title] with [number] years of experience, I specialize in
            [mention 1-2 core skills].
          </p>

          <p>
            In my previous role as [Your Current/Previous Title] at [Previous
            Company], I successfully [describe a concrete, quantified
            achievement, e.g., grew sales by 25% or reduced loading latency by
            40%]. By implementing [what you did], I was able to [describe the
            outcome or value delivered]. Additionally, I have a proven track
            record of [mention a secondary skill, e.g., collaborating across
            teams or database optimization], which aligns perfectly with your
            requirement for [mention a specific requirement from the job post].
          </p>

          <p>
            I look forward to the opportunity to discuss how my results-driven
            approach to [Your Field/Skill] can add value to your team at
            [Company Name]. Thank you for your time and consideration.
          </p>

          <div className="mt-2">
            <p>Sincerely,</p>
            <p className="font-bold text-zinc-900 mt-2">[Your Name]</p>
          </div>
        </Card>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-3">
        <h2 className="label-micro text-xs text-muted">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-2">
          {faqItems.map((faq, idx) => (
            <Accordion key={idx} title={faq.title}>
              <p className="font-sans text-sm text-ink-2 leading-relaxed">
                {faq.content}
              </p>
            </Accordion>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface border border-border p-6 rounded-2xl">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink">
            Need to check your resume match?
          </h3>
          <p className="text-xs text-muted-2 mt-0.5">
            Use our checker to inspect how well your CV aligns with job
            descriptions.
          </p>
        </div>
        <Link href="/ats-checker/" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full">
            Check ATS Score
          </Button>
        </Link>
      </div>
    </div>
  );
}
