interface AdminFormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function AdminFormSection({ title, children }: AdminFormSectionProps) {
  return (
    <section className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
      <h2 className="mb-4 text-sm font-bold uppercase text-zinc-300">
        {title}
      </h2>
      {children}
    </section>
  );
}
