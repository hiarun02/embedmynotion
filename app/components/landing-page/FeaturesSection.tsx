import { Blocks, Eye, Gauge, LayoutDashboard, Link2, Palette } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionIntro } from "./SectionIntro";

const features = [
  { icon: Link2, title: "One-click embeds", text: "Generate a ready-to-use snippet from a public Notion URL.", className: "feature-large", art: "link" },
  { icon: Eye, title: "Live preview", text: "See every supported change before you publish.", className: "", art: "preview" },
  { icon: Palette, title: "Custom appearance", text: "Tune theme, width, spacing, border, and corner radius.", className: "", art: "swatches" },
  { icon: Gauge, title: "Responsive by design", text: "Create embeds that feel at home across screen sizes.", className: "feature-wide", art: "devices" },
  { icon: LayoutDashboard, title: "Embed dashboard", text: "Keep saved embeds organized in one clear workspace.", className: "", art: "dashboard" },
  { icon: Blocks, title: "Easy integration", text: "Copy code into compatible site builders or custom websites.", className: "", art: "code" },
];

export function FeaturesSection() {
  return (
    <section className="features-section section" id="features">
      <div className="site-container">
        <SectionIntro eyebrow="EVERYTHING IN PLACE" title="Everything you need. Nothing you don't." body="A focused toolkit for taking a page from Notion to your website—with less friction in between." />
        <div className="features-grid">
          {features.map(({ icon: Icon, title, text, className, art }, index) => (
            <Card key={title} className={`feature-card ${className}`}>
              <CardHeader><span className="feature-icon"><Icon /></span><span className="feature-index">{String(index + 1).padStart(2, "0")}</span></CardHeader>
              <div className={`feature-art art-${art}`} aria-hidden="true"><span /><span /><span /></div>
              <CardContent><h3>{title}</h3><p>{text}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
