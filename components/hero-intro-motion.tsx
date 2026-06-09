"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function HeroIntroMotion({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".hero-nav-item", { clearProps: "all", opacity: 1, y: 0 });

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .fromTo(
            ".hero-name-letter",
            { y: 56, opacity: 0, rotateX: -85, filter: "blur(8px)" },
            { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", duration: 0.72, stagger: 0.035, clearProps: "opacity,filter,transform" },
            0.05
          )
          .fromTo(".hero-copy-item", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, stagger: 0.08, clearProps: "opacity,transform" }, 0.42)
          .fromTo(".hero-art", { x: 44, y: 20, opacity: 0, scale: 0.94 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.9, clearProps: "opacity,transform" }, 0.2);

        gsap.timeline({ repeat: -1, repeatDelay: 1.9, delay: 1.25 })
          .to(".hero-name-letter", {
            y: -12,
            rotateZ: -5,
            scale: 1.08,
            textShadow: "0 14px 30px rgba(2, 132, 199, 0.26)",
            duration: 0.28,
            ease: "power2.out",
            stagger: { each: 0.035, from: "start" }
          })
          .to(".hero-name-letter", {
            y: 0,
            rotateZ: 0,
            scale: 1,
            textShadow: "0 0 0 rgba(2, 132, 199, 0)",
            duration: 0.42,
            ease: "elastic.out(1, 0.45)",
            stagger: { each: 0.03, from: "start" }
          }, 0.18);
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
