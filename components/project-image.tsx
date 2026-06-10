import { Rocket } from "lucide-react";
import Image from "next/image";
import { cn, displayImageUrl } from "@/lib/utils";

function initials(title: string) {
  return title
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function BrowserBar() {
  return (
    <div className="absolute inset-x-4 top-4 flex items-center gap-2.5 rounded-lg border border-white/12 bg-white/8 px-3 py-2">
      <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/70" />
        <span className="h-2 w-2 rounded-full bg-white/40" />
      </span>
      <span className="flex flex-1 items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1">
        <span className="h-1.5 w-24 rounded-full bg-white/25" />
      </span>
      <span className="flex shrink-0 items-center gap-2" aria-hidden="true">
        <span className="font-mono text-[10px] font-bold text-white/35 leading-none">&lt;/&gt;</span>
        <span className="flex h-5 w-5 items-center justify-center rounded border border-white/16 bg-white/8">
          <svg width="9" height="10" viewBox="0 0 9 10" fill="none" className="text-white/40">
            <path d="M1 1h7v8.5L4.5 7 1 9.5V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        </span>
      </span>
    </div>
  );
}

function DecoRings() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -bottom-12 -right-12 h-52 w-52 rounded-full border border-white/8" />
      <span className="absolute -bottom-4  -right-4  h-32 w-32 rounded-full border border-white/8" />
      <span className="absolute -right-6 top-8 h-20 w-20 rounded-full border border-white/6" />
    </span>
  );
}

function LayersColumn() {
  return (
    <div aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
      {[0.28, 0.18, 0.11].map((op, i) => (
        <span
          key={i}
          className="block rounded border border-white/20 bg-white/5"
          style={{ width: 18, height: 13, opacity: op }}
        />
      ))}
    </div>
  );
}

function RocketBadge() {
  return (
    <span
      aria-hidden="true"
      className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-lg ring-2 ring-white/10"
    >
      <Rocket size={13} className="text-white" strokeWidth={2.2} />
    </span>
  );
}

function InitialsBadge({ monogram }: { monogram: string }) {
  return (
    <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-white/16 bg-white/10 shadow-xl">
      <RocketBadge />
      <span aria-hidden="true" className="absolute bottom-1.5 left-2 flex gap-0.5">
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span className="h-1 w-1 rounded-full bg-white/14" />
      </span>
      <span className="relative z-10 text-3xl font-black tracking-tight text-white">
        {monogram}
      </span>
    </div>
  );
}

function BottomSkeleton() {
  return (
    <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
      <div className="h-2 w-3/4 rounded-full bg-white/30" />
      <div className="flex gap-1.5">
        {["w-12", "w-8", "w-10"].map((w, i) => (
          <span
            key={i}
            className={cn(
              "h-5 rounded-full border border-white/14 bg-white/8",
              w
            )}
          />
        ))}
      </div>
    </div>
  );
}

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

  const monogram = initials(title);

  return (
    <div
      role="img"
      aria-label={alt || title}
      className={cn(
        className,
        "relative overflow-hidden",
        "bg-[linear-gradient(160deg,#1e5fa8_0%,#0d3266_100%)]"
      )}
    >
      <DecoRings />
      <BrowserBar />
      <LayersColumn />

      <div className="relative flex min-h-[11rem] items-center justify-center">
        <InitialsBadge monogram={monogram} />
      </div>

      <BottomSkeleton />
    </div>
  );
}
