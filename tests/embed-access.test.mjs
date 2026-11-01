import test from "node:test";
import assert from "node:assert/strict";

import {
  createEmbedAccessToken,
  hashEmbedPassword,
  verifyEmbedAccessToken,
  verifyEmbedPassword,
} from "../lib/embed-access.ts";

test("hashes and verifies embed passwords", async () => {
  const hash = await hashEmbedPassword("correct horse battery staple");
  assert.equal(await verifyEmbedPassword("correct horse battery staple", hash), true);
  assert.equal(await verifyEmbedPassword("wrong password", hash), false);
  assert.notEqual(hash, "correct horse battery staple");
});

test("creates signed access tokens scoped to the embed and password", async () => {
  const hash = await hashEmbedPassword("a secure password");
  const token = createEmbedAccessToken("embed-one", hash);

  assert.equal(verifyEmbedAccessToken(token, "embed-one", hash), true);
  assert.equal(verifyEmbedAccessToken(token, "embed-two", hash), false);
  assert.equal(verifyEmbedAccessToken(`${token}x`, "embed-one", hash), false);
});
