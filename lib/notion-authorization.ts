import type { ExtendedRecordMap } from "notion-types";
import { getBlockValue, idToUuid } from "notion-utils";

type ParentNode = {
  parent_id?: string;
  parent_table?: string;
};

function normalizePageId(value: unknown) {
  if (typeof value !== "string") return null;
  const compact = value.trim().replaceAll("-", "").toLowerCase();
  return /^[0-9a-f]{32}$/.test(compact) ? compact : null;
}

function collectionValue(recordMap: ExtendedRecordMap, id: string) {
  return recordMap.collection[idToUuid(id)]?.value as ParentNode | undefined;
}

export function isAuthorizedNotionSubpage(
  recordMap: ExtendedRecordMap,
  rootPageId: string,
  requestedPageId: string,
) {
  const rootId = normalizePageId(rootPageId);
  const requestedId = normalizePageId(requestedPageId);
  if (!rootId || !requestedId) return false;
  if (rootId === requestedId) return true;

  const requestedBlock = getBlockValue(
    recordMap.block[idToUuid(requestedId)],
  );
  if (
    !requestedBlock ||
    (requestedBlock.type !== "page" &&
      requestedBlock.type !== "collection_view_page")
  ) {
    return false;
  }

  let table = "block";
  let id = requestedId;
  const visited = new Set<string>();

  for (let depth = 0; depth < 128; depth += 1) {
    const visitKey = `${table}:${id}`;
    if (visited.has(visitKey)) return false;
    visited.add(visitKey);

    const node =
      table === "block"
        ? getBlockValue(recordMap.block[idToUuid(id)])
        : table === "collection"
          ? collectionValue(recordMap, id)
          : undefined;
    const parentId = normalizePageId(node?.parent_id);
    const parentTable = node?.parent_table;

    if (!parentId || !parentTable) return false;
    if (parentTable === "block" && parentId === rootId) return true;
    if (parentTable !== "block" && parentTable !== "collection") return false;

    table = parentTable;
    id = parentId;
  }

  return false;
}
