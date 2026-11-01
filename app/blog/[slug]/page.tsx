import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock3, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const instant = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return {};

  return {
    title: { absolute: `${post.title} | ${siteConfig.name}` },
    description: post.excerpt,
    authors: [{ name: "EmbedMyNotion Team", url: absoluteUrl("/") }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAtIso,
      modifiedTime: post.updatedAtIso,
      authors: [siteConfig.name],
      section: post.category,
      images: [
        {
          url: `/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`/blog/${post.slug}/opengraph-image`],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const relatedPosts = blogPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 2);
  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const organizationId = absoluteUrl("/#organization");
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAtIso,
      dateModified: post.updatedAtIso,
      mainEntityOfPage: postUrl,
      url: postUrl,
      image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
      articleSection: post.category,
      inLanguage: "en",
      author: {
        "@type": "Organization",
        name: "EmbedMyNotion Team",
        url: absoluteUrl("/"),
      },
      publisher: {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icon.svg"),
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: absoluteUrl("/blog"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: postUrl,
        },
      ],
    },
  ];

  return (
    <main className="article-page" id="top">
      <JsonLd data={jsonLd} />
      <article className="site-frame article-frame">
        <Link className="article-back" href="/blog"><ArrowLeft /> Back to the journal</Link>
        <header className="article-header">
          <div className="post-meta">
            <span>{post.category}</span>
            <i />
            <time dateTime={post.publishedAtIso}>Published {post.publishedAt}</time>
            {post.updatedAt ? (
              <>
                <i />
                <time dateTime={post.updatedAtIso}>Updated {post.updatedAt}</time>
              </>
            ) : null}
            <i />
            <span>By EmbedMyNotion Team</span>
            <i />
            <Clock3 />{post.readTime}
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </header>

        {post.quickAnswer ? (
          <section className="article-quick-answer" aria-label="Quick answer">
            <span>QUICK ANSWER</span>
            <p>{post.quickAnswer}</p>
          </section>
        ) : null}

        <div className="article-layout">
          <div className="article-content">
            {post.sections.map((section, index) => (
              <section key={section.heading}>
                <span className="article-section-number">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.note ? <aside className="article-note">{section.note}</aside> : null}
                {section.code ? <pre className="article-code"><code>{section.code}</code></pre> : null}
                {section.image?.steps ? (
                  <div className="article-step-gallery" aria-label={section.image.caption}>
                    {section.image.steps.map((step) => (
                      <figure className="article-step-card" key={step.label}>
                        <div className="article-step-image">
                          <Image
                            src={step.src}
                            alt={step.alt}
                            width={step.width}
                            height={step.height}
                            sizes="(max-width: 760px) calc(100vw - 72px), 360px"
                          />
                        </div>
                        <figcaption>
                          <span>{step.label}</span>
                          <h3>{step.title}</h3>
                          <p>{step.description}</p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ) : section.image ? (
                  <figure className="article-image">
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={section.image.width}
                      height={section.image.height}
                      sizes="(max-width: 760px) calc(100vw - 36px), 780px"
                    />
                    {section.image.caption ? <figcaption>{section.image.caption}</figcaption> : null}
                  </figure>
                ) : null}
                {section.sources ? (
                  <div className="article-sources">
                    <span>Official references</span>
                    {section.sources.map((source) => (
                      <a href={source.href} key={source.href} target="_blank" rel="noreferrer">
                        {source.label}
                        <ExternalLink aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>

        <footer className="article-footer">
          <div><span>KEEP READING</span><h2>More practical guides.</h2></div>
          <div className="article-related">
            {relatedPosts.map((related) => (
              <Link href={`/blog/${related.slug}`} key={related.slug}>{related.title}<ArrowRight /></Link>
            ))}
          </div>
        </footer>
      </article>
    </main>
  );
}
