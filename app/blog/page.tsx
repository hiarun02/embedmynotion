import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import Link from "next/link";

import { blogPosts } from "@/lib/blog";

const [featuredPost, ...morePosts] = blogPosts;

export default function BlogPage() {
  return (
    <main className="blog-page" id="top">
      <section className="site-frame blog-hero">
        <span className="blog-eyebrow"><BookOpen /> EMBEDMYNOTION JOURNAL</span>
        <h1>Notes on bringing Notion to the web.</h1>
        <p>Practical guides for creating clearer pages, cleaner embeds, and calmer publishing workflows.</p>
      </section>

      <section className="blog-index-section">
        <div className="site-frame blog-index-frame">
          <div className="blog-section-heading">
            <div><span>FEATURED GUIDE</span><h2>Start with the essentials.</h2></div>
            <p>Useful details for publishing your first page and improving the next one.</p>
          </div>

          <Link className="featured-post" href={`/blog/${featuredPost.slug}`}>
            <div className="featured-post-copy">
              <div className="post-meta"><span>{featuredPost.category}</span><i />{featuredPost.publishedAt}<i /><Clock3 />{featuredPost.readTime}</div>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              <span className="read-link">Read the guide <ArrowRight /></span>
            </div>
            <div className="featured-post-art" aria-hidden="true">
              <span className="art-window-bar"><i /><i /><i /></span>
              <div className="art-document">
                <b>N</b><span /><span /><span /><span />
              </div>
              <div className="art-code">&lt;iframe /&gt;</div>
            </div>
          </Link>

          <div className="blog-section-heading latest-heading">
            <div><span>LATEST</span><h2>More from the journal.</h2></div>
          </div>

          <div className="post-grid">
            {morePosts.map((post, index) => (
              <Link className={`post-card accent-${post.accent}`} href={`/blog/${post.slug}`} key={post.slug}>
                <div className="post-card-top"><span>0{index + 2}</span><ArrowRight /></div>
                <div className="post-card-body">
                  <div className="post-meta"><span>{post.category}</span><i />{post.readTime}</div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
