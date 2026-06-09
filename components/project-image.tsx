import { Code2, Layers3, Rocket, Smartphone } from "lucide-react";
import Image from "next/image";
import { cn, displayImageUrl } from "@/lib/utils";

export default function ProjectImage({
  imageUrl,
  title,
  alt,
  className = "",
}: {
  imageUrl?: string | null;
  title: string;
  alt?: string;
  className?: string;
}) {
  const src = displayImageUrl(imageUrl ?? "");

  if (src) {
    return (
      <span className={cn("relative block overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt || title}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          unoptimized
        />
      </span>
    );
  }

  const initials = title
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div role="img" aria-label={alt || title} className={cn(className, "relative overflow-hidden bg-primary text-white font-black")}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.26),transparent_26%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_48%,rgba(0,0,0,0.16))]" />
      <div className="absolute -left-16 bottom-8 h-44 w-44 rounded-full border border-white/10" />
      <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute inset-x-5 top-5 flex items-center justify-between rounded-md border border-white/18 bg-white/12 px-3 py-2 shadow-lg backdrop-blur">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/80" />
          <span className="h-2 w-2 rounded-full bg-white/50" />
          <span className="h-2 w-2 rounded-full bg-white/35" />
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span className="h-1.5 w-16 rounded-full bg-white/25" />
          <Code2 size={16} />
        </div>
      </div>
      <div className="relative flex h-full min-h-48 flex-col items-center justify-center px-6 pt-14 text-center">
        <div className="relative grid h-28 w-28 place-items-center rounded-2xl border border-white/24 bg-white/14 shadow-2xl backdrop-blur">
          <Layers3 className="absolute -right-7 -top-6 text-white/30" size={38} />
          <Rocket className="absolute -left-5 bottom-4 text-accent" size={25} />
          <span className="text-5xl tracking-normal">{initials}</span>
        </div>
        <div className="mt-6 w-full max-w-xs space-y-2.5">
          <div className="mx-auto h-2.5 w-4/5 rounded-full bg-white/55" />
          <div className="mx-auto h-2.5 w-3/5 rounded-full bg-white/32" />
          <div className="mx-auto grid w-4/5 grid-cols-3 gap-2 pt-1">
            <span className="h-2 rounded-full bg-white/25" />
            <span className="h-2 rounded-full bg-white/35" />
            <span className="h-2 rounded-full bg-white/25" />
          </div>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/13 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/85 shadow-lg backdrop-blur">
          <Smartphone size={14} />
          Case Study
        </div>
      </div>
    </div>
  );
}
