import { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/builder/",
    "/ats-checker/",
    "/checklist/",
    "/quiz/",
    "/course/",
    "/cv-templates/",
    "/cover-letter/",
    "/course/resume-formats/",
    "/course/resume-structure/",
    "/course/experience-bullets/",
    "/course/resume-style/",
    "/course/ats-keywords/",
    "/course/cover-letter/",
    "/course/employment-gaps/",
    "/course/linkedin/",
    "/course/resume-services/",
  ];

  return routes.map((route) => ({
    url: `${CANONICAL_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes("/course/") ? "monthly" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
