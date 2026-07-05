import { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/builder/edit/",
        "/builder/edit/*",
      ],
    },
    sitemap: `${CANONICAL_URL}/sitemap.xml`,
  };
}
