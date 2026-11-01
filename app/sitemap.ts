import type { MetadataRoute } from "next";

import { blogPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: "2026-11-01",
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: "2026-11-01",
    },
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAtIso,
    })),
  ];
}
