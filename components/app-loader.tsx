"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const codeLines = ["career.ship({ focus: true });", "success ? levelUp() : learn();"];

export function AppLoader() {
  const scope = useRef<HTMLDivElement>(null);
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I"],
    ["A", "S", "D", "F", "G", "H", "J"],
    ["Z", "X", "C", "V", "B", "N"]
  ];
  const keyIndexes = new Map(rows.flat().map((key, index) => [key, index]));

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const keys = gsap.utils.toArray<HTMLElement>(".laptop-loader-key, .laptop-loader-space");
        const chars = gsap.utils.toArray<HTMLElement>(".laptop-loader-char");
        const lineOneChars = gsap.utils.toArray<HTMLElement>(".laptop-loader-line-1 .laptop-loader-char");
        const lineTwoChars = gsap.utils.toArray<HTMLElement>(".laptop-loader-line-2 .laptop-loader-char");
        const caretOne = scope.current?.querySelector<HTMLElement>(".laptop-loader-line-1 .laptop-loader-caret");
        const caretTwo = scope.current?.querySelector<HTMLElement>(".laptop-loader-line-2 .laptop-loader-caret");

        if (!caretOne || !caretTwo) return;

        gsap.set(chars, { opacity: 0.28, y: 0 });
        gsap.set([caretOne, caretTwo], { opacity: 0 });
        gsap.fromTo(
          ".laptop-loader",
          { y: 18, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.72, ease: "power3.out" }
        );
        gsap.to(".laptop-loader-screen", {
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -22px 44px rgba(21,23,150,0.06), 0 0 44px rgba(2,132,199,0.16)",
          duration: 1.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });

        const typing = gsap.timeline({ repeat: -1, repeatDelay: 0.65 });
        typing
          .set(caretOne, { opacity: 1 })
          .to(caretOne, { opacity: 0.2, duration: 0.16, yoyo: true, repeat: 1 }, "<")
          .to(lineOneChars, { opacity: 1, y: -1, duration: 0.035, stagger: 0.045, ease: "none" })
          .to(lineOneChars, { opacity: 0.7, y: 0, duration: 0.18, stagger: 0.012 }, "-=0.16")
          .set(caretOne, { opacity: 0 })
          .set(caretTwo, { opacity: 1 })
          .to(caretTwo, { opacity: 0.2, duration: 0.16, yoyo: true, repeat: 1 }, "<")
          .to(lineTwoChars, { opacity: 1, y: -1, duration: 0.035, stagger: 0.045, ease: "none" })
          .to(lineTwoChars, { opacity: 0.7, y: 0, duration: 0.18, stagger: 0.012 }, "-=0.16")
          .to(chars, { opacity: 1, duration: 0.18, yoyo: true, repeat: 1, delay: 0.18 })
          .to(chars, { opacity: 0.45, duration: 0.22 })
          .set([caretOne, caretTwo], { opacity: 0 });

        const keyTweens = keys.map((key, index) =>
          gsap.timeline({ repeat: -1, repeatDelay: 0.25 + ((index * 7) % 9) * 0.035, delay: (index % 11) * 0.045 })
            .to(key, {
              y: 4,
              scaleY: 0.55,
              opacity: 1,
              backgroundColor: "rgba(2, 132, 199, 0.82)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 16px rgba(2,132,199,0.28)",
              duration: 0.07,
              ease: "power1.in"
            })
            .to(key, {
              y: 0,
              scaleY: 1,
              opacity: 0.78,
              backgroundColor: "rgba(21, 23, 150, 0.2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.38), 0 3px 0 rgba(21,23,150,0.16)",
              duration: 0.13,
              ease: "back.out(2.4)"
            })
        );

        return () => {
          typing.kill();
          keyTweens.forEach((tween) => tween.kill());
        };
      });

      return () => media.revert();
    },
    { scope }
  );

  return (
    <div className="app-loader-screen" ref={scope} role="status" aria-label="Loading">
      <div className="laptop-loader" aria-hidden="true">
        <div className="laptop-loader-screen">
          <div className="laptop-loader-toolbar">
            <span />
            <span />
            <span />
          </div>
          <div className="laptop-loader-code">
            <span className="laptop-loader-prompt">~/rohit.dev</span>
            <span className="laptop-loader-line laptop-loader-line-1">{renderCodeLine(codeLines[0], 0)}<span className="laptop-loader-caret" /></span>
            <span className="laptop-loader-line laptop-loader-line-2">{renderCodeLine(codeLines[1], 1)}<span className="laptop-loader-caret" /></span>
          </div>
        </div>
        <div className="laptop-loader-hinge" />
        <div className="laptop-loader-keyboard">
          {rows.map((row) => (
            <div className="laptop-loader-key-row" key={row.join("")}>
              {row.map((key) => (
                <span className="laptop-loader-key" style={{ "--loader-key-delay": `${(((keyIndexes.get(key) ?? 0) * 7) % 11) * 0.07}s` } as CSSProperties} key={key}>{key}</span>
              ))}
            </div>
          ))}
          <span className="laptop-loader-space" style={{ "--loader-key-delay": "0.54s" } as CSSProperties}>SPACE</span>
        </div>
      </div>
      <p className="laptop-loader-label">Programming my own world...</p>
    </div>
  );
}

function renderCodeLine(line: string, lineIndex: number) {
  return line.split("").map((char, index) => (
    <span className="laptop-loader-char" style={{ "--loader-char-delay": `${lineIndex * 1.2 + index * 0.045}s` } as CSSProperties} key={`${char}-${index}`}>
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}
