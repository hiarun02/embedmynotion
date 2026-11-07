import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionIntro } from "./SectionIntro";

const faqs = [
  [
    "What can I do with EmbedMyNotion?",
    "Turn a published Notion page into a responsive embed you can style, preview, manage, and place on another website.",
  ],
  [
    "How do I create an embed?",
    "Paste the public Notion page URL, choose how the embed should look and behave, save it, then copy the generated iframe code into your website.",
  ],
  [
    "Do I need to write any code?",
    "No development work is required. You only need a website or site builder that accepts iframe embed code. We also generate a WordPress-friendly shortcode for sites that support it.",
  ],
  [
    "Will edits from Notion appear in the embed?",
    "The embed loads the current published version of your Notion page whenever it reloads. Notion, your browser, or your host website may briefly cache an older version after a change.",
  ],
  [
    "Can the original Notion page remain private?",
    "The source page must be published to the web so EmbedMyNotion can read it. On Pro, you can still place a password screen or approved-email gate in front of the resulting embed for visitors.",
  ],
  [
    "How much can I change the design?",
    "You can control the theme, dimensions, border, and corner radius. Pro adds fonts, custom CSS, and controls for the Notion top bar, cover image, and page header.",
  ],
  [
    "Which Notion content is supported?",
    "Standard page content is rendered along with supported databases, code blocks, and equations. Some Notion-only interactions or newly released block types may look or behave differently outside Notion.",
  ],
  [
    "Can I use it with WordPress or a no-code builder?",
    "Yes, when the platform allows iframes or custom embed blocks. You can copy the regular embed snippet or the generated WordPress shortcode; the exact placement depends on your host platform.",
  ],
  [
    "How many Notion pages can I embed?",
    "The Free plan supports one saved embed. Pro supports up to 25 embeds in the same dashboard.",
  ],
  [
    "What is included with the Free plan?",
    "Free includes one branded embed, basic customization, and light, dark, or system theme options. It does not expire after a trial period.",
  ],
  [
    "What does Pro add?",
    "Pro increases the limit to 25 watermark-free embeds and unlocks additional appearance, layout, password, and approved-email access controls. Payment processing is not connected in the current demo.",
  ],
  [
    "Can I temporarily take an embed offline?",
    "Yes. Turn off the Active embed setting and its public URL will become unavailable until you switch it back on.",
  ],
  [
    "Will my embed work on phones and tablets?",
    "EmbedMyNotion generates responsive layouts, but the final result also depends on the width of the host page and the Notion content inside the frame.",
  ],
  [
    "Can I remove the EmbedMyNotion watermark?",
    "Yes. The EmbedMyNotion watermark is removed automatically from editor previews and published embeds while the owner has an active Pro plan.",
  ],
];

export function FaqSection() {
  return (
    <section className="faq-section section" id="faq">
      <div className="site-frame section-frame faq-layout">
        <SectionIntro
          eyebrow="FAQ"
          title="Questions, answered plainly"
          body="Everything you need to know before turning a Notion page into a website embed."
        />
        <Accordion defaultValue={["item-0"]} className="faq-list">
          {faqs.map(([question, answer], index) => (
            <AccordionItem value={`item-${index}`} key={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>
                <p>{answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
