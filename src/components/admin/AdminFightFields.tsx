"use client";

import { useState } from "react";

export function AdminFightFields() {
  const [favouriteSide, setFavouriteSide] = useState("none");

  const levelDisabled = favouriteSide === "none";

  return (
    <>
      <label className="block text-xs text-zinc-400">
        Favourite Side *
        <select
          name="favourite_side"
          required
          value={favouriteSide}
          onChange={(e) => setFavouriteSide(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
        >
          <option value="none">None (Even Fight)</option>
          <option value="fighterA">Fighter A</option>
          <option value="fighterB">Fighter B</option>
        </select>
      </label>
      <label className="block text-xs text-zinc-400">
        Favourite Level *
        <select
          name="favourite_level"
          required
          defaultValue="even"
          key={favouriteSide}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
        >
          {levelDisabled ? (
            <option value="even">Even</option>
          ) : (
            <>
              <option value="favourite">Favourite</option>
              <option value="heavy_favourite">Heavy Favourite</option>
            </>
          )}
        </select>
        <p className="mt-1 text-[10px] text-zinc-500">
          Even fights: None + Even. Sided fights: pick Favourite or Heavy
          Favourite for the selected side.
        </p>
      </label>
    </>
  );
}
