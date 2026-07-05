"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import Accordion from "@/components/ui/Accordion";
import { openExternal } from "@/lib/bridge";

interface Lesson {
  index: number;
  slug: string;
  title: string;
  minutes: number;
  type: "article" | "howto";
  content: string;
}

interface LessonClientProps {
  lesson: Lesson;
  prevSlug: string | null;
  nextSlug: string | null;
  nextTitle: string | null;
  faqs?: { q: string; a: string }[];
}

export default function LessonClient({
  lesson,
  prevSlug,
  nextSlug,
  nextTitle,
  faqs = [],
}: LessonClientProps) {
  const [completed, setCompleted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("completed_lessons");
    if (saved) {
      try {
        const list = JSON.parse(saved) as string[];
        if (list.includes(lesson.slug)) {
          setTimeout(() => setCompleted(true), 0);
        }
      } catch (err) {
        console.error("Failed to parse progress", err);
      }
    }
  }, [lesson.slug]);

  const toggleCompleted = () => {
    const saved = localStorage.getItem("completed_lessons");
    let list: string[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved) as string[];
      } catch {
        list = [];
      }
    }

    if (completed) {
      list = list.filter((s) => s !== lesson.slug);
      setCompleted(false);
      setToastMsg("Lesson marked as unread.");
    } else {
      if (!list.includes(lesson.slug)) {
        list.push(lesson.slug);
      }
      setCompleted(true);
      setToastMsg("Lesson completed! Keep it up.");
    }
    
    localStorage.setItem("completed_lessons", JSON.stringify(list));
    setShowToast(true);
  };

  const handleExternalClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    openExternal(url);
  };

  // Parses inline markdown bold formatting (**text**)
  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold text-ink font-sans">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderContent = (contentStr: string) => {
    const blocks = contentStr.split("\n\n");
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      
      // Render bulleted list
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((item) => item.replace(/^-\s+/, ""));
        return (
          <ul key={idx} className="list-disc pl-6 my-5 space-y-2 text-ink-2 font-sans leading-relaxed text-sm md:text-base">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{formatInlineText(item)}</li>
            ))}
          </ul>
        );
      }
      
      // Render numbered list (e.g. 1. , 2. )
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split("\n").map((item) => item.replace(/^\d+\.\s+/, ""));
        return (
          <ol key={idx} className="list-decimal pl-6 my-5 space-y-2 text-ink-2 font-sans leading-relaxed text-sm md:text-base">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{formatInlineText(item)}</li>
            ))}
          </ol>
        );
      }

      // Render blockquote
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-accent bg-surface/40 rounded-r-xl px-4 py-3 my-6 italic text-muted-2 text-sm md:text-base font-sans"
          >
            {formatInlineText(trimmed.replace(/^>\s+/, ""))}
          </blockquote>
        );
      }

      // Default paragraph
      return (
        <p key={idx} className="text-ink-2 font-sans leading-relaxed my-4.5 text-sm md:text-base">
          {formatInlineText(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {showToast && (
        <Toast message={toastMsg} type="success" onClose={() => setShowToast(false)} />
      )}

      {/* Breadcrumbs / Back button */}
      <div>
        <Link href="/course/" className="text-sm font-semibold text-accent-text hover:text-accent flex items-center gap-1">
          &larr; Back to Curriculum
        </Link>
      </div>

      {/* Lesson Header */}
      <article className="bg-paper border border-border rounded-2xl p-6 md:p-8 shadow-[0_1px_3px_rgba(33,29,24,0.05)]">
        <header className="border-b border-border pb-5 mb-5">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="label-micro">Lesson {lesson.index} of 9</span>
            <span>{lesson.minutes} min read</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3.5xl font-extrabold text-ink tracking-tight leading-tight">
            {lesson.title}
          </h1>
        </header>

        {/* Content body */}
        <div className="prose max-w-none">
          {renderContent(lesson.content)}
        </div>

        {/* Affiliate links injected at lesson 9 */}
        {lesson.slug === "resume-services" && (
          <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
            <h4 className="font-serif text-lg font-bold text-ink">Recommended Resume Review Services</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://www.topresume.com/"
                onClick={(e) => handleExternalClick(e, "https://www.topresume.com/")}
                className="group flex flex-col p-4 border border-border-strong rounded-xl bg-surface hover:bg-paper transition-all focus-ring text-left"
              >
                <span className="font-bold text-accent-text text-sm group-hover:text-accent">TopResume</span>
                <span className="text-xs text-muted-2 mt-1">Professional resume writing services and expert reviews.</span>
              </a>
              <a
                href="https://livecareer.7eer.net/vDWdMd"
                onClick={(e) => handleExternalClick(e, "https://livecareer.7eer.net/vDWdMd")}
                className="group flex flex-col p-4 border border-border-strong rounded-xl bg-surface hover:bg-paper transition-all focus-ring text-left"
              >
                <span className="font-bold text-accent-text text-sm group-hover:text-accent">LiveCareer</span>
                <span className="text-xs text-muted-2 mt-1">Excellent templates, online builder, and quick resume polishing.</span>
              </a>
            </div>
          </div>
        )}

        {/* FAQs Section */}
        {faqs && faqs.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-serif text-lg font-bold text-ink mb-4">Lesson FAQ</h4>
            <div className="flex flex-col">
              {faqs.map((faq, index) => (
                <Accordion key={index} title={faq.q}>
                  {faq.a}
                </Accordion>
              ))}
            </div>
          </div>
        )}

        {/* Completion checkbox action */}
        <div className="mt-8 pt-6 border-t border-border flex justify-center">
          <Button
            variant={completed ? "secondary" : "primary"}
            onClick={toggleCompleted}
            className="flex items-center gap-2"
          >
            {completed ? (
              <>
                <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Completed (Mark Unread)
              </>
            ) : (
              "Mark Lesson as Complete"
            )}
          </Button>
        </div>
      </article>

      {/* Prev / Next Pagination */}
      <footer className="flex items-center justify-between">
        {prevSlug ? (
          <Link href={`/course/${prevSlug}/`}>
            <Button variant="secondary" size="sm">
              &larr; Previous Lesson
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextSlug ? (
          <Link href={`/course/${nextSlug}/`} className="text-right">
            <div className="hidden sm:block text-[10px] text-muted label-micro mb-1">Up Next</div>
            <Button variant="primary" size="sm">
              Next: {nextTitle?.split(" - ")[0] || "Lesson"} &rarr;
            </Button>
          </Link>
        ) : (
          <Link href="/quiz/">
            <Button variant="primary" size="sm">
              Take the Quiz! &rarr;
            </Button>
          </Link>
        )}
      </footer>
    </div>
  );
}
