import { Code2, FileStack, Palette } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionIntro } from "./SectionIntro";

const problems = [
  { icon: Code2, title: "No more iframe headaches", text: "Generate clean embed code without manually writing or debugging HTML." },
  { icon: Palette, title: "Make it feel like your website", text: "Adjust supported appearance and layout settings in a few clicks." },
  { icon: FileStack, title: "One place for your content", text: "Keep editing in Notion instead of maintaining duplicate content." },
];

export function ProblemSection() {
  return (
    <section className="problem-section section" aria-labelledby="problem-title">
      <div className="site-container">
        <div className="section-heading-row">
          <SectionIntro eyebrow="THE SIMPLE WAY" title="Embedding Notion shouldn't be complicated." body="You already have your content in Notion. Getting it onto your website should be just as simple." />
          <span className="tiny-note">Built for people who would rather publish than troubleshoot.</span>
        </div>
        <div className="problem-grid">
          {problems.map(({ icon: Icon, title, text }, index) => (
            <Card key={title} className="problem-card">
              <CardHeader><span className="number">0{index + 1}</span><span className="feature-icon"><Icon /></span></CardHeader>
              <CardContent><h3>{title}</h3><p>{text}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
