import test from "node:test";
import assert from "node:assert/strict";
import { embedCode, initialWorkspace, validNotionUrl, validWorkspace } from "../lib/dashboard-model.ts";

test("accepts only HTTPS Notion page links", () => {
  for (const value of ["https://studio.notion.site/handbook", "https://www.notion.so/page"]) assert.equal(validNotionUrl(value), true);
  for (const value of ["javascript:alert(1)", "https://notion.site.evil.com/page", "https://evilnotion.so/page", "http://notion.so/page", "https://notion.so/", "https://user:pass@notion.so/page", "invalid"]) assert.equal(validNotionUrl(value), false);
});
test("validates saved workspace data before rendering", () => {
  assert.equal(validWorkspace(initialWorkspace), true);
  for (const value of [null, {}, { ...initialWorkspace, plan: "invalid" }, { ...initialWorkspace, embeds: [{ ...initialWorkspace.embeds[0], height: -1 }] }]) assert.equal(validWorkspace(value), false);
});
test("iframe points to the app route and escapes user titles", () => {
  const code = embedCode({ ...initialWorkspace.embeds[0], title: 'A "quote" <script>', border: true, fullWidth: false }, "https://embed.example");
  assert.ok(code.includes('src="https://embed.example/embed/studio-handbook"'));
  assert.ok(code.includes('width="640"'));
  assert.ok(code.includes("&quot;quote&quot; &lt;script&gt;"));
  assert.ok(code.includes("border:1px solid"));
  assert.ok(!code.includes("notion.site"));
});
