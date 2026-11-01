import test from "node:test";
import assert from "node:assert/strict";

import { hasProAccess } from "../lib/subscription.ts";

test("grants Pro access only to active or trialing Pro subscriptions", () => {
  assert.equal(hasProAccess({ plan: "PRO", status: "ACTIVE" }), true);
  assert.equal(hasProAccess({ plan: "PRO", status: "TRIALING" }), true);
  assert.equal(hasProAccess({ plan: "PRO", status: "PAST_DUE" }), false);
  assert.equal(hasProAccess({ plan: "FREE", status: "ACTIVE" }), false);
  assert.equal(hasProAccess(null), false);
});
