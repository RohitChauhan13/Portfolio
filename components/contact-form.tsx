"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/app/actions";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await submitContact(formData);
          if (result.ok) {
            setSent(true);
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
      <label className="block">
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
        />
        <p id="message-requirement" className="mt-2 text-xs text-ink/70">Minimum 10 characters.</p>
      </label>
      <button disabled={isPending || sent} className="focus-ring inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-black text-button-text transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
        <Send size={17} />
        {sent ? "Sent" : isPending ? "Sending" : "Send message"}
      </button>
    </form>
  );
}

function Field({ name, label, type = "text", autoComplete }: { name: string; label: string; type?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-primary">{label}</span>
      <input name={name} type={type} required autoComplete={autoComplete} className="mt-2 h-12 w-full rounded-md border border-border bg-field px-4 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary" />
    </label>
  );
}
