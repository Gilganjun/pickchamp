interface ProfileStatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function ProfileStatCard({ label, value, sub }: ProfileStatCardProps) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-black">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-zinc-500">{sub}</p>}
    </div>
  );
}
