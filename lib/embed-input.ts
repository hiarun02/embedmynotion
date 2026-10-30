import { validNotionUrl, type Embed } from "@/lib/dashboard-model";

export type EmbedInput = Pick<
  Embed,
  | "title"
  | "notionUrl"
  | "theme"
  | "height"
  | "fullWidth"
  | "width"
  | "fullHeight"
  | "border"
  | "borderWidth"
  | "borderColor"
  | "radius"
  | "active"
>;

export function parseEmbedInput(value: unknown): EmbedInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const notionUrl =
    typeof input.notionUrl === "string" ? input.notionUrl.trim() : "";

  if (
    title.length < 1 ||
    title.length > 100 ||
    !validNotionUrl(notionUrl) ||
    (input.theme !== "light" &&
      input.theme !== "dark" &&
      input.theme !== "system") ||
    !Number.isInteger(input.height) ||
    (input.height as number) < 200 ||
    (input.height as number) > 2000 ||
    !Number.isInteger(input.width) ||
    (input.width as number) < 320 ||
    (input.width as number) > 1920 ||
    !Number.isInteger(input.radius) ||
    (input.radius as number) < 0 ||
    (input.radius as number) > 64 ||
    !Number.isInteger(input.borderWidth) ||
    (input.borderWidth as number) < 1 ||
    (input.borderWidth as number) > 12 ||
    typeof input.borderColor !== "string" ||
    !/^#[0-9a-f]{6}$/i.test(input.borderColor) ||
    typeof input.fullWidth !== "boolean" ||
    typeof input.fullHeight !== "boolean" ||
    typeof input.border !== "boolean" ||
    typeof input.active !== "boolean"
  ) {
    return null;
  }

  return {
    title,
    notionUrl,
    theme: input.theme,
    height: input.height as number,
    fullWidth: input.fullWidth,
    width: input.width as number,
    fullHeight: input.fullHeight,
    border: input.border,
    borderWidth: input.borderWidth as number,
    borderColor: input.borderColor.toLowerCase(),
    radius: input.radius as number,
    active: input.active,
  };
}

export function databaseTheme(theme: EmbedInput["theme"]) {
  if (theme === "dark") return "DARK" as const;
  if (theme === "system") return "SYSTEM" as const;
  return "LIGHT" as const;
}
