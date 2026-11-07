import test from "node:test";
import assert from "node:assert/strict";
import {
  embedCode,
  formatEmbedUpdatedAt,
  notionPageId,
  serializeEmbed,
  validNotionUrl,
} from "../lib/dashboard-model.ts";

const embed = {
  id: "studio-handbook",
  title: "Studio handbook",
  notionUrl: "https://studio.notion.site/handbook",
  theme: "light",
  font: "default",
  customCssEnabled: false,
  customCss: "",
  showTopBar: false,
  showCoverImage: true,
  showPageHeader: true,
  passwordProtected: false,
  emailAccess: false,
  allowedEmails: [],
  hideWatermark: false,
  height: 700,
  fullWidth: true,
  width: 640,
  fullHeight: false,
  border: false,
  borderWidth: 1,
  borderColor: "#e5e7eb",
  radius: 8,
  backgroundStyle: "none",
  active: true,
  createdAt: "2026-10-24T12:00:00Z",
  updatedAt: "2026-10-29T08:47:00Z",
};

test("accepts only HTTPS Notion page links", () => {
  for (const value of ["https://studio.notion.site/handbook", "https://www.notion.so/page", "https://www.notion.com/page"]) assert.equal(validNotionUrl(value), true);
  for (const value of ["javascript:alert(1)", "https://notion.site.evil.com/page", "https://evilnotion.so/page", "http://notion.so/page", "https://notion.so/", "https://user:pass@notion.so/page", "invalid"]) assert.equal(validNotionUrl(value), false);
});

test("extracts a page ID from published Notion URLs without consuming slug characters", () => {
  assert.equal(
    notionPageId(
      "https://hiarun.notion.site/Notion-Beginner-Course-b18b64a9727a82cf983101d4ae812ac7?source=copy_link",
    ),
    "b18b64a9727a82cf983101d4ae812ac7",
  );
  assert.equal(
    notionPageId(
      "https://www.notion.so/Notion-Course-b18b64a9-727a-82cf-9831-01d4ae812ac7",
    ),
    "b18b64a9727a82cf983101d4ae812ac7",
  );
  assert.equal(
    notionPageId("https://hiarun.notion.site/notion-beginner-course"),
    null,
  );
});

test("formats embed timestamps consistently for server hydration", () => {
  assert.equal(
    formatEmbedUpdatedAt("2026-10-29T08:47:00Z"),
    "Oct 29, 2026, 08:47 AM",
  );
  assert.equal(formatEmbedUpdatedAt(""), "Unsaved preview");
});

test("iframe points to the app route and applies frame customization", () => {
  const code = embedCode(
    {
      ...embed,
      title: 'A "quote" <script>',
      border: true,
      borderWidth: 3,
      borderColor: "#ff5a1f",
      fullWidth: false,
      width: 880,
      fullHeight: true,
      radius: 16,
    },
    "https://embed.example",
  );
  assert.ok(code.includes('src="https://embed.example/embed/studio-handbook"'));
  assert.ok(code.includes('width="880"'));
  assert.ok(code.includes("width:880px"));
  assert.ok(code.includes('height="100%"'));
  assert.ok(code.includes("&quot;quote&quot; &lt;script&gt;"));
  assert.ok(code.includes("height:100vh"));
  assert.ok(code.includes("border:3px solid #ff5a1f"));
  assert.ok(code.includes("border-radius:16px"));
  assert.ok(!code.includes("notion.site"));
});

test("serializes database embed fields for the dashboard", () => {
  assert.deepEqual(
    serializeEmbed({
      id: embed.id,
      title: embed.title,
      notionUrl: embed.notionUrl,
      theme: "DARK",
      font: "SERIF",
      customCssEnabled: true,
      customCss: ".notion { color: red; }",
      showTopBar: true,
      showCoverImage: false,
      showPageHeader: false,
      passwordHash: "scrypt$test$hash",
      emailAccess: true,
      allowedEmails: ["team@example.com"],
      hideWatermark: true,
      height: embed.height,
      fullWidth: embed.fullWidth,
      width: embed.width,
      fullHeight: embed.fullHeight,
      border: embed.border,
      borderWidth: embed.borderWidth,
      borderColor: embed.borderColor,
      borderRadius: embed.radius,
      backgroundStyle: embed.backgroundStyle,
      isActive: embed.active,
      createdAt: new Date(embed.createdAt),
      updatedAt: new Date(embed.updatedAt),
    }),
    {
      ...embed,
      theme: "dark",
      font: "serif",
      customCssEnabled: true,
      customCss: ".notion { color: red; }",
      showTopBar: true,
      showCoverImage: false,
      showPageHeader: false,
      passwordProtected: true,
      emailAccess: true,
      allowedEmails: ["team@example.com"],
      hideWatermark: true,
      createdAt: "2026-10-24T12:00:00.000Z",
      updatedAt: "2026-10-29T08:47:00.000Z",
    },
  );
});

test("hides the watermark automatically for Pro embeds", () => {
  const databaseEmbed = {
    id: embed.id,
    title: embed.title,
    notionUrl: embed.notionUrl,
    theme: "LIGHT",
    font: "DEFAULT",
    customCssEnabled: false,
    customCss: null,
    showTopBar: false,
    showCoverImage: true,
    showPageHeader: true,
    passwordHash: null,
    emailAccess: false,
    allowedEmails: [],
    hideWatermark: false,
    height: embed.height,
    fullWidth: embed.fullWidth,
    width: embed.width,
    fullHeight: embed.fullHeight,
    border: embed.border,
    borderWidth: embed.borderWidth,
    borderColor: embed.borderColor,
    borderRadius: embed.radius,
    backgroundStyle: "aqua",
    isActive: embed.active,
    createdAt: embed.createdAt,
    updatedAt: embed.updatedAt,
  };
  const serialized = serializeEmbed(databaseEmbed, { hasProAccess: true });

  assert.equal(serialized.hideWatermark, true);
  assert.equal(serialized.backgroundStyle, "aqua");
  assert.equal(
    serializeEmbed(
      { ...databaseEmbed, hideWatermark: true },
      { hasProAccess: false },
    ).hideWatermark,
    false,
  );
  assert.equal(
    serializeEmbed(databaseEmbed, { hasProAccess: false }).backgroundStyle,
    "aqua",
  );

  const freeEmbed = serializeEmbed(
    {
      ...databaseEmbed,
      font: "SERIF",
      customCssEnabled: true,
      customCss: ".notion { color: red; }",
      showTopBar: true,
      showCoverImage: false,
      showPageHeader: false,
      passwordHash: "scrypt$test$hash",
      emailAccess: true,
      allowedEmails: ["team@example.com"],
      hideWatermark: true,
    },
    { hasProAccess: false },
  );

  assert.equal(freeEmbed.font, "default");
  assert.equal(freeEmbed.customCssEnabled, false);
  assert.equal(freeEmbed.customCss, "");
  assert.equal(freeEmbed.showTopBar, false);
  assert.equal(freeEmbed.showCoverImage, true);
  assert.equal(freeEmbed.showPageHeader, true);
  assert.equal(freeEmbed.passwordProtected, false);
  assert.equal(freeEmbed.emailAccess, false);
  assert.deepEqual(freeEmbed.allowedEmails, []);
  assert.equal(freeEmbed.hideWatermark, false);
});
