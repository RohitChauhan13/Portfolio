"use client";

import { useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/app/actions";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

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
            toggleActions: "play none none reverse"
          }
        });
      });

      return () => media.revert();
    },
    { scope: formRef }
  );

  return (
    <form
      ref={formRef}
      className="space-y-4"
      action={(formData) => {
        const email = String(formData.get("email") ?? "").trim();
        if (!emailPattern.test(email)) {
          toast.error("Please enter a valid email address.");
          return;
        }
        formData.set("email", email);

        startTransition(async () => {
          const result = await submitContact(formData);
          if (result.ok) {
            setSent(true);
            const button = formRef.current?.querySelector(".contact-submit");
            if (button) {
              gsap.fromTo(button, { scale: 0.96 }, { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.45)" });
            }
            window.dispatchEvent(new Event("contact-message-sent"));
            toast.success("Message sent");
          } else {
            toast.error(result.error);
          }
        });
      }}
    >
      <input className="hidden" name="company" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" autoComplete="name" />
        <Field name="email" label="Email" type="email" autoComplete="email" />
      </div>
      <Field name="subject" label="Subject" />
      <label className="contact-motion-item block">
        <span className="text-sm font-black text-primary">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={3000}
          placeholder="Write your message here..."
          aria-describedby="message-requirement"
          className="mt-2 w-full resize-y rounded-md border border-border bg-field px-4 py-3 text-sm leading-6 text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary"
          onBlur={(event) => animateField(event.currentTarget, false)}
          onFocus={(event) => animateField(event.currentTarget, true)}
        />
        <p id="message-requirement" className="mt-2 text-xs text-ink/70">Minimum 10 characters.</p>
      </label>
      <button disabled={isPending || sent} className="contact-motion-item contact-submit focus-ring inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-black text-button-text transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}
        {sent ? "Sent" : isPending ? "Sending" : "Send message"}
      </button>
    </form>
  );
}

function animateField(field: HTMLElement, active: boolean) {
  const label = field.closest("label");
  if (!label) return;
  gsap.to(label, {
    y: active ? -4 : 0,
    scale: active ? 1.018 : 1,
    duration: 0.24,
    ease: "power2.out"
  });
}

function Field({ name, label, type = "text", autoComplete }: { name: string; label: string; type?: string; autoComplete?: string }) {
  return (
    <label className="contact-motion-item block">
      <span className="text-sm font-black text-primary">{label}</span>
      <input name={name} type={type} required autoComplete={autoComplete} className="mt-2 h-12 w-full rounded-md border border-border bg-field px-4 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary" onBlur={(event) => animateField(event.currentTarget, false)} onFocus={(event) => animateField(event.currentTarget, true)} />
    </label>
  );
}
