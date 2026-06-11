"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ProjectImage from "@/components/project-image";
import type { Project } from "@/lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function orbitDistance(index: number, active: number, total: number) {
  let distance = index - active;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
}

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pauseUntilRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, moved: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const activeProject = projects[activeIndex];
  const progress = useMemo(() => (projects.length ? ((activeIndex + 1) / projects.length) * 100 : 0), [activeIndex, projects.length]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".project-showcase-copy > *",
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(".project-stage", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: rootRef.current, start: "top 72%", toggleActions: "play none none reverse" } });
      });

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [projects.length] }
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      function positionCards(animate: boolean) {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;

          const distance = orbitDistance(index, activeIndex, projects.length);
          const depth = Math.abs(distance);
          const hidden = depth > 1;
          const x = distance * 210;
          const y = depth * 18;
          const scale = distance === 0 ? 1 : 0.82 - depth * 0.04;
          const rotateY = distance * -18;
          const vars = {
            xPercent: -50,
            yPercent: -50,
            x,
            y,
            scale,
            rotateY,
            opacity: hidden ? 0 : 1 - depth * 0.22,
            zIndex: 20 - depth,
            filter: distance === 0 ? "blur(0px)" : `blur(${depth * 0.35}px)`,
            pointerEvents: hidden ? "none" : "auto",
            overwrite: "auto" as const
          };

          if (animate) gsap.to(card, { ...vars, duration: 0.62, ease: "power3.inOut" });
          else gsap.set(card, vars);
        });
      }

      media.add("(prefers-reduced-motion: no-preference)", () => {
        positionCards(true);

        gsap.to(".project-progress-bar", {
          width: `${progress}%`,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto"
        });
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        positionCards(false);
        gsap.set(".project-progress-bar", { width: `${progress}%` });
      });

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [activeIndex, projects.length, progress] }
  );

  useEffect(() => {
    if (projects.length <= 1) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const interval = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setActiveIndex((current) => wrapIndex(current + 1, projects.length));
    }, 3600);

    return () => window.clearInterval(interval);
  }, [projects.length]);

  if (!projects.length || !activeProject) return null;

  function pauseAutoScroll(duration = 4200) {
    pauseUntilRef.current = Date.now() + duration;
  }

  function goTo(index: number, pause = true) {
    if (pause) pauseAutoScroll();
    setActiveIndex(wrapIndex(index, projects.length));
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function previous() {
    goTo(activeIndex - 1);
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    pauseAutoScroll();
    dragRef.current = { active: true, startX: event.clientX, moved: false };
    setIsDragging(false);
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag.active) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) < 18) return;

    drag.moved = true;
    setIsDragging(true);
  }

  function stopDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag.active) return;

    const delta = event.clientX - drag.startX;
    dragRef.current.active = false;
    setIsDragging(false);

    if (Math.abs(delta) > 56) {
      if (delta < 0) next();
      else previous();
    }
  }

  return (
    <div
      ref={rootRef}
      className="project-showcase mt-10 grid items-center gap-8 overflow-hidden rounded-md border border-border bg-surface px-4 py-5 shadow-sm sm:px-6 lg:grid-cols-[minmax(20rem,0.62fr)_minmax(0,1.38fr)] lg:px-7 lg:py-7"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") previous();
      }}
    >
      <div className="project-showcase-copy relative z-20 order-2 lg:order-1">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-accent">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
        <h3 className="mt-3 text-3xl font-black leading-tight text-primary sm:text-4xl">{activeProject.title}</h3>
        <p className="mt-4 line-clamp-2 max-w-xl text-sm font-semibold leading-7 text-ink">{activeProject.shortDescription}</p>

        <TechStackRow techStack={activeProject.techStack} />

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-black text-button-text shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90" href={`/projects/${activeProject.slug}`}>
            Open case study
            <ArrowRight size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" className="focus-ring grid h-11 w-11 place-items-center rounded-md border border-border bg-background text-primary transition hover:border-primary" onClick={previous} aria-label="Previous project">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="focus-ring grid h-11 w-11 place-items-center rounded-md border border-border bg-background text-primary transition hover:border-primary" onClick={next} aria-label="Next project">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-7 h-2 overflow-hidden rounded-full bg-background">
          <div className="project-progress-bar h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div
        className={`project-stage relative z-10 order-1 mx-auto grid w-full place-items-center lg:order-2 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        role="listbox"
        aria-label="Featured projects"
        tabIndex={0}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;

          return (
            <Link
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              href={`/projects/${project.slug}`}
              key={project.id}
              className="project-orbit-card focus-ring absolute w-[78vw] max-w-[25rem] rounded-md border border-border bg-background p-3 shadow-panel sm:w-[23rem]"
              aria-selected={isActive}
              role="option"
              onClick={(event) => {
                if (dragRef.current.moved) {
                  event.preventDefault();
                  return;
                }

                if (!isActive) {
                  event.preventDefault();
                  pauseAutoScroll();
                  goTo(index);
                }
              }}
            >
              <div className="relative overflow-hidden rounded-md border border-border bg-surface">
                <ProjectImage imageUrl={project.imageUrl} title={project.title} alt={project.title} className="h-52 w-full object-cover sm:h-60" />
                <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                  <span className="rounded-md bg-background/90 px-3 py-1 text-xs font-black text-accent shadow-sm backdrop-blur">{project.status}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-background/90 text-accent shadow-sm backdrop-blur">
                    <Star size={17} />
                  </span>
                </div>
              </div>
              <div className="p-2 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-xl font-black leading-tight text-primary">{project.title}</h4>
                  {isActive ? <ArrowRight className="mt-1 shrink-0 text-accent" size={18} /> : <ArrowLeft className="mt-1 shrink-0 text-ink/45" size={18} />}
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-ink">{project.shortDescription}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TechStackRow({ techStack }: { techStack: string[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(techStack.length);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;

    function updateVisibleCount() {
      if (!row || !measure) return;

      const availableWidth = row.clientWidth;
      const chips = Array.from(measure.children) as HTMLElement[];
      const gap = Number.parseFloat(window.getComputedStyle(measure).columnGap || "0");
      let usedWidth = 0;
      let nextVisibleCount = 0;

      for (const chip of chips) {
        const nextWidth = usedWidth + chip.offsetWidth + (nextVisibleCount > 0 ? gap : 0);
        if (nextWidth > availableWidth) break;

        usedWidth = nextWidth;
        nextVisibleCount += 1;
      }

      setVisibleCount(Math.max(nextVisibleCount, techStack.length > 0 ? 1 : 0));
    }

    updateVisibleCount();

    const resizeObserver = new ResizeObserver(updateVisibleCount);
    resizeObserver.observe(row);
    resizeObserver.observe(measure);

    return () => resizeObserver.disconnect();
  }, [techStack]);

  return (
    <div className="relative mt-5 min-w-0">
      <div ref={rowRef} className="flex min-w-0 flex-nowrap gap-2 overflow-hidden">
        {techStack.slice(0, visibleCount).map((tech) => (
          <TechChip key={tech} tech={tech} />
        ))}
      </div>
      <div ref={measureRef} className="invisible pointer-events-none absolute inset-x-0 top-0 flex flex-nowrap gap-2" aria-hidden="true">
        {techStack.map((tech) => (
          <TechChip key={tech} tech={tech} />
        ))}
      </div>
    </div>
  );
}

function TechChip({ tech }: { tech: string }) {
  return <span className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-black text-ink">{tech}</span>;
}
