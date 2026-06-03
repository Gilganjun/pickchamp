import { BrandHeader } from "@/components/BrandHeader";
import { getPredictorTitle } from "@/lib/profile/display";
import type { Profile } from "@/types";

interface ProfileHeroProps {
  profile: Profile;
  subtitle?: string;
}

export function ProfileHero({ profile, subtitle }: ProfileHeroProps) {
  const title = getPredictorTitle(profile.global_rating);
  const initials =
    profile.avatar_initials ?? profile.username.slice(0, 2).toUpperCase();

  return (
    <section className="text-center">
      <BrandHeader showTagline={false} compact centered />
      <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#181818] text-2xl font-black text-red-500 ring-2 ring-[#2a2a2a]">
        {initials}
      </div>
      <h1 className="mt-4 text-lg font-bold text-white">
        @{profile.username}
      </h1>
      {subtitle && (
        <p className="mt-1 text-[11px] text-zinc-500">{subtitle}</p>
      )}
      <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Fight Rating
      </p>
      <p className="mt-1 text-4xl font-black tabular-nums text-white">
        {profile.global_rating}
      </p>
      <p className="mt-2 text-sm font-semibold text-[#d4a853]">{title}</p>
    </section>
  );
}
