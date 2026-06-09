"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ExperienceMotion({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: Array<() => void> = [];

        gsap.fromTo(
          ".experience-card",
          { x: -34, opacity: 0, rotateY: 8, scale: 0.97 },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: scope.current,
              start: "top 76%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(
          ".proof-card",
          { x: 34, opacity: 0, rotateY: -8, scale: 0.97 },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scope.current,
              start: "top 76%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(
          ".experience-highlight",
          { x: -16, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.48,
            ease: "power2.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: scope.current,
              start: "top 64%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(
          ".proof-item",
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: ".proof-card",
              start: "top 78%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.utils.toArray<HTMLElement>(".experience-card, .proof-card").forEach((card) => {
          const onEnter = () => {
            gsap.to(card, {
              y: -7,
              scale: 1.015,
              duration: 0.28,
              ease: "power3.out",
              overwrite: "auto"
            });
          };

          const onLeave = () => {
            gsap.to(card, {
              y: 0,
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
