export function AuthDivider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-[#2a2a2a]" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider">
        <span className="bg-[#111111] px-3 text-zinc-500">Or</span>
      </div>
    </div>
  );
}
