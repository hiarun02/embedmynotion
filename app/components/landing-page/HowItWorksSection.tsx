import { SectionIntro } from "./SectionIntro";

const steps = [
  ["Paste your link", "Copy a public Notion page URL and paste it into embedmynotion."],
  ["Make it yours", "Customize the embed and preview the result as you work."],
  ["Add it to your site", "Copy the embed code and place it on a compatible website."],
];

export function HowItWorksSection() {
  return (
    <section className="how-section section" id="how-it-works">
      <div className="site-frame section-frame">
        <SectionIntro eyebrow="HOW IT WORKS" title="Three steps. That's it." body="From public page to polished embed in a few focused moments." />
        <div className="steps-grid">
          {steps.map(([title, text], index) => (
            <div className="step" key={title}>
              <div className="step-top"><span>0{index + 1}</span>{index < 2 && <i />}</div>
              <h3>{title}</h3><p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
