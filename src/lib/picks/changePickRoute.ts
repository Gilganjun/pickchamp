export const CHANGE_PICK_QUERY_KEY = "fight";

export function getChangePickHref(fightId: string): string {
  const params = new URLSearchParams({ [CHANGE_PICK_QUERY_KEY]: fightId });
  return `/picks?${params.toString()}`;
}
