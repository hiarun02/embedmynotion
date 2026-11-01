import { BookOpen } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { blogPosts } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "EmbedMyNotion Journal",
    description:
      "Practical guides for responsive Notion embeds, secure sharing, layout customization, and web publishing.",
    url: absoluteUrl("/blog"),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAtIso,
      dateModified: post.updatedAtIso,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };

  return (
    <main className="blog-page" id="top">
      <JsonLd data={jsonLd} />
      <section className="site-frame blog-hero">
        <span className="blog-eyebrow"><BookOpen /> EMBEDMYNOTION JOURNAL</span>
        <h1>Notes on bringing Notion to the web.</h1>
        <p>Practical guides for creating clearer pages, cleaner embeds, and calmer publishing workflows.</p>
      </section>

      <section className="blog-index-section">
        <div className="site-frame blog-index-frame">
          <div className="blog-list">
            {blogPosts.map((post) => (
              <Link className="blog-list-item" href={`/blog/${post.slug}`} key={post.slug}>
                <article>
                  <h2>{post.title}</h2>
                  <p className="blog-list-author">EmbedMyNotion Team</p>
                  <p className="blog-list-description">{post.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
