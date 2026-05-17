import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function listFromForm(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return initials || "RC";
}

export function displayImageUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  const driveId =
    trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1] ??
    trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/)?.[1] ??
    trimmed.match(/drive\.google\.com\/uc\?[^#]*[?&]id=([^&]+)/)?.[1] ??
    trimmed.match(/drive\.google\.com\/thumbnail\?[^#]*[?&]id=([^&]+)/)?.[1];

  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1000`;
  }

  return trimmed;
}

export function proxiedImageUrl(url: string) {
  const src = displayImageUrl(url);
  return src ? `/api/avatar-image?src=${encodeURIComponent(src)}` : "";
}
