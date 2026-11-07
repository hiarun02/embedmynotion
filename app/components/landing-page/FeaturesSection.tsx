import {
  Code2,
  Eye,
  KeyRound,
  LayoutDashboard,
  Paintbrush,
  RefreshCw,
} from "lucide-react";

import { SectionIntro } from "./SectionIntro";

const features = [
  {
    icon: Code2,
    title: "Paste once. Publish anywhere.",
    text: "Start with one public Notion URL, then copy a public embed link, iframe snippet, or WordPress shortcode.",
  },
  {
    icon: RefreshCw,
    title: "Keep Notion as your source.",
    text: "Update the original page instead of maintaining a second copy. Visitors load its current published content.",
  },
  {
    icon: Paintbrush,
    title: "Make it feel like your website.",
    text: "Control theme, dimensions, borders, radius, page elements, backgrounds, fonts, and advanced custom CSS.",
  },
  {
    icon: Eye,
    title: "Preview before visitors see it.",
    text: "Review supported appearance and layout changes in the editor before you save and share the embed.",
  },
  {
    icon: KeyRound,
    title: "Protect content when needed.",
    text: "Put a password or approved Google-email sign-in in front of pages that should not be completely public.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage everything in one place.",
    text: "See page names and icons, update saved settings, take embeds offline, and manage branding from one dashboard.",
  },
];

export function FeaturesSection() {
  return (
    <section className="features-section section" id="features">
      <div className="site-frame section-frame">
        <SectionIntro
          eyebrow="EVERYTHING IN PLACE"
          title="The friction between Notion and your website, removed."
          body="No duplicate content, fragile iframe fixes, or scattered controls—just the six things that matter when you publish."
        />
        <div className="features-connected-grid">
          {features.map(({ icon: Icon, title, text }, index) => (
            <article className="features-connected-card" key={title}>
              <div className="features-connected-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i><Icon /></i>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
