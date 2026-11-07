import type { ReactNode } from "react";

export const LEGAL_LAST_UPDATED = "November 5, 2026";

export function LegalPage({
  label,
  title,
  introduction,
  children,
}: {
  label: string;
  title: string;
  introduction: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <header className="legal-hero site-frame">
        <span className="legal-label">{label}</span>
        <h1>{title}</h1>
        <p>{introduction}</p>
        <small>Last updated: {LEGAL_LAST_UPDATED}</small>
      </header>
      <article className="legal-content site-frame">{children}</article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
