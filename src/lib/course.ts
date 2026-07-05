import fs from "fs";
import path from "path";

export interface Lesson {
  index: number;
  slug: string;
  title: string;
  minutes: number;
  type: "article" | "howto";
  content: string;
}

const courseDirectory = path.join(process.cwd(), "src/content/course");

export function getLessonSlugs(): string[] {
  if (!fs.existsSync(courseDirectory)) {
    return [];
  }
  return fs.readdirSync(courseDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}

export function getLessonBySlug(slug: string): Lesson {
  const fullPath = path.join(courseDirectory, `${slug}.json`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(fileContents);
}

export function getAllLessons(): Lesson[] {
  const slugs = getLessonSlugs();
  const lessons = slugs.map((slug) => getLessonBySlug(slug));
  return lessons.sort((a, b) => a.index - b.index);
}
