import type { EmbedBackgroundStyle } from "@/lib/embed-background";

export type Embed = {
  id: string;
  title: string;
  notionUrl: string;
  theme: "light" | "dark" | "system";
  font: "default" | "sans" | "serif" | "mono";
  customCssEnabled: boolean;
  customCss: string;
  showTopBar: boolean;
  showCoverImage: boolean;
  showPageHeader: boolean;
  passwordProtected: boolean;
  emailAccess: boolean;
  allowedEmails: string[];
  hideWatermark: boolean;
  height: number;
  fullWidth: boolean;
  width: number;
  fullHeight: boolean;
  border: boolean;
  borderWidth: number;
  borderColor: string;
  radius: number;
  backgroundStyle: EmbedBackgroundStyle;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
export type Workspace = {
  embeds: Embed[];
  plan: "Free" | "Pro";
  demoPlanEnabled: boolean;
  name: string;
  email: string;
  avatarUrl: string | null;
  authProvider: string | null;
};

export type AuthenticatedProfile = Pick<
  Workspace,
  "name" | "email" | "avatarUrl" | "authProvider"
>;

export function applyEmbedEntitlements(embed: Embed, hasProAccess: boolean) {
  if (hasProAccess) return { ...embed, hideWatermark: true };

  return {
    ...embed,
    font: "default" as const,
    customCssEnabled: false,
    customCss: "",
    showTopBar: false,
    showCoverImage: true,
    showPageHeader: true,
    passwordProtected: false,
    emailAccess: false,
    allowedEmails: [],
    hideWatermark: false,
  };
}

type DatabaseEmbed = {
  id: string;
  title: string;
  notionUrl: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
  font: "DEFAULT" | "SANS" | "SERIF" | "MONO";
  customCssEnabled: boolean;
  customCss: string | null;
  showTopBar: boolean;
  showCoverImage: boolean;
  showPageHeader: boolean;
  passwordHash: string | null;
  emailAccess: boolean;
  allowedEmails: string[];
  hideWatermark: boolean;
  height: number;
  fullWidth: boolean;
  width: number;
  fullHeight: boolean;
  border: boolean;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  backgroundStyle: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export function serializeEmbed(
  embed: DatabaseEmbed,
  options: { hasProAccess?: boolean } = {},
): Embed {
  const serialized: Embed = {
    id: embed.id,
    title: embed.title,
    notionUrl: embed.notionUrl,
    theme: embed.theme.toLowerCase() as Embed["theme"],
    font: embed.font.toLowerCase() as Embed["font"],
    customCssEnabled: embed.customCssEnabled,
    customCss: embed.customCss ?? "",
    showTopBar: embed.showTopBar,
    showCoverImage: embed.showCoverImage,
    showPageHeader: embed.showPageHeader,
    passwordProtected: Boolean(embed.passwordHash),
    emailAccess: embed.emailAccess,
    allowedEmails: embed.allowedEmails,
    hideWatermark:
      options.hasProAccess === undefined
        ? embed.hideWatermark
        : options.hasProAccess,
    height: embed.height,
    fullWidth: embed.fullWidth,
    width: embed.width,
    fullHeight: embed.fullHeight,
    border: embed.border,
    borderWidth: embed.borderWidth,
    borderColor: embed.borderColor,
    radius: embed.borderRadius,
    backgroundStyle: embed.backgroundStyle as EmbedBackgroundStyle,
    active: embed.isActive,
    createdAt:
      embed.createdAt instanceof Date
        ? embed.createdAt.toISOString()
        : embed.createdAt,
    updatedAt:
      embed.updatedAt instanceof Date
        ? embed.updatedAt.toISOString()
        : embed.updatedAt,
  };

  return options.hasProAccess === undefined
    ? serialized
    : applyEmbedEntitlements(serialized, options.hasProAccess);
}

export function validNotionUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      /(^|\.)notion\.(so|site|com)$/.test(url.hostname) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}

export function notionPageId(value: string) {
  if (!validNotionUrl(value)) return null;

  const url = new URL(value);
  const finalPathSegment = url.pathname.split("/").filter(Boolean).at(-1);
  const compactSegment = finalPathSegment?.replaceAll("-", "") ?? "";
  const pathMatch = compactSegment.match(/([0-9a-f]{32})$/i);

  if (pathMatch) return pathMatch[1].toLowerCase();

  const queryId = url.searchParams.get("p")?.replaceAll("-", "");
  return queryId && /^[0-9a-f]{32}$/i.test(queryId)
    ? queryId.toLowerCase()
    : null;
}

export function formatEmbedUpdatedAt(value: string) {
  const updatedAt = value ? new Date(value) : null;

  if (!updatedAt || Number.isNaN(updatedAt.getTime())) {
    return "Unsaved preview";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(updatedAt);
}

export function embedCode(embed: Embed, origin: string) {
  const title = embed.title.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
  const width = embed.fullWidth ? "100%" : String(embed.width);
  const height = embed.fullHeight ? "100%" : String(embed.height);
  const frameStyle = [
    `width:${embed.fullWidth ? "100%" : `${embed.width}px`}`,
    `height:${embed.fullHeight ? "100vh" : `${embed.height}px`}`,
    `border:${embed.border ? `${embed.borderWidth}px solid ${embed.borderColor}` : "0"}`,
    `border-radius:${embed.radius}px`,
    "max-width:100%",
  ].join(";");

  return `<iframe src="${origin}/embed/${encodeURIComponent(embed.id)}" title="${title}" width="${width}" height="${height}" style="${frameStyle}" loading="lazy"></iframe>`;
}
