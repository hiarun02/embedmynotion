export function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function normalizeNotionPageId(value: unknown) {
  if (typeof value !== "string") return null;

  const compact = value.trim().replaceAll("-", "").toLowerCase();
  return /^[0-9a-f]{32}$/.test(compact) ? compact : null;
}
