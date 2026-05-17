export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-primary sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-ink sm:text-lg">{text}</p>}
    </div>
  );
}
