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
const defaultWarning = {
  title: "Message blocked",
  message: "Your message appears to contain spam, abusive, or inappropriate content. Please send a respectful and accurate message if you want to contact Rohit."
};
const fieldLimits = {
  name: 80,
  email: 120,
  subject: 100,
  message: 500
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [warning, setWarning] = useState<typeof defaultWarning | null>(null);

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
          } else if (result.warning) {
            setWarning({
              title: result.warning.title || defaultWarning.title,
              message: result.warning.message || defaultWarning.message
            });
          } else {
            toast.error(result.error);
          }
        });
      }}
    >
      <input className="hidden" name="company" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" autoComplete="name" maxLength={fieldLimits.name} />
        <Field name="email" label="Email" type="email" autoComplete="email" maxLength={fieldLimits.email} />
      </div>
      <Field name="subject" label="Subject" maxLength={fieldLimits.subject} />
      <label className="contact-motion-item block">
        <span className="text-sm font-black text-primary">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={fieldLimits.message}
          placeholder="Write your message here..."
          aria-describedby="message-requirement"
          className="mt-2 w-full resize-y rounded-md border border-border bg-field px-4 py-3 text-sm leading-6 text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary"
          onBlur={(event) => animateField(event.currentTarget, false)}
          onFocus={(event) => animateField(event.currentTarget, true)}
        />
        <p id="message-requirement" className="mt-2 text-xs text-ink/70">Minimum 10 characters, maximum {fieldLimits.message} characters.</p>
      </label>
      <button disabled={isPending || sent} className="contact-motion-item contact-submit focus-ring inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-black text-button-text transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}
        {sent ? "Sent" : isPending ? "Sending" : "Send message"}
      </button>
      {warning && <ContactWarningModal warning={warning} onClose={() => setWarning(null)} />}
    </form>
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
  gsap.to(label, {
    y: active ? -4 : 0,
    scale: active ? 1.018 : 1,
    duration: 0.24,
    ease: "power2.out"
  });
}

function Field({ name, label, type = "text", autoComplete, maxLength }: { name: string; label: string; type?: string; autoComplete?: string; maxLength: number }) {
  return (
    <label className="contact-motion-item block">
      <span className="text-sm font-black text-primary">{label}</span>
      <input name={name} type={type} required autoComplete={autoComplete} maxLength={maxLength} className="mt-2 h-12 w-full rounded-md border border-border bg-field px-4 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary" onBlur={(event) => animateField(event.currentTarget, false)} onFocus={(event) => animateField(event.currentTarget, true)} />
    </label>
  );
}
