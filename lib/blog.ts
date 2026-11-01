export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  accent: "orange" | "ink" | "sand" | "mint";
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-embed-a-notion-page",
    title: "How to embed a Notion page on any website",
    excerpt: "A practical walkthrough for taking a public Notion page from link to responsive website embed.",
    category: "Guide",
    publishedAt: "November 1, 2026",
    readTime: "6 min read",
    accent: "orange",
    sections: [
      {
        heading: "Start with a page that is ready to share",
        paragraphs: [
          "Before you create an embed, review the page as a visitor would. Remove private notes, confirm that every linked resource can be shared, and give the page a clear title.",
          "The page must be publicly accessible for a public embed to load. Open the shared link in a private browser window first; if it works there, you have a useful baseline for testing the embed.",
        ],
      },
      {
        heading: "Choose the frame before the details",
        paragraphs: [
          "Decide where the page will live on your site and how much space it should receive. A documentation page can use a wide frame, while a resource inside a marketing page often works better in a more focused column.",
        ],
        bullets: [
          "Use enough height to keep the first screen of content useful.",
          "Avoid a fixed width that can overflow on smaller screens.",
          "Match the surrounding page spacing before tuning small visual details.",
        ],
      },
      {
        heading: "Preview the responsive states",
        paragraphs: [
          "Check the result at desktop, tablet, and mobile widths. Look for clipped tables, long headings, and callouts that become difficult to scan. The host page and the embedded content both influence the final experience.",
          "Once the preview feels right, copy the generated snippet into a block or component that accepts embeds, publish the host page, and test the live URL once more.",
        ],
      },
    ],
  },
  {
    slug: "layout-settings-for-clean-notion-embeds",
    title: "Layout settings for a cleaner Notion embed",
    excerpt: "How width, padding, borders, and corner radius work together to make an embed feel native to your site.",
    category: "Design",
    publishedAt: "November 1, 2026",
    readTime: "5 min read",
    accent: "ink",
    sections: [
      {
        heading: "Treat the embed like part of the page",
        paragraphs: [
          "A clean embed does not call attention to its frame. It supports the content and follows the visual rhythm already established by the surrounding website.",
          "Begin with the host page: note its content width, horizontal padding, corner treatment, and border color. Use those values as references instead of choosing each embed setting in isolation.",
        ],
      },
      {
        heading: "Use spacing to create hierarchy",
        paragraphs: [
          "Padding separates the embedded document from its frame. Too little makes the content feel cramped; too much can make the document feel disconnected from the rest of the page.",
        ],
        bullets: [
          "Start with moderate padding and reduce it for narrow mobile layouts.",
          "Keep the frame radius close to the radius used by cards on the host site.",
          "Use a border only when it helps separate similar background colors.",
        ],
      },
      {
        heading: "Make one change at a time",
        paragraphs: [
          "Adjust a single setting, review the preview, and then continue. This makes it easier to see which choices improve the result and prevents a collection of small changes from fighting one another.",
        ],
      },
    ],
  },
  {
    slug: "notion-page-publishing-checklist",
    title: "A checklist before publishing your Notion page",
    excerpt: "The content, access, and responsive checks worth completing before an embed goes live.",
    category: "Workflow",
    publishedAt: "November 1, 2026",
    readTime: "4 min read",
    accent: "sand",
    sections: [
      {
        heading: "Review content and access together",
        paragraphs: [
          "A polished page can still fail if a linked document or database is not available to visitors. Check the page structure and its sharing state in the same review pass.",
        ],
        bullets: [
          "Remove internal comments, temporary notes, and empty sections.",
          "Confirm the main page is public and every essential link is accessible.",
          "Open the public URL while signed out of Notion.",
        ],
      },
      {
        heading: "Check the first screen",
        paragraphs: [
          "Visitors decide quickly whether a resource is relevant. Make sure the title, short introduction, and first useful section are visible without excessive scrolling inside the frame.",
          "Long cover images and large blank areas can push the substance too far down. Simplifying the top of the document often improves the embed more than another visual setting.",
        ],
      },
      {
        heading: "Test the published host page",
        paragraphs: [
          "The editor preview is only one environment. After publishing, load the real page on more than one screen size and verify that scrolling, links, and surrounding page spacing behave as expected.",
        ],
      },
    ],
  },
  {
    slug: "notion-embed-or-duplicate-cms",
    title: "Notion embed or duplicate CMS content?",
    excerpt: "A simple framework for deciding when to embed a Notion page and when to create native website content instead.",
    category: "Strategy",
    publishedAt: "November 1, 2026",
    readTime: "7 min read",
    accent: "mint",
    sections: [
      {
        heading: "Start with the editing workflow",
        paragraphs: [
          "Embedding is useful when the people responsible for a resource already maintain it in Notion. It can reduce duplicate updates and keep ownership close to the team doing the work.",
          "Native website content can be a better fit when the page requires deep integration with navigation, search, structured metadata, or a highly specific interactive presentation.",
        ],
      },
      {
        heading: "Good candidates for an embed",
        paragraphs: [
          "Frequently updated resources with a clear document structure are often strong candidates, especially when the audience benefits from seeing the latest version without waiting for a separate site update.",
        ],
        bullets: [
          "Public handbooks and reference material",
          "Launch notes, changelogs, and resource collections",
          "Event information and lightweight documentation",
        ],
      },
      {
        heading: "Choose deliberately",
        paragraphs: [
          "The goal is not to embed every page. Choose the approach that keeps the content accurate while giving visitors a clear and comfortable reading experience. Review that choice again when the resource or audience changes.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
