import Image from "next/image";
import { UserRound } from "lucide-react";
import { cn, initialsFromName, proxiedImageUrl } from "@/lib/utils";

type ProfileAvatarProps = {
  name: string;
  avatarUrl?: string;
  className?: string;
  priority?: boolean;
};

export function ProfileAvatar({ name, avatarUrl = "", className, priority = false }: ProfileAvatarProps) {
  const src = proxiedImageUrl(avatarUrl);
  const initials = initialsFromName(name);
  const fallback = src ? (
    <span className="absolute inset-0 grid h-full w-full place-items-center bg-primary text-button-text">
      {initials ? initials : <UserRound size={20} />}
    </span>
  ) : (
    <span className="grid h-full w-full place-items-center bg-primary text-button-text">
      {initials ? initials : <UserRound size={20} />}
    </span>
  );

  return (
    <span className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-primary text-sm font-black text-button-text", className)}>
      {src ? (
        <>
          {fallback}
          <Image src={src} alt="" fill unoptimized priority={priority} sizes="(max-width: 640px) 56px, 112px" className="relative z-10 object-cover" />
        </>
      ) : (
        fallback
      )}
    </span>
  );
}
