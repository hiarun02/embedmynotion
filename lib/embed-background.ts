export const embedBackgroundStyles = [
  { id: "none", label: "None", value: "transparent" },
  { id: "aqua", label: "Aqua", value: "#74d4dd" },
  { id: "sunset", label: "Sunset", value: "#f6bd60" },
  { id: "coral", label: "Coral", value: "#eb6f62" },
  { id: "forest", label: "Forest", value: "#52796f" },
  { id: "midnight", label: "Midnight", value: "#243b67" },
  {
    id: "lavender",
    label: "Lavender",
    value: "linear-gradient(135deg, #cdb4db 0%, #a2d2ff 100%)",
  },
  {
    id: "blush",
    label: "Blush",
    value: "linear-gradient(135deg, #ffd6e0 0%, #fff1c1 100%)",
  },
  {
    id: "aurora",
    label: "Aurora",
    value: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  },
  {
    id: "prism",
    label: "Prism",
    value: "linear-gradient(135deg, #f6d365 0%, #fda085 48%, #a18cd1 100%)",
  },
  {
    id: "berry",
    label: "Berry",
    value: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  },
  {
    id: "ocean",
    label: "Ocean",
    value: "linear-gradient(135deg, #0f2027 0%, #2c5364 55%, #5bc0be 100%)",
  },
] as const;

export type EmbedBackgroundStyle = (typeof embedBackgroundStyles)[number]["id"];

const backgroundStyleIds = new Set<string>(
  embedBackgroundStyles.map((style) => style.id),
);

export function isEmbedBackgroundStyle(
  value: unknown,
): value is EmbedBackgroundStyle {
  return typeof value === "string" && backgroundStyleIds.has(value);
}

export function embedBackgroundValue(style: EmbedBackgroundStyle) {
  return (
    embedBackgroundStyles.find((candidate) => candidate.id === style)?.value ??
    "transparent"
  );
}
