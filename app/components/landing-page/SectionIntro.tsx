type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  body?: string;
};

export function SectionIntro({ eyebrow, title, body }: SectionIntroProps) {
  return (
    <div className="section-intro">
      {eyebrow && <span className="section-kicker">{eyebrow}</span>}
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}
