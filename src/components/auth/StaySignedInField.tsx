"use client";

export function StaySignedInField({
  checked,
  onChange,
  id = "rememberMe",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] px-3 py-3"
    >
      <input
        id={id}
        name="rememberMe"
        type="checkbox"
        value="on"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#2a2a2a] bg-[#181818] text-red-600 focus:ring-red-600"
      />
      <span className="text-left">
        <span className="block text-sm font-semibold text-white">
          Stay signed in
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500">
          Keep me logged in on this device. Uncheck on shared computers.
        </span>
      </span>
    </label>
  );
}
