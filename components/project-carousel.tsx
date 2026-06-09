"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ProjectImage from "@/components/project-image";
import type { Project } from "@/lib/types";

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const pauseUntilRef = useRef(0);
  const suppressClickUntilRef = useRef(0);
  const dragRef = useRef({ active: false, captured: false, startX: 0, scrollLeft: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);
  const items = useMemo(() => (projects.length > 1 ? [...projects, ...projects] : projects), [projects]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || projects.length <= 1) return;

    let frame = 0;
    const tick = () => {
      const now = Date.now();
      const halfway = rail.scrollWidth / 2;

      if (now > pauseUntilRef.current) {
        rail.scrollLeft += 0.45;
        if (rail.scrollLeft >= halfway) rail.scrollLeft -= halfway;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [projects.length]);

  function pauseBriefly(duration = 1800) {
    pauseUntilRef.current = Date.now() + duration;
  }

  function wrapScroll() {
    const rail = railRef.current;
    if (!rail || projects.length <= 1) return;
    const halfway = rail.scrollWidth / 2;
    if (rail.scrollLeft >= halfway) rail.scrollLeft -= halfway;
    if (rail.scrollLeft <= 0) rail.scrollLeft += halfway;
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;
    pauseBriefly(3000);
    dragRef.current = { active: true, captured: false, startX: event.clientX, scrollLeft: rail.scrollLeft, moved: false };
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) < 16 && !drag.moved) return;
    if (!drag.captured) {
      drag.captured = true;
      rail.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }
    drag.moved = true;
    rail.scrollLeft = drag.scrollLeft - delta;
    wrapScroll();
  }

  function stopDrag(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    const { captured, moved } = dragRef.current;
    dragRef.current.active = false;
    dragRef.current.captured = false;
    dragRef.current.moved = false;
    if (moved) suppressClickUntilRef.current = Date.now() + 180;
    setIsDragging(false);
    pauseBriefly(1200);
    if (captured) rail?.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="mt-10">
      <div
        ref={railRef}
        className={`project-rail flex gap-5 overflow-x-auto px-2 py-5 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onWheel={() => {
          pauseBriefly(1600);
          requestAnimationFrame(wrapScroll);
        }}
      >
        {items.map((project, index) => (
          <Link
            href={`/projects/${project.slug}`}
            key={`${project.id}-${index}`}
            className="focus-ring w-[17rem] shrink-0 rounded-md border border-border bg-surface p-4 shadow-sm transition duration-200 hover:z-10 hover:scale-[1.06] hover:shadow-panel active:opacity-85 sm:w-[19rem]"
            onFocus={() => pauseBriefly(1200)}
            onClick={(event) => {
              if (Date.now() < suppressClickUntilRef.current) {
                event.preventDefault();
              }
            }}
          >
            <div className="overflow-hidden rounded-md border border-border bg-background">
              <ProjectImage imageUrl={project.imageUrl} title={project.title} alt={project.title} className="h-32 w-full object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-md bg-background px-3 py-1 text-xs font-black text-accent">{project.status}</span>
              <Star size={18} className="text-accent" />
            </div>
            <h3 className="mt-3 text-xl font-black text-primary">{project.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink">{project.shortDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-bold text-ink" key={tech}>{tech}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
