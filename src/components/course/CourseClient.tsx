"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

interface LessonMeta {
  index: number;
  slug: string;
  title: string;
  minutes: number;
  type: "article" | "howto";
}

interface CourseClientProps {
  lessons: LessonMeta[];
}

export default function CourseClient({ lessons }: CourseClientProps) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("completed_lessons");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setCompletedSlugs(parsed), 0);
      } catch (err) {
        console.error("Failed to parse course progress", err);
      }
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  const progressPercentage = lessons.length > 0 
    ? (completedSlugs.length / lessons.length) * 100 
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Card */}
      {isLoaded && (
        <Card className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="w-full md:max-w-md">
            <ProgressBar value={progressPercentage} showText />
          </div>
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <Link href="/quiz/" className="flex-1 md:flex-none">
              <Button variant="secondary" size="sm" className="w-full">
                Take Knowledge Quiz
              </Button>
            </Link>
            <Link href="/checklist/" className="flex-1 md:flex-none">
              <Button variant="secondary" size="sm" className="w-full">
                CV Checklist
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Lessons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons.map((lesson) => {
          const isCompleted = completedSlugs.includes(lesson.slug);
          
          return (
            <Link key={lesson.slug} href={`/course/${lesson.slug}/`} className="focus-ring rounded-2xl">
              <Card hoverEffect className="relative flex flex-col h-full justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="label-micro text-[10px] text-muted">
                      Lesson {lesson.index} &middot; {lesson.minutes} min
                    </span>
                    {isLoaded && isCompleted && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-full">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-ink hover:text-accent-text transition-colors">
                    {lesson.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-2">
                    {lesson.type === "article" ? "Perspective Piece" : "How-To Guide"}
                  </span>
                  <span className="text-xs font-bold text-accent-text group-hover:text-accent flex items-center gap-0.5">
                    Read Lesson &rarr;
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
