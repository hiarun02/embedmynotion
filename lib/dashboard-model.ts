export type Embed = {
  id: string;
  title: string;
  notionUrl: string;
  theme: "light" | "dark" | "system";
  height: number;
  fullWidth: boolean;
  width: number;
  fullHeight: boolean;
  border: boolean;
  borderWidth: number;
  borderColor: string;
  radius: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
export type Workspace = {
  embeds: Embed[];
  plan: "Free" | "Pro";
  name: string;
  email: string;
  avatarUrl: string | null;
  authProvider: string | null;
};

export type AuthenticatedProfile = Pick<
  Workspace,
  "name" | "email" | "avatarUrl" | "authProvider"
>;

type DatabaseEmbed = {
  id: string;
  title: string;
  notionUrl: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
  height: number;
  fullWidth: boolean;
  width: number;
  fullHeight: boolean;
  border: boolean;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export function serializeEmbed(embed: DatabaseEmbed): Embed {
  return {
    id: embed.id,
    title: embed.title,
    notionUrl: embed.notionUrl,
    theme: embed.theme.toLowerCase() as Embed["theme"],
    height: embed.height,
    fullWidth: embed.fullWidth,
    width: embed.width,
    fullHeight: embed.fullHeight,
    border: embed.border,
    borderWidth: embed.borderWidth,
    borderColor: embed.borderColor,
    radius: embed.borderRadius,
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
}

export function validNotionUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      /(^|\.)notion\.(so|site)$/.test(url.hostname) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
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
