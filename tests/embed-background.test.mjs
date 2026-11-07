import assert from "node:assert/strict";
import test from "node:test";

import {
  embedBackgroundValue,
  isEmbedBackgroundStyle,
} from "../lib/embed-background.ts";

test("accepts only predefined embed background styles", () => {
  assert.equal(isEmbedBackgroundStyle("aqua"), true);
  assert.equal(isEmbedBackgroundStyle("url(javascript:alert(1))"), false);
  assert.equal(embedBackgroundValue("aqua"), "#74d4dd");
});
