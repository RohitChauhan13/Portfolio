"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DataServerIcon from "@/Image/icons/data-server.png";
import HtmlIcon from "@/Image/icons/html.png";
import JavaScriptIcon from "@/Image/icons/java-script.png";
import JavaIcon from "@/Image/icons/java.png";
import MySqlIcon from "@/Image/icons/mysql.png";
import PythonIcon from "@/Image/icons/python.png";
import ReactNativeIcon from "@/Image/icons/react-native.png";
import TypeScriptIcon from "@/Image/icons/typescript.png";

gsap.registerPlugin(useGSAP);

type TechIcon = {
  icon: StaticImageData;
  left: string;
  top: string;
  delay: number;
  duration: number;
  drift: number;
  size: string;
  iconSize: string;
  pulse: number;
};

const technologies: TechIcon[] = [
  { icon: JavaScriptIcon, left: "10%", top: "19%", delay: 0, duration: 13.5, drift: 1, size: "2.1rem", iconSize: "1.22rem", pulse: 1.035 },
  { icon: ReactNativeIcon, left: "26%", top: "64%", delay: -2.6, duration: 15.2, drift: -1, size: "2.55rem", iconSize: "1.62rem", pulse: 1.03 },
  { icon: TypeScriptIcon, left: "43%", top: "23%", delay: -4.2, duration: 15.8, drift: 1, size: "2.25rem", iconSize: "1.35rem", pulse: 1.04 },
  { icon: DataServerIcon, left: "58%", top: "76%", delay: -1.4, duration: 14.4, drift: -1, size: "2rem", iconSize: "1.15rem", pulse: 1.045 },
  { icon: MySqlIcon, left: "78%", top: "18%", delay: -5.1, duration: 16.5, drift: 1, size: "2.4rem", iconSize: "1.52rem", pulse: 1.035 },
  { icon: HtmlIcon, left: "88%", top: "66%", delay: -3.5, duration: 13.8, drift: -1, size: "1.92rem", iconSize: "1.08rem", pulse: 1.045 },
  { icon: PythonIcon, left: "15%", top: "82%", delay: -6.2, duration: 17.2, drift: 1, size: "2.2rem", iconSize: "1.34rem", pulse: 1.04 },
  { icon: JavaIcon, left: "69%", top: "48%", delay: -4.8, duration: 15.6, drift: -1, size: "2.05rem", iconSize: "1.2rem", pulse: 1.045 }
];

export function HeroTechField() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const icons = gsap.utils.toArray<HTMLElement>(".hero-tech-float");

        icons.forEach((icon, index) => {
          const drift = Number(icon.dataset.drift ?? 1);
          const pulse = Number(icon.dataset.pulse ?? 1.06);
          const duration = Number(icon.dataset.duration ?? 7);
          const delay = Number(icon.dataset.delay ?? 0);

          gsap.set(icon, {
            rotate: index % 2 === 0 ? -2 : 2,
            scale: 0.96,
            transformOrigin: "50% 50%"
          });

          gsap.to(icon, {
            keyframes: [
              { x: 22 * drift, y: -16, rotate: 2 * drift, scale: pulse, duration: duration * 0.2 },
              { x: 48 * drift, y: -42, rotate: 5 * drift, scale: 1, duration: duration * 0.22 },
              { x: 16 * drift, y: 10, rotate: -2 * drift, scale: pulse - 0.02, duration: duration * 0.2 },
              { x: -38 * drift, y: 36, rotate: -6 * drift, scale: 0.95, duration: duration * 0.2 },
              { x: 0, y: 0, rotate: -2 * drift, scale: 0.97, duration: duration * 0.18 }
            ],
            delay,
            ease: "sine.inOut",
            repeat: -1
          });
        });
      });

      return () => media.revert();
    },
    { scope }
  );

  return (
    <div className="hero-motion-field" ref={scope} aria-hidden="true">
      {technologies.map(({ icon, left, top, delay, duration, drift, size, iconSize, pulse }, index) => (
        <span
          className="hero-tech-float"
          data-delay={delay}
          data-drift={drift}
          data-duration={duration}
          data-pulse={pulse}
          key={`${left}-${top}-${index}`}
          style={
            {
              "--tech-left": left,
              "--tech-top": top,
              "--tech-size": size,
              "--tech-icon-size": iconSize
            } as CSSProperties
          }
        >
          <Image src={icon} alt="" className="hero-tech-icon" sizes="44px" />
        </span>
      ))}
    </div>
  );
}
