import test from "node:test";
import assert from "node:assert/strict";
import { idToUuid } from "notion-utils";

import { isAuthorizedNotionSubpage } from "../lib/notion-authorization.ts";

const ids = {
  root: "11111111111111111111111111111111",
  child: "22222222222222222222222222222222",
  grandchild: "33333333333333333333333333333333",
  collectionBlock: "44444444444444444444444444444444",
  collection: "55555555555555555555555555555555",
  collectionPage: "66666666666666666666666666666666",
  text: "77777777777777777777777777777777",
  unrelated: "88888888888888888888888888888888",
};

function record(value) {
  return { role: "reader", value };
}

const recordMap = {
  block: {
    [idToUuid(ids.root)]: record({
      id: idToUuid(ids.root),
      type: "page",
      parent_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      parent_table: "space",
    }),
    [idToUuid(ids.child)]: record({
      id: idToUuid(ids.child),
      type: "page",
      parent_id: idToUuid(ids.root),
      parent_table: "block",
    }),
    [idToUuid(ids.grandchild)]: record({
      id: idToUuid(ids.grandchild),
      type: "page",
      parent_id: idToUuid(ids.child),
      parent_table: "block",
    }),
    [idToUuid(ids.collectionBlock)]: record({
      id: idToUuid(ids.collectionBlock),
      type: "collection_view",
      parent_id: idToUuid(ids.root),
      parent_table: "block",
    }),
    [idToUuid(ids.collectionPage)]: record({
      id: idToUuid(ids.collectionPage),
      type: "page",
      parent_id: idToUuid(ids.collection),
      parent_table: "collection",
    }),
    [idToUuid(ids.text)]: record({
      id: idToUuid(ids.text),
      type: "text",
      parent_id: idToUuid(ids.root),
      parent_table: "block",
    }),
    [idToUuid(ids.unrelated)]: record({
      id: idToUuid(ids.unrelated),
      type: "page",
      parent_id: "99999999-9999-9999-9999-999999999999",
      parent_table: "block",
    }),
  },
  collection: {
    [idToUuid(ids.collection)]: record({
      id: idToUuid(ids.collection),
      parent_id: idToUuid(ids.collectionBlock),
      parent_table: "block",
    }),
  },
};

test("authorizes only pages contained by the configured Notion root", () => {
  assert.equal(isAuthorizedNotionSubpage(recordMap, ids.root, ids.root), true);
  assert.equal(isAuthorizedNotionSubpage(recordMap, ids.root, ids.child), true);
  assert.equal(
    isAuthorizedNotionSubpage(recordMap, ids.root, ids.grandchild),
    true,
  );
  assert.equal(
    isAuthorizedNotionSubpage(recordMap, ids.root, ids.collectionPage),
    true,
  );
  assert.equal(isAuthorizedNotionSubpage(recordMap, ids.root, ids.text), false);
  assert.equal(
    isAuthorizedNotionSubpage(recordMap, ids.root, ids.unrelated),
    false,
  );
  assert.equal(
    isAuthorizedNotionSubpage(
      recordMap,
      ids.root,
      "ffffffffffffffffffffffffffffffff",
    ),
    false,
  );
});
