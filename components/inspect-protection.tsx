"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function InspectProtection({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || pathname.startsWith("/rohit/admin")) return;

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = typeof event.key === "string" ? event.key.toLowerCase() : "";
      const blocked =
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && ["u", "s"].includes(key)) ||
        (event.metaKey && ["u", "s"].includes(key));

      if (blocked) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [enabled, pathname]);

  return null;
}
