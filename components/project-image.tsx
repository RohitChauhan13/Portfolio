import { Code2, Layers3, Smartphone } from "lucide-react";
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
    <div
      role="img"
      aria-label={alt || title}
      className={cn(className, "relative overflow-hidden bg-primary text-white font-black")}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.22),transparent_26%)]" />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-md border border-white/15 bg-white/10 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/70" />
          <span className="h-2 w-2 rounded-full bg-white/45" />
          <span className="h-2 w-2 rounded-full bg-white/30" />
        </div>
        <Code2 size={16} className="text-white/60" />
      </div>
      <div className="relative flex h-full min-h-48 flex-col items-center justify-center px-6 pt-12 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-md border border-white/25 bg-white/14 shadow-2xl">
          <Layers3 className="absolute translate-x-11 -translate-y-10 text-white/30" size={34} />
          <span className="text-4xl tracking-normal">{initials}</span>
        </div>
        <div className="mt-5 w-full max-w-xs space-y-2">
          <div className="mx-auto h-2 w-3/4 rounded-full bg-white/50" />
          <div className="mx-auto h-2 w-1/2 rounded-full bg-white/30" />
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white/80">
          <Smartphone size={14} />
          Project
        </div>
      </div>
    </div>
  );
}
