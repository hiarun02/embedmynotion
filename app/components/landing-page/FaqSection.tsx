import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionIntro } from "./SectionIntro";

const faqs = [
  ["What is embedmynotion?", "embedmynotion is a tool for turning public Notion pages into customizable website embeds."],
  ["How does it work?", "Paste a public Notion URL, choose the supported appearance settings, preview the result, and copy the generated embed code."],
  ["Do I need to know how to code?", "No. You only need to paste a small generated snippet into a website or builder that accepts embeds."],
  ["Will my Notion page update automatically?", "Embed behavior depends on the published integration. We do not promise instant synchronization until that capability is verified."],
  ["Can I customize my embeds?", "You can adjust supported settings such as theme, width, padding, borders, and corner radius."],
  ["Can I embed private Notion pages?", "Not currently. The page must be publicly accessible; private-page support is not promised."],
  ["Does embedmynotion work on mobile?", "The generated layout is designed to respond to different screen sizes, subject to the content and host website."],
  ["Is embedmynotion free?", "A free plan is planned for essential embed generation. Final limits and paid pricing are still being determined."],
];

export function FaqSection() {
  return (
    <section className="faq-section section" id="faq">
      <div className="site-frame section-frame faq-layout">
        <SectionIntro eyebrow="FAQ" title="Frequently asked questions" body="Straight answers about what embedmynotion does—and what it doesn't promise yet." />
        <Accordion defaultValue={["item-0"]} className="faq-list">
          {faqs.map(([question, answer], index) => (
            <AccordionItem value={`item-${index}`} key={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent><p>{answer}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
