import { absoluteUrl, siteConfig } from "@/lib/site-config";

export function GET() {
  const blogLinks = [
    ["How to embed a Notion page", "/blog/how-to-embed-a-notion-page"],
    ["Notion embed layout settings", "/blog/layout-settings-for-clean-notion-embeds"],
    ["Notion publishing checklist", "/blog/notion-page-publishing-checklist"],
    ["When to embed Notion content", "/blog/notion-embed-or-duplicate-cms"],
  ]
    .map(([label, path]) => `- [${label}](${absoluteUrl(path)})`)
    .join("\n");

  const content = `# ${siteConfig.name}
> ${siteConfig.description}

## Main pages
- [Homepage](${absoluteUrl("/")}): Product overview, features, workflow, and answers about embedding Notion pages.
- [Guides](${absoluteUrl("/blog")}): Practical articles about responsive Notion embeds and publishing workflows.

## Guides
${blogLinks}

## Key facts
- EmbedMyNotion turns public Notion pages into responsive iframe embeds for websites.
- Embeds support light and dark themes, layout controls, custom dimensions, borders, and corner radii.
- Pro controls include password protection and Google-account email allowlists.
- EmbedMyNotion is an independent product and is not affiliated with Notion.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
