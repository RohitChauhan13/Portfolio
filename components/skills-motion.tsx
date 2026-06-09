"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SkillsMotion({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".skill-card");
        const cleanups: Array<() => void> = [];

        gsap.fromTo(
          cards,
          { y: 34, opacity: 0, rotateX: -10, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: scope.current,
              start: "top 78%",
              toggleActions: "play none none reverse"
            }
          }
        );

        cards.forEach((card) => {
          const bar = card.querySelector<HTMLElement>(".skill-bar");
          const level = Number(bar?.dataset.level ?? 0);

          if (bar) {
            gsap.fromTo(
              bar,
              { width: "0%" },
              {
                width: `${level}%`,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 84%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          }

          const onEnter = () => {
            gsap.to(card, {
              y: -7,
              rotateX: 3,
              rotateY: -3,
              scale: 1.025,
              duration: 0.28,
              ease: "power3.out",
              overwrite: "auto"
            });
          };

          const onLeave = () => {
            gsap.to(card, {
              y: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.24,
              ease: "power2.out",
              overwrite: "auto"
            });
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
