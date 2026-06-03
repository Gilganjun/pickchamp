import type { FavouriteLevel, FavouriteSide } from "./tierTypes";

export function validateFavouriteFields(
  favouriteSide: FavouriteSide,
  favouriteLevel: FavouriteLevel
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (favouriteSide === "none" && favouriteLevel !== "even") {
    errors.push(
      "When Favourite Side is None (even fight), Favourite Level must be Even."
    );
  }

  if (favouriteLevel === "even" && favouriteSide !== "none") {
    errors.push(
      "When Favourite Level is Even, Favourite Side must be None (even fight)."
    );
  }

  if (
    (favouriteSide === "fighterA" || favouriteSide === "fighterB") &&
    favouriteLevel === "even"
  ) {
    errors.push(
      "Fighter A or B as favourite cannot use Even level — use Favourite or Heavy Favourite."
    );
  }

  if (
    favouriteSide === "none" &&
    (favouriteLevel === "favourite" || favouriteLevel === "heavy_favourite")
  ) {
    errors.push(
      "None (even fight) requires Favourite Level Even."
    );
  }

  return { valid: errors.length === 0, errors };
}

export function parseFavouriteSideFromForm(
  value: string
): FavouriteSide {
  if (value === "fighterA" || value === "fighterB" || value === "none") {
    return value;
  }
  return "none";
}

export function parseFavouriteLevelFromForm(
  value: string
): FavouriteLevel {
  if (
    value === "heavy_favourite" ||
    value === "favourite" ||
    value === "even"
  ) {
    return value;
  }
  return "even";
}
