"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ContactTowMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top 76%",
            toggleActions: "play none none reverse"
          }
        });

        gsap.set(".contact-tow-card", { x: 860, y: 28, opacity: 0, rotate: 0.7 });
        gsap.set(".contact-tow-car", { x: 860, yPercent: -50, opacity: 1 });
        gsap.set(".contact-tow-rope", { x: 860, yPercent: -50, scaleX: 0.72, opacity: 0, transformOrigin: "left center" });
        gsap.set(".contact-stop-board", { scale: 0.82, opacity: 0, y: 8 });
        gsap.set(".contact-tow-wheel", { rotate: 0 });

        timeline
          .to(".contact-tow-rope", { opacity: 1, scaleX: 1, duration: 0.36, ease: "power2.out" })
          .to(".contact-tow-car", { x: 0, duration: 2.35, ease: "power1.inOut" }, 0)
          .to(".contact-tow-rope", { x: 0, duration: 2.35, ease: "power1.inOut" }, 0)
          .to(".contact-tow-card", { x: 0, y: 0, opacity: 1, rotate: 0, duration: 2.38, ease: "power1.inOut" }, 0.06)
          .to(".contact-tow-wheel", { rotate: -1560, duration: 2.38, ease: "none" }, 0)
          .to(".contact-tow-car", { y: -3, duration: 0.18, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.2)
          .to(".contact-stop-board", { scale: 1, opacity: 1, y: 0, duration: 0.34, ease: "back.out(2)" }, 1.55)
          .to(".contact-tow-rope", { opacity: 0.32, duration: 0.35, ease: "power2.out" }, "-=0.05");
      });

      media.add("(prefers-reduced-motion: reduce), (max-width: 1023px)", () => {
        gsap.set(".contact-tow-card", { clearProps: "all" });
        gsap.set(".contact-tow-car, .contact-tow-rope", { display: "none" });
      });

      return () => media.revert();
    },
    { scope }
  );

  return (
    <div className={`contact-tow-stage ${className}`} ref={scope}>
      <div className="contact-tow-car" aria-hidden="true">
        <div className="contact-car-body">
          <div className="contact-car-window" />
          <div className="contact-car-light" />
        </div>
        <span className="contact-tow-wheel contact-tow-wheel-left" />
        <span className="contact-tow-wheel contact-tow-wheel-right" />
      </div>
      <div className="contact-tow-rope" aria-hidden="true" />
      <div className="contact-stop-board" aria-hidden="true">
        <span>STOP</span>
      </div>
      {children}
    </div>
  );
}
