import { validNotionUrl, type Embed } from "@/lib/dashboard-model";

export type EmbedInput = Pick<
  Embed,
  | "title"
  | "notionUrl"
  | "theme"
  | "font"
  | "customCssEnabled"
  | "customCss"
  | "showTopBar"
  | "showCoverImage"
  | "showPageHeader"
  | "passwordProtected"
  | "emailAccess"
  | "allowedEmails"
  | "height"
  | "fullWidth"
  | "width"
  | "fullHeight"
  | "border"
  | "borderWidth"
  | "borderColor"
  | "radius"
  | "active"
> & { password: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEmbedInput(value: unknown): EmbedInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const notionUrl =
    typeof input.notionUrl === "string" ? input.notionUrl.trim() : "";
  const customCss =
    typeof input.customCss === "string" ? input.customCss.trim() : "";
  const password =
    typeof input.password === "string" ? input.password : "";
  const allowedEmails = Array.isArray(input.allowedEmails)
    ? [...new Set(input.allowedEmails
      .filter((email): email is string => typeof email === "string")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean))]
    : [];

  if (
    title.length < 1 ||
    title.length > 100 ||
    !validNotionUrl(notionUrl) ||
    (input.theme !== "light" &&
      input.theme !== "dark" &&
      input.theme !== "system") ||
    (input.font !== "default" &&
      input.font !== "sans" &&
      input.font !== "serif" &&
      input.font !== "mono") ||
    typeof input.customCssEnabled !== "boolean" ||
    customCss.length > 4000 ||
    /<\/style/i.test(customCss) ||
    typeof input.showTopBar !== "boolean" ||
    typeof input.showCoverImage !== "boolean" ||
    typeof input.showPageHeader !== "boolean" ||
    typeof input.passwordProtected !== "boolean" ||
    password.length > 72 ||
    (password.length > 0 && password.length < 8) ||
    typeof input.emailAccess !== "boolean" ||
    allowedEmails.length > 50 ||
    allowedEmails.some((email) => !emailPattern.test(email)) ||
    (input.emailAccess === true && allowedEmails.length === 0) ||
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
    font: input.font,
    customCssEnabled: input.customCssEnabled,
    customCss,
    showTopBar: input.showTopBar,
    showCoverImage: input.showCoverImage,
    showPageHeader: input.showPageHeader,
    passwordProtected: input.passwordProtected,
    password,
    emailAccess: input.emailAccess,
    allowedEmails,
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

export function databaseFont(font: EmbedInput["font"]) {
  if (font === "sans") return "SANS" as const;
  if (font === "serif") return "SERIF" as const;
  if (font === "mono") return "MONO" as const;
  return "DEFAULT" as const;
}

export function usesPremiumFeatures(input: EmbedInput) {
  return (
    input.font !== "default" ||
    input.customCssEnabled ||
    input.showTopBar ||
    !input.showCoverImage ||
    !input.showPageHeader ||
    input.passwordProtected ||
    input.emailAccess
  );
}

export function databaseTheme(theme: EmbedInput["theme"]) {
  if (theme === "dark") return "DARK" as const;
  if (theme === "system") return "SYSTEM" as const;
  return "LIGHT" as const;
}
