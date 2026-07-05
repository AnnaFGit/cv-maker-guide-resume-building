import { getLessonSlugs, getLessonBySlug, getAllLessons } from "@/lib/course";
import LessonClient from "@/components/course/LessonClient";
import JsonLd from "@/components/ui/JsonLd";
import { CANONICAL_URL } from "@/lib/constants";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug === "%5Bslug%5D" || slug === "[slug]") {
    return {
      title: "Course Lesson",
    };
  }
  
  try {
    const lesson = getLessonBySlug(slug);
    return {
      title: `${lesson.title} · Lesson ${lesson.index}`,
      description: `Lesson ${lesson.index} of 9 in our CV Writing Course: ${lesson.title}. Learn best practices.`,
    };
  } catch {
    return {
      title: "Course Lesson",
    };
  }
}

// Lesson-specific FAQs for Accordion rendering & FAQPage Schema (AI search visibility)
const LESSON_FAQS: Record<string, { q: string; a: string }[]> = {
  "resume-formats": [
    {
      q: "Which resume format is best for career changers?",
      a: "The combination format is best for career changers because it highlights transferable skills up front while maintaining a chronological history.",
    },
    {
      q: "Why should I avoid functional resumes?",
      a: "Many modern ATS parsers scramble functional formats, and recruiters view them with suspicion as they can hide employment gaps.",
    },
  ],
  "resume-structure": [
    {
      q: "Should I include my full address on my CV?",
      a: "No, only include your city and country. Full addresses are unnecessary and present privacy risks.",
    },
    {
      q: "Can I use creative section headings?",
      a: "Keep headings standard (like 'Experience', 'Education', 'Skills') so ATS scanners can parse your sections correctly.",
    },
  ],
  "experience-bullets": [
    {
      q: "What formula should I use for resume bullet points?",
      a: "Use: Action Verb + What you did + Measurable Result (e.g. 'Grew sales 20% by implementing X').",
    },
    {
      q: "How many bullet points per job should I include?",
      a: "Aim for 3 to 5 bullet points for your most recent roles, and fewer for older positions.",
    },
  ],
  "resume-style": [
    {
      q: "Is a one-page resume mandatory?",
      a: "One page is standard for most job seekers, but a two-page resume is acceptable if you have over 10 years of relevant experience.",
    },
    {
      q: "What file format is best for ATS parsing?",
      a: "PDF is best as it preserves your layout, unless the employer specifically requests a Microsoft Word (.docx) file.",
    },
  ],
  "ats-keywords": [
    {
      q: "How do ATS keyword scanners work?",
      a: "ATS systems perform literal keyword matching. You must use the exact terms and acronyms from the job description.",
    },
    {
      q: "What is keyword stuffing on a resume?",
      a: "Keyword stuffing is repeating keywords excessively or hiding text in white. It is flagged by ATS and reads poorly to recruiters.",
    },
  ],
  "cover-letter": [
    {
      q: "How long should a cover letter be?",
      a: "Keep your cover letter to a single page, ideally between 200 and 250 words across three to four short paragraphs.",
    },
    {
      q: "Do I always need to send a cover letter?",
      a: "Yes, unless the job description explicitly instructs you not to include one.",
    },
  ],
  "employment-gaps": [
    {
      q: "How do I explain employment gaps on my CV?",
      a: "Be honest, brief, and matter-of-fact. State the reason simply (e.g., 'Career break for caregiving') and highlight any courses or volunteer work.",
    },
  ],
  "linkedin": [
    {
      q: "Should my LinkedIn match my CV?",
      a: "Yes, job titles and dates should align perfectly to establish trust, though LinkedIn can be written in a more conversational first-person tone.",
    },
  ],
  "resume-services": [
    {
      q: "Is it worth paying for a professional resume review?",
      a: "It is worth it if you are applying for executive roles, making a major career transition, or receiving no callbacks after dozens of applications.",
    },
  ],
};

export default async function LessonPage({ params }: RouteProps) {
  const { slug } = await params;
  if (!slug || slug === "%5Bslug%5D" || slug === "[slug]") {
    return notFound();
  }
  
  let lesson;
  let prevLesson = null;
  let nextLesson = null;
  
  try {
    lesson = getLessonBySlug(slug);
    const allLessons = getAllLessons();
    
    // Find prev/next lessons
    const currentIndex = allLessons.findIndex((l) => l.slug === slug);
    if (currentIndex === -1) {
      return notFound();
    }
    prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  } catch {
    return notFound();
  }

  const lessonUrl = `${CANONICAL_URL}/course/${slug}/`;
  const faqs = LESSON_FAQS[slug] || [];

  // 1. BreadcrumbList Schema
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
        "name": "CV Course",
        "item": `${CANONICAL_URL}/course/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": lesson.title,
        "item": lessonUrl
      }
    ]
  };

  // 2. Article / HowTo Schema
  let mainSchema: Record<string, unknown> = {};
  if (lesson.type === "howto") {
    mainSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": lesson.title,
      "description": `Step-by-step tutorial: ${lesson.title}`,
      "url": lessonUrl,
      "step": [
        {
          "@type": "HowToStep",
          "name": "Learn the concepts",
          "text": `Study the core recommendations on ${lesson.title} presented in this lesson.`
        }
      ]
    };
  } else {
    mainSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": lesson.title,
      "description": `Learn about ${lesson.title} in lesson ${lesson.index} of our CV Writing Course.`,
      "url": lessonUrl,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": lessonUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "CV Maker Guide"
      }
    };
  }

  // 3. FAQPage Schema
  const faqSchema = faqs.length > 0 ? {
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
  } : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={mainSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <LessonClient
        lesson={lesson}
        prevSlug={prevLesson?.slug || null}
        nextSlug={nextLesson?.slug || null}
        nextTitle={nextLesson?.title || null}
        faqs={faqs}
      />
    </>
  );
}
