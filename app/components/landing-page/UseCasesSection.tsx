import { ArrowRight, BookOpen, BriefcaseBusiness, Globe2, ListChecks } from "lucide-react";
import { SectionIntro } from "./SectionIntro";

const useCases = [
  { icon: BookOpen, title: "Documentation", text: "Publish product guides and help pages." },
  { icon: BriefcaseBusiness, title: "Portfolios", text: "Showcase projects and personal work." },
  { icon: ListChecks, title: "Resources", text: "Share guides, templates, and learning materials." },
  { icon: Globe2, title: "Business pages", text: "Embed FAQs, policies, and public information." },
];

export function UseCasesSection() {
  return (
    <section className="usecases-section section">
      <div className="site-container usecase-layout">
        <SectionIntro eyebrow="USE CASES" title="Built for the way you use Notion." body="Bring the content you already maintain into the places your audience visits." />
        <div className="usecase-list">
          {useCases.map(({ icon: Icon, title, text }, index) => (
            <div className="usecase-row" key={title}>
              <span className="usecase-number">0{index + 1}</span><Icon />
              <div><h3>{title}</h3><p>{text}</p></div><ArrowRight />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
