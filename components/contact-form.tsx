"use client";

import { useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/app/actions";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const defaultWarning = {
  title: "Message blocked",
  message:
    "Your message appears to contain spam, abusive, or inappropriate content. Please send a respectful and accurate message if you want to contact Rohit.",
};
const fieldLimits = { name: 80, email: 120, subject: 100, message: 500 };

const PLACEHOLDERS: Record<string, string[]> = {
  name: ["Your name...?", "What should I call you?", "e.g. Phunsukh Wangdu"],
  email: ["Your email...?", "Where can I reach you?", "e.g. you@domain.io"],
  subject: ["What's on your mind?", "Collaboration idea?", "Job opportunity?"],
  message: ["Write your message here...", "Hey Rohit, I wanted to reach out about...", "I came across your portfolio and..."],
};

function useTypingPlaceholder(phrases: string[]) {
  const elRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const state = useRef({ pi: 0, ci: 0, deleting: false, timer: 0 });

  const attach = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (!el || elRef.current === el) return;
    elRef.current = el;
    const s = state.current;

    const tick = () => {
      if (elRef.current === document.activeElement) {
        s.timer = window.setTimeout(tick, 300);
        return;
      }
      const phrase = phrases[s.pi];
      if (!s.deleting) {
        s.ci++;
        el.placeholder = phrase.slice(0, s.ci);
        if (s.ci >= phrase.length) {
          s.deleting = true;
          s.timer = window.setTimeout(tick, 1800);
        } else {
          s.timer = window.setTimeout(tick, 55 + Math.random() * 40);
        }
      } else {
        s.ci--;
        el.placeholder = phrase.slice(0, s.ci);
        if (s.ci <= 0) {
          s.deleting = false;
          s.pi = (s.pi + 1) % phrases.length;
          s.timer = window.setTimeout(tick, 400);
        } else {
          s.timer = window.setTimeout(tick, 30);
        }
      }
    };
    tick();
  };

  return attach;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [warning, setWarning] = useState<typeof defaultWarning | null>(null);
  const [msgLen, setMsgLen] = useState(0);
  const msgBarRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const attachName = useTypingPlaceholder(PLACEHOLDERS.name);
  const attachEmail = useTypingPlaceholder(PLACEHOLDERS.email);
  const attachSubject = useTypingPlaceholder(PLACEHOLDERS.subject);
  const attachMsg = useTypingPlaceholder(PLACEHOLDERS.message);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-motion-item", {
          y: 24,
          opacity: 0,
          duration: 0.62,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      });
      return () => media.revert();
    },
    { scope: formRef }
  );

  const updateMsgBar = (value: string) => {
    const len = value.length;
    setMsgLen(len);
    const pct = Math.min((len / fieldLimits.message) * 100, 100);
    if (msgBarRef.current) {
      gsap.to(msgBarRef.current, {
        width: `${pct}%`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const shakeField = (id: string) => {
    const el = formRef.current?.querySelector(`#cf-${id}`);
    if (!el) return;
    const label = (el as HTMLElement).closest("label");
    if (label) {
      gsap.fromTo(
        label,
        { x: 0 },
        { x: [-6, 6, -5, 5, -3, 3, 0][0], duration: 0.04, repeat: 6, yoyo: true, ease: "none",
          onComplete: () => gsap.set(label, { x: 0 }) }
      );
      gsap.fromTo(
        label.querySelector(".cf-label-text"),
        { color: "var(--color-danger, #E24B4A)" },
        { color: "", duration: 0.6, delay: 0.3 }
      );
    }
  };

  const launchPlane = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const icon = btn.querySelector(".cf-send-icon") as HTMLElement;
    const labelEl = btn.querySelector(".cf-send-label") as HTMLElement;
    if (!icon || !labelEl) return;
    gsap.to(labelEl, { opacity: 0, x: -8, duration: 0.18 });
    gsap.to(icon, {
      x: 60, y: -40, opacity: 0, rotate: -30, duration: 0.55, ease: "power2.in",
      onComplete: () => {
        gsap.set(icon, { x: 0, y: 0, opacity: 1, rotate: 0 });
        gsap.set(labelEl, { opacity: 1, x: 0 });
      },
    });
  };

  return (
    <form
      ref={formRef}
      className="space-y-4"
      action={(formData) => {
        const email = String(formData.get("email") ?? "").trim();
        const name = String(formData.get("name") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();

        let hasError = false;
        if (!name) { shakeField("name"); hasError = true; }
        if (!email || !emailPattern.test(email)) {
          shakeField("email");
          if (!email) { hasError = true; } else { toast.error("Please enter a valid email address."); return; }
        }
        if (!message) { shakeField("message"); hasError = true; }
        if (hasError) return;

        formData.set("email", email);
        launchPlane();

        startTransition(async () => {
          const result = await submitContact(formData);
          if (result.ok) {
            setSent(true);
            if (btnRef.current) {
              gsap.fromTo(btnRef.current, { scale: 0.94 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
            }
            window.dispatchEvent(new Event("contact-message-sent"));
            toast.success("Message sent");
          } else if (result.warning) {
            setWarning({
              title: result.warning.title || defaultWarning.title,
              message: result.warning.message || defaultWarning.message,
            });
          } else {
            toast.error(result.error);
          }
        });
      }}
    >
      <input className="hidden" name="company" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-4 sm:grid-cols-2">
        <SimpleField id="cf-name" name="name" label="Name" autoComplete="name" maxLength={fieldLimits.name} inputRef={attachName} onShake={shakeField} />
        <SimpleField id="cf-email" name="email" label="Email" type="email" autoComplete="email" maxLength={fieldLimits.email} inputRef={attachEmail} onShake={shakeField} />
      </div>

      <SimpleField id="cf-subject" name="subject" label="Subject" maxLength={fieldLimits.subject} inputRef={attachSubject} onShake={shakeField} />

      <label className="contact-motion-item block">
        <span className="cf-label-text text-sm font-black text-primary transition-colors">Message</span>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={fieldLimits.message}
          ref={attachMsg}
          aria-describedby="message-requirement"
          className="contact-field-input mt-2 w-full resize-y rounded-md border border-border bg-field px-4 py-3 text-sm leading-6 text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary"
          onChange={(e) => updateMsgBar(e.target.value)}
          onBlur={(e) => animateField(e.currentTarget, false)}
          onFocus={(e) => animateField(e.currentTarget, true)}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
            <div
              ref={msgBarRef}
              style={{ width: "0%", height: "100%", background: "var(--color-primary, #1e3a8a)", borderRadius: "9999px" }}
            />
          </div>
          <span id="message-requirement" className="shrink-0 text-[11px] tabular-nums text-ink/50">
            {msgLen} / {fieldLimits.message}
          </span>
        </div>
      </label>

      <button
        ref={btnRef}
        disabled={isPending || sent}
        type="submit"
        className="contact-motion-item contact-submit focus-ring relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-md bg-primary px-6 text-sm font-black text-button-text transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" size={17} />
        ) : (
          <svg
            className="cf-send-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
        <span className="cf-send-label">{sent ? "Sent ✓" : isPending ? "Sending..." : "Send message"}</span>
      </button>

      {warning && (
        <ContactWarningModal warning={warning} onClose={() => setWarning(null)} />
      )}
    </form>
  );
}

function SimpleField({
  id, name, label, type = "text", autoComplete, maxLength, inputRef, onShake,
}: {
  id: string; name: string; label: string; type?: string; autoComplete?: string;
  maxLength: number; inputRef: (el: HTMLInputElement | null) => void; onShake: (id: string) => void;
}) {
  void onShake;
  return (
    <label className="contact-motion-item block">
      <span className="cf-label-text text-sm font-black text-primary transition-colors">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={maxLength}
        ref={inputRef}
        className="contact-field-input mt-2 h-12 w-full rounded-md border border-border bg-field px-4 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary"
        onBlur={(e) => animateField(e.currentTarget, false)}
        onFocus={(e) => animateField(e.currentTarget, true)}
      />
    </label>
  );
}

function ContactWarningModal({ warning, onClose }: { warning: typeof defaultWarning; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4" role="dialog" aria-modal="true" aria-labelledby="contact-warning-title">
      <div className="w-full max-w-md rounded-md border border-danger/30 bg-surface p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-danger">Warning</p>
        <h3 id="contact-warning-title" className="mt-2 text-2xl font-black text-primary">{warning.title}</h3>
        <p className="mt-3 text-sm font-bold leading-6 text-ink">{warning.message}</p>
        <button type="button" className="mt-5 h-10 rounded-md bg-primary px-4 text-sm font-black text-button-text transition hover:bg-primary/90" onClick={onClose}>
          I understand
        </button>
      </div>
    </div>
  );
}

function animateField(field: HTMLElement, active: boolean) {
  const label = field.closest("label");
  if (!label) return;
  gsap.to(label, { y: active ? -3 : 0, scale: active ? 1.015 : 1, duration: 0.22, ease: "power2.out" });
}
