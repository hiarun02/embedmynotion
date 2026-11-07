import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { SectionIntro } from "./SectionIntro";

const plans = [
  {
    name: "Free",
    description: "Everything you need to publish your first Notion embed.",
    price: "0",
    cadence: "forever",
    note: "No trial. No card required.",
    features: [
      "1 saved embed",
      "Basic appearance controls",
      "Light, dark, and system themes",
      "Responsive branded embed",
    ],
    action: "Start for free",
    featured: false,
  },
  {
    name: "Pro",
    description: "More embeds, deeper styling, and access controls for growing sites.",
    price: "7",
    cadence: "month",
    note: "$75.60 billed yearly — save 10%.",
    features: [
      "Up to 25 saved embeds",
      "Advanced appearance and layout controls",
      "Custom fonts and CSS",
      "Password and approved-email access",
      "Remove the EmbedMyNotion watermark",
    ],
    action: "Explore Pro",
    featured: true,
  },
] as const;

export function PricingSection() {
  return (
    <section className="subscription-section section" id="pricing">
      <div className="site-frame section-frame subscription-layout">
        <div className="subscription-copy">
          <SectionIntro
            eyebrow="SIMPLE PRICING"
            title="Start free. Upgrade when your embeds grow."
            body="Publish your first page without paying, then unlock more room and control when you need it."
          />
          <div className="subscription-promise">
            <Check aria-hidden="true" />
            <p>
              The Free plan never expires. Move to Pro only when one embed is no
              longer enough.
            </p>
          </div>
        </div>

        <div>
          <div className="subscription-cards">
            {plans.map((plan) => (
              <article
                className={`subscription-card${plan.featured ? " subscription-card-featured" : ""}`}
                key={plan.name}
              >
                <div className="subscription-card-header">
                  <span className="subscription-plan-name">{plan.name}</span>
                  {plan.featured && (
                    <span className="subscription-popular">
                      <Sparkles aria-hidden="true" /> Most popular
                    </span>
                  )}
                </div>
                <h3>{plan.description}</h3>
                <div
                  className="subscription-price"
                  aria-label={`$${plan.price} per ${plan.cadence}`}
                >
                  <span>$</span>
                  <strong>{plan.price}</strong>
                  <small>/ {plan.cadence}</small>
                </div>
                <p className="subscription-note">{plan.note}</p>
                <ul className="subscription-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={plan.featured ? "orange-button subscription-action" : "subscription-action subscription-action-secondary"}
                  href="/login"
                >
                  {plan.action} <ArrowRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          <p className="subscription-disclaimer">
            Payments are not connected in this demo. You can explore both plans
            after signing in.
          </p>
        </div>
      </div>
    </section>
  );
}
