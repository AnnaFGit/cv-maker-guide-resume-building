import Image from "next/image";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import AdSlot from "@/components/ui/AdSlot";
import JsonLd from "@/components/ui/JsonLd";

export default function Home() {
  const faqs = [
    {
      q: "What is an ATS and why does it matter?",
      a: "An Applicant Tracking System (ATS) is software used by employers to screen and rank resumes based on keyword matching and formatting rules. If a resume has tables, sidebars, images, or lacks key phrases from the job description, the ATS can fail to parse it correctly, resulting in an automatic rejection before a human recruiter even sees it.",
    },
    {
      q: "Why is a single-column layout recommended?",
      a: "Multi-column layouts and sidebars are notoriously difficult for older ATS parsers to read. They often read text straight across left-to-right, mixing sentences from different columns together. A clean, single-column vertical layout ensures your content is read in the exact order you intended by both bots and humans.",
    },
    {
      q: "Should I include a photo on my CV?",
      a: "For most English-speaking markets (especially the US, UK, and Canada), you should NOT include a photo. Many companies automatically reject resumes with photos to avoid unconscious bias and comply with anti-discrimination laws. Only include a photo if it is standard in your local region or industry (e.g., acting).",
    },
    {
      q: "Can I download and export my CV for free?",
      a: "Yes. CV Maker Guide is entirely free. There are no premium paywalls, no limits on the number of resumes you can build, and no paid upgrades. Your data is stored locally in your browser (IndexedDB) and you can export a fully selectable, ATS-compliant PDF instantly.",
    },
  ];

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <JsonLd data={faqPageSchema} />
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 py-8 md:py-12 max-w-2xl mx-auto">
        <div className="bg-paper border border-border p-4.5 rounded-2xl shadow-sm inline-flex items-center justify-center">
          <Image
            src="/icons/icon.svg"
            alt="CV Icon"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          Write a CV that <span className="text-accent">gets you hired</span>.
        </h1>
        <p className="font-sans text-base md:text-lg text-muted leading-relaxed">
          Create an ATS-safe resume, optimize it for job descriptions with our match checker, and master CV writing principles. 100% free, private, and local.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <Link href="/course/" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" fullWidth>
              CV Writing Masterclass
            </Button>
          </Link>
          <Link href="/builder/" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" fullWidth>
              Build Your CV
            </Button>
          </Link>
        </div>
      </section>

      {/* Answer-First SEO block */}
      <section className="bg-surface/50 border border-border rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
        <h2 className="label-micro text-xs text-accent-text mb-3">Professional CV Best Practice</h2>
        <p className="font-sans text-md text-ink-2 leading-relaxed">
          <strong>How do I build a professional, ATS-friendly CV?</strong> The answer is straightforward: use a standard reverse-chronological layout, structure your sections clearly (Contact, Summary, Experience, Education, Skills), focus your work descriptions on quantified results rather than lists of duties, and keep formatting clean. Avoid sidebars, icons, graphics, or tables, which scramble parsing engines. Use our builder and ATS matching tool to verify your content before applying.
        </p>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverEffect className="flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-accent-text bg-accent/10 p-2.5 rounded-xl w-fit">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-ink">CV Builder</h3>
            <p className="text-sm text-muted leading-relaxed">
              Create and edit single-column, ATS-safe resumes. Pre-filled with realistic sample data to start, and auto-saves to your local browser storage.
            </p>
          </div>
          <Link href="/builder/" className="mt-2">
            <span className="text-sm font-semibold text-accent-text hover:text-accent inline-flex items-center gap-1">
              Open Builder &rarr;
            </span>
          </Link>
        </Card>

        <Card hoverEffect className="flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-accent-text bg-accent/10 p-2.5 rounded-xl w-fit">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-ink">ATS Keyword Matcher</h3>
            <p className="text-sm text-muted leading-relaxed">
              Paste a target job description and compare it with your CV. Get an instant score, see missing industry keywords, and remove keyword stuffing.
            </p>
          </div>
          <Link href="/ats-checker/" className="mt-2">
            <span className="text-sm font-semibold text-accent-text hover:text-accent inline-flex items-center gap-1">
              Check ATS Score &rarr;
            </span>
          </Link>
        </Card>

        <Card hoverEffect className="flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-accent-text bg-accent/10 p-2.5 rounded-xl w-fit">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-ink">Cover Letter</h3>
            <p className="text-sm text-muted leading-relaxed">
              Write a tailored cover letter using professional templates, customize recipient details, and export a polished PDF.
            </p>
          </div>
          <Link href="/cover-letter/" className="mt-2">
            <span className="text-sm font-semibold text-accent-text hover:text-accent inline-flex items-center gap-1">
              Write Cover Letter &rarr;
            </span>
          </Link>
        </Card>

        <Card hoverEffect className="flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-accent-text bg-accent/10 p-2.5 rounded-xl w-fit">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-ink">CV Writing Course</h3>
            <p className="text-sm text-muted leading-relaxed">
              Read 9 bite-sized lessons explaining formats, structures, experience bullets,cover letters, and employment gaps. Test your knowledge with a quiz.
            </p>
          </div>
          <Link href="/course/" className="mt-2">
            <span className="text-sm font-semibold text-accent-text hover:text-accent inline-flex items-center gap-1">
              Start Learning &rarr;
            </span>
          </Link>
        </Card>
      </section>

      {/* Ad slot */}
      <AdSlot slotId="home-page-ad" className="max-w-3xl mx-auto" />

      {/* FAQs Section */}
      <section className="max-w-2xl mx-auto w-full py-4">
        <h2 className="font-serif text-2xl font-bold text-ink text-center mb-6">Frequently Asked Questions</h2>
        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <Accordion key={index} title={faq.q}>
              {faq.a}
            </Accordion>
          ))}
        </div>
      </section>
    </div>
  );
}
