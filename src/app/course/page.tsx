import { getAllLessons } from "@/lib/course";
import CourseClient from "@/components/course/CourseClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Writing Course",
  description: "A free, 9-lesson guide covering resume structure, writing experience bullets, keyword optimization, cover letters, and gaps.",
};

export default function CoursePage() {
  const lessons = getAllLessons();

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <span className="label-micro text-xs text-accent-text">Education Pillar</span>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-ink tracking-tight mt-1.5 mb-3">
          CV Writing Masterclass
        </h1>
        <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
          Master the art of CV writing with our 9 bite-sized, practical lessons. Complete the lessons and test your knowledge in the final quiz.
        </p>
      </div>

      <CourseClient lessons={lessons} />
    </div>
  );
}
