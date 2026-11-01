export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
  code?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
    steps?: {
      label: string;
      title: string;
      description: string;
      src: string;
      alt: string;
      width: number;
      height: number;
    }[];
  };
  sources?: { label: string; href: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  publishedAtIso: string;
  updatedAtIso: string;
  updatedAt?: string;
  readTime: string;
  accent: "orange" | "ink" | "sand" | "mint";
  quickAnswer?: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-embed-a-notion-page",
    title: "How to Embed a Notion Page on Any Website",
    excerpt: "Learn how to embed a Notion page on any website, customize its theme and frame, protect access, fix common errors, and publish it step by step.",
    category: "Guide",
    publishedAt: "November 1, 2026",
    publishedAtIso: "2026-11-01",
    updatedAtIso: "2026-11-02",
    updatedAt: "November 2, 2026",
    readTime: "12 min read",
    accent: "orange",
    quickAnswer: "To embed a Notion page, publish the page, copy its public notion.site or notion.so URL, create an embed in EmbedMyNotion, customize the frame, and paste the generated iframe into your website’s HTML or embed block. Test the live page on desktop and mobile before sharing it.",
    sections: [
      {
        heading: "What a Notion page embed actually does",
        paragraphs: [
          "A Notion embed displays a published Notion page inside another website. The host page keeps its own navigation and design while an iframe loads the Notion content as a separate document. This is useful for handbooks, public roadmaps, resource libraries, documentation, event details, and other pages that a team already maintains in Notion.",
          "The main advantage is a single editing workflow. Your team changes the source page in Notion instead of copying every update into a second content system. Notion states that edits to a published page update its live Site automatically; after a meaningful change, reload the embedded page to confirm the result and its spacing.",
          "An iframe is not the same as importing Notion blocks into your website. The content remains inside the embedded document, so your host website has less control over individual blocks. Search engines may also treat iframe content separately from the surrounding page. If the text must rank as part of the host page, publish an HTML summary or native version alongside the embed.",
        ],
        note: "Use an embed when Notion should remain the source of truth. Use native website content when search visibility, block-level design control, or deep application integration matters more.",
      },
      {
        heading: "Choose between Notion’s native embed and EmbedMyNotion",
        paragraphs: [
          "Notion now provides a native “Embed this page” option for published Notion Sites. From a published page, you can copy Notion’s code and paste it into a website code block. That is the shortest route when you only need a basic embed and Notion’s default presentation is acceptable.",
          "EmbedMyNotion is useful when the frame needs to feel more integrated with your website. Its editor adds light, dark, and system themes; font choices; cover, page-header, and top-bar controls; full or custom dimensions; border and radius settings; custom CSS; and an instant preview before you publish.",
          "The choice does not need to be ideological. Start with the native option for a simple public document. Use EmbedMyNotion when visual consistency, reusable iframe code, dashboard organization, or an access screen is part of the requirement.",
        ],
        bullets: [
          "Use Notion’s native code for the fastest basic setup.",
          "Use EmbedMyNotion when you need theme, typography, frame, or layout controls.",
          "Use native CMS content instead of either iframe when host-page SEO is the priority.",
        ],
      },
      {
        heading: "Prepare the Notion page before publishing",
        paragraphs: [
          "Treat publication as a privacy review, not only a technical switch. Remove internal notes, unresolved comments, hidden instructions, and links that visitors should not follow. Check database views and every important subpage because publishing a Notion Site can also expose subpages unless their permissions are restricted.",
          "Notion also warns that public page metadata can include contributor names, profile photos, and email addresses. Review who has contributed and what information appears before publishing. If the content is confidential, do not publish the source page merely to make an iframe work.",
          "Then edit the top of the page for an external reader. Use a specific title, a short introduction, and a useful first section. Oversized cover images and empty space push the answer below the fold, while unexplained databases or internal acronyms make the page difficult to use outside your workspace.",
        ],
        bullets: [
          "Remove private notes, internal comments, and temporary sections.",
          "Check linked pages, database rows, files, and published subpages.",
          "Confirm the title and first paragraph explain the page to a new visitor.",
          "Open the public page while signed out of Notion before creating the embed.",
        ],
      },
      {
        heading: "Step 1: publish the Notion page and copy the correct URL",
        paragraphs: [
          "Open the page in Notion, select Share, open the Publish tab, and publish the page. Copy the public URL from the published view. A valid source normally uses your notion.site domain or a public notion.so URL. Do not paste the private workspace URL from the editor address bar unless it resolves for signed-out visitors.",
          "Verify the link in a private or incognito window. You should see the page without joining the workspace or signing in. If the private window shows an access request, login screen, or “page not found” message, the iframe will fail for ordinary visitors too.",
          "Enterprise workspace owners can disable public pages and Notion Sites. If the Publish option is unavailable, ask the workspace administrator to review the security setting rather than trying to work around it.",
        ],
        image: {
          src: "/blog/publish-notion-page-steps.png",
          alt: "Three annotated Notion screenshots showing Share, Publish, View site, and Embed this page controls",
          width: 2043,
          height: 770,
          caption: "Open Share, publish the page, then view the public site or use Notion’s native embed option.",
          steps: [
            {
              label: "Step 1",
              title: "Open the Share menu",
              description: "Open the Notion page you want to embed and select Share in the top-right corner.",
              src: "/blog/notion-publish-step-1-share.png",
              alt: "Annotated Notion page with an orange arrow pointing to the Share button",
              width: 689,
              height: 682,
            },
            {
              label: "Step 2",
              title: "Publish the page",
              description: "Choose the Publish tab, review the public preview, and select the blue Publish button.",
              src: "/blog/notion-publish-step-2-publish.png",
              alt: "Annotated Notion publishing window with an orange arrow pointing to the Publish button",
              width: 619,
              height: 682,
            },
            {
              label: "Step 3",
              title: "Open or embed the public page",
              description: "Select View site to check the public page, or choose Embed this page for Notion’s native code.",
              src: "/blog/notion-publish-step-3-view-site.png",
              alt: "Annotated published Notion menu pointing to View site and Embed this page",
              width: 668,
              height: 682,
            },
          ],
        },
        sources: [
          { label: "Notion: Publish a website with Notion Sites", href: "https://www.notion.com/help/public-pages-and-web-publishing" },
          { label: "Notion: Sharing and permissions", href: "https://www.notion.com/help/sharing-and-permissions" },
        ],
      },
      {
        heading: "Step 2: create the embed in EmbedMyNotion",
        paragraphs: [
          "Sign in to EmbedMyNotion, open Embeds, and create a new embed. Paste the public Notion URL into the Notion page field and give the embed a clear dashboard name, such as “Customer handbook” or “Q4 public roadmap.” The dashboard name is for your own organization; it does not need to match the Notion page title.",
          "The editor loads a preview beside the settings. If the preview is blank, go back to the public-link test before changing visual options. Styling cannot repair a source page that is private, unpublished, or copied from the wrong Notion location.",
          "For an existing embed, the source page is intentionally fixed. Create a new embed when you want to point at a different Notion page, which prevents an accidental URL replacement from silently changing content on a live website.",
        ],
      },
      {
        heading: "Step 3: set responsive width, height, and frame",
        paragraphs: [
          "Start with full width. It makes the iframe fill its website container while max-width prevents it from overflowing. The surrounding website should still place the embed inside a sensible content region; full width inside a 900-pixel article column is different from full width across an entire monitor.",
          "For height, choose between viewport height and a custom pixel value. Full height works well for documentation or a standalone resource because the embed fills the visitor’s screen. A custom height is better when the embed sits between other sections, but it creates an inner scrollbar when the Notion page is longer than the frame.",
          "Use borders and corner radius to match nearby cards rather than to decorate the iframe in isolation. A one-pixel neutral border and the same radius used elsewhere on the website are usually enough. Test the border against both the host background and the selected embed theme.",
        ],
        bullets: [
          "Prefer full width for responsive layouts.",
          "Use full height for document-like experiences and custom height for embedded sections.",
          "Keep custom widths between the editor’s supported limits and below the mobile viewport.",
          "Use a visible title on the iframe so screen-reader users know what it contains.",
        ],
      },
      {
        heading: "Step 4: match the theme and page chrome to your website",
        paragraphs: [
          "Choose a light, dark, or system theme based on the surrounding page. System mode is useful when your website also follows the visitor’s preference. A forced dark embed inside a white article can look disconnected, while a light embed inside a dark application can create distracting glare.",
          "Next, choose a font and decide how much Notion interface to retain. The cover image helps editorial pages feel expressive, while a compact knowledge-base embed often reads better without a large cover. The page header preserves Notion’s title area; the optional top bar gives visitors more document context. Change one control at a time and review the first screen after every change.",
          "Custom CSS should be a final adjustment, not the starting point. First solve width, theme, page chrome, and spacing with the built-in controls. Then use small, scoped rules for details that genuinely need refinement. Avoid hiding essential controls or reducing contrast just to make the frame look minimal.",
        ],
        note: "A good embed should feel native to the host website without making the Notion content harder to recognize, read, or navigate.",
      },
      {
        heading: "Step 5: understand password and email access correctly",
        paragraphs: [
          "EmbedMyNotion can place a password screen or Google email allowlist in front of the public embed route. Passwords must meet the editor’s length requirements, and an email-protected embed needs at least one allowed address. After saving, test the public embed in a private browser window so an existing session does not hide the access screen.",
          "These controls protect entry through the EmbedMyNotion URL; they do not make the original published Notion URL private. Anyone who already has the source link may still be able to open it. Do not use a published Notion page for secrets, regulated data, private client material, or anything that requires source-level authorization.",
          "For genuinely private content, keep the Notion page unpublished and use a system designed to fetch content through authenticated APIs with permission checks. An iframe gate is a useful sharing layer, not a substitute for the source platform’s access policy.",
        ],
      },
      {
        heading: "Step 6: copy the iframe into your website",
        paragraphs: [
          "Save the embed, copy the generated iframe, and paste it into a component that accepts custom HTML. The generated code includes the embed URL, accessible title, selected width and height, border settings, corner radius, maximum width, and lazy loading. Keep the complete code unless the host platform requires a specific field to be separated.",
          "In WordPress, use a Custom HTML block rather than a Paragraph block. In Webflow, add an Embed element. In Wix or Squarespace, use the platform’s HTML or code block. In Ghost, use an HTML card. In Shopify, place the iframe in a Custom Liquid section or a theme block that permits HTML. On a custom React or Next.js site, render the iframe as JSX and convert the inline style string into a style object if necessary.",
          "Some site builders sanitize iframes or limit them to paid plans. If the code disappears after saving, check the platform’s embed policy and editor permissions. Do not repeatedly paste the code into a rich-text field that strips HTML.",
        ],
        code: `<iframe
  src="https://your-domain.com/embed/your-embed-id"
  title="Public product handbook"
  width="100%"
  height="700"
  style="width:100%;height:700px;border:0;border-radius:8px;max-width:100%"
  loading="lazy"
></iframe>`,
      },
      {
        heading: "Test mobile behavior and fix common problems",
        paragraphs: [
          "Test the live host page, not only the editor preview. Use at least one wide desktop width, a tablet width, and a narrow mobile width. Check that the iframe stays inside its container, the page can scroll naturally, databases remain usable, and links open as expected. Also test keyboard focus and verify that the iframe title describes the content.",
          "A blank or access-denied frame almost always points to the source URL or publication settings. Horizontal overflow usually comes from a fixed host container, a wide database, or custom CSS. A double scrollbar means both the host page and a short iframe are scrolling; increase the custom height or use full height. A page that looks wrong only in dark mode usually has mismatched theme settings or custom colors with insufficient contrast.",
          "If the embed works in preview but not after publishing, inspect the host platform. Content Security Policy, iframe allowlists, HTML sanitization, cookie restrictions, and cached page versions can all affect the live result. Confirm that the iframe URL itself opens, then isolate the host-page restriction.",
        ],
        bullets: [
          "Blank frame: verify the public Notion URL while signed out.",
          "Clipped content: increase height or switch to full height.",
          "Horizontal scrolling: use full width and inspect wide databases or code blocks.",
          "Code removed: use a real HTML/embed block and review platform restrictions.",
          "Old content: reload the source page, embed route, and host-page cache.",
        ],
      },
      {
        heading: "Know when an embed is the wrong choice",
        paragraphs: [
          "An embed is strongest when the Notion page changes frequently and the Notion team should own updates. It is weaker when the host page needs the content for organic search, when every block must match a custom design system, or when visitors need deep integration with application state and analytics.",
          "For SEO-critical tutorials, product pages, and landing pages, write the main answer as native HTML and use the Notion embed as an optional live resource. For a public handbook, roadmap, changelog, or event guide, the reduced maintenance can outweigh the iframe tradeoffs. Choose based on the job of the page, not simply because an iframe is available.",
        ],
      },
      {
        heading: "Final launch checklist",
        paragraphs: [
          "Before announcing the page, complete one short review from the visitor’s point of view. A reliable embed is public only where intended, readable on every screen, and easy to maintain after the first launch.",
        ],
        bullets: [
          "The Notion source opens in a private window and contains no sensitive information.",
          "The embed title, theme, width, height, border, and radius match the host page.",
          "Password or email access was tested without an existing login session.",
          "Desktop, tablet, mobile, keyboard navigation, links, and inner scrolling were checked.",
          "The live host page was tested after publication and cache refresh.",
          "A native HTML summary exists when the content is important for search discovery.",
        ],
      },
    ],
  },
  {
    slug: "layout-settings-for-clean-notion-embeds",
    title: "Layout settings for a cleaner Notion embed",
    excerpt: "Learn how width, spacing, borders, and corner radius work together to create a responsive Notion embed that feels native to your website.",
    category: "Design",
    publishedAt: "November 1, 2026",
    publishedAtIso: "2026-11-01",
    updatedAtIso: "2026-11-01",
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
    title: "Notion page publishing checklist",
    excerpt: "Use this practical checklist to review public access, page content, responsive behavior, links, and the live host page before publishing a Notion embed.",
    category: "Workflow",
    publishedAt: "November 1, 2026",
    publishedAtIso: "2026-11-01",
    updatedAtIso: "2026-11-01",
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
    excerpt: "Compare Notion embeds with native CMS content using a clear framework for update workflows, search needs, design control, and long-term maintenance.",
    category: "Strategy",
    publishedAt: "November 1, 2026",
    publishedAtIso: "2026-11-01",
    updatedAtIso: "2026-11-01",
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
