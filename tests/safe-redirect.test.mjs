import test from "node:test";
import assert from "node:assert/strict";

import { safeRedirectPath } from "../lib/safe-redirect.ts";

test("keeps same-origin application paths", () => {
  assert.equal(
    safeRedirectPath("/dashboard/embeds?tab=active#editor", "/fallback"),
    "/dashboard/embeds?tab=active#editor",
  );
});

test("rejects absolute, protocol-relative, backslash, and encoded redirects", () => {
  const unsafeValues = [
    "https://evil.example/path",
    "//evil.example/path",
    "/\\evil.example/path",
    "/%5c%5cevil.example/path",
    "/%255c%255cevil.example/path",
    "/%2f%2fevil.example/path",
    "/%",
  ];

  for (const value of unsafeValues) {
    assert.equal(safeRedirectPath(value, "/fallback"), "/fallback");
  }
});
