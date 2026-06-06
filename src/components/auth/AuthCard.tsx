import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 shadow-lg">
        <div className="mb-6 text-center">
          <Link href="/picks" className="text-2xl font-black tracking-tight">
            <span className="text-white">PICK</span>
            <span className="text-red-500">FIST</span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
        </div>
        {children}
        {footer ? (
          <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
