import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, getBlogPost } from "@/lib/blog";

export const instant = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return {};

  return {
    title: `${post.title} | EmbedMyNotion`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const relatedPosts = blogPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 2);

  return (
    <main className="article-page" id="top">
      <article className="site-frame article-frame">
        <Link className="article-back" href="/blog"><ArrowLeft /> Back to the journal</Link>
        <header className="article-header">
          <div className="post-meta"><span>{post.category}</span><i />{post.publishedAt}<i /><Clock3 />{post.readTime}</div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </header>

        <div className="article-layout">
          <aside className="article-aside">
            <span>IN THIS GUIDE</span>
            <ol>
              {post.sections.map((section, index) => <li key={section.heading}><b>0{index + 1}</b>{section.heading}</li>)}
            </ol>
          </aside>

          <div className="article-content">
            {post.sections.map((section, index) => (
              <section key={section.heading}>
                <span className="article-section-number">0{index + 1}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
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
