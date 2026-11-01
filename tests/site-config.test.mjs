import assert from "node:assert/strict";
import test from "node:test";

import { absoluteUrl, getSiteUrl } from "../lib/site-config.ts";

test("site URLs use and normalize the configured production origin", () => {
  const previousSiteUrl = process.env.SITE_URL;

  try {
    process.env.SITE_URL = "embedmynotion.com/some/path?preview=true";

    assert.equal(getSiteUrl(), "https://embedmynotion.com");
    assert.equal(absoluteUrl("/blog"), "https://embedmynotion.com/blog");
  } finally {
    if (previousSiteUrl === undefined) {
      delete process.env.SITE_URL;
    } else {
      process.env.SITE_URL = previousSiteUrl;
    }
  }
});
