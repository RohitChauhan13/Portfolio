"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProjectsPageMotion({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: Array<() => void> = [];

        gsap.fromTo(
          ".projects-page-heading > *",
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.62,
            ease: "power3.out",
            stagger: 0.09
          }
        );

        gsap.fromTo(
          ".project-list-card",
          { y: 38, opacity: 0, scale: 0.96, rotateX: 5 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".project-list-grid",
              start: "top 82%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.utils.toArray<HTMLElement>(".project-list-card").forEach((card) => {
          const image = card.querySelector(".project-list-image");
          const chips = card.querySelectorAll(".project-list-chip");

          const onEnter = () => {
            gsap.to(card, { y: -8, scale: 1.012, duration: 0.28, ease: "power3.out", overwrite: "auto" });
            gsap.to(image, { scale: 1.06, duration: 0.45, ease: "power3.out", overwrite: "auto" });
            gsap.to(chips, { y: -2, duration: 0.22, ease: "power2.out", stagger: 0.025, overwrite: "auto" });
          };

          const onLeave = () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.24, ease: "power2.out", overwrite: "auto" });
            gsap.to(image, { scale: 1, duration: 0.36, ease: "power2.out", overwrite: "auto" });
            gsap.to(chips, { y: 0, duration: 0.2, ease: "power2.out", stagger: 0.02, overwrite: "auto" });
          };

          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointerleave", onLeave);
          });
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      });

      return () => media.revert();
    },
    { scope }
  );

  return (
    <div className={className} ref={scope}>
      {children}
    </div>
  );
}
