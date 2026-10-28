export type Embed = {
  id: string;
  title: string;
  notionUrl: string;
  theme: "light" | "dark" | "system";
  height: number;
  fullWidth: boolean;
  border: boolean;
  radius: number;
  active: boolean;
  createdAt: string;
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
export const initialWorkspace: Workspace = {
  plan: "Free",
  name: "Alex Morgan",
  email: "alex@studio.design",
  avatarUrl: null,
  authProvider: null,
  embeds: [
    {
      id: "studio-handbook",
      title: "Studio handbook",
      notionUrl: "https://studio.notion.site/handbook",
      theme: "light",
      height: 700,
      fullWidth: true,
      border: false,
      radius: 8,
      active: true,
      createdAt: "2026-10-24T12:00:00Z",
    },
  ],
};
export const storageKey = "embedmynotion-demo-v1";
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
export function validWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== "object") return false;
  const v = value as Workspace;
  return (
    ["Free", "Pro"].includes(v.plan) &&
    typeof v.name === "string" &&
    typeof v.email === "string" &&
    (v.avatarUrl === undefined ||
      v.avatarUrl === null ||
      typeof v.avatarUrl === "string") &&
    (v.authProvider === undefined ||
      v.authProvider === null ||
      typeof v.authProvider === "string") &&
    Array.isArray(v.embeds) &&
    v.embeds.every(
      (e) =>
        e &&
        typeof e.id === "string" &&
        typeof e.title === "string" &&
        validNotionUrl(e.notionUrl) &&
        ["light", "dark", "system"].includes(e.theme) &&
        Number.isFinite(e.height) &&
        e.height >= 200 &&
        e.height <= 2000 &&
        Number.isFinite(e.radius) &&
        e.radius >= 0 &&
        e.radius <= 32 &&
        typeof e.active === "boolean" &&
        typeof e.fullWidth === "boolean" &&
        typeof e.border === "boolean" &&
        typeof e.createdAt === "string",
    )
  );
}
export function embedCode(embed: Embed, origin: string) {
  const title = embed.title.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
  return `<iframe src="${origin}/embed/${encodeURIComponent(embed.id)}" title="${title}" width="${embed.fullWidth ? "100%" : "640"}" height="${embed.height}" style="border:${embed.border ? "1px solid #e5e7eb" : "0"};border-radius:${embed.radius}px;max-width:100%" loading="lazy"></iframe>`;
}
