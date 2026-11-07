import test from "node:test";
import assert from "node:assert/strict";

import { normalizeNotionPageId } from "../lib/identifiers.ts";

test("normalizes only valid Notion page IDs", () => {
  assert.equal(
    normalizeNotionPageId("b18b64a9-727a-82cf-9831-01d4ae812ac7"),
    "b18b64a9727a82cf983101d4ae812ac7",
  );
  assert.equal(
    normalizeNotionPageId("B18B64A9727A82CF983101D4AE812AC7"),
    "b18b64a9727a82cf983101d4ae812ac7",
  );

  for (const value of [undefined, ["page"], "", "not-a-page", "a".repeat(31)]) {
    assert.equal(normalizeNotionPageId(value), null);
  }
});
