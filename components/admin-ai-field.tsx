"use client";

import { Check, Sparkles, X } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { enhanceAdminText } from "@/app/actions";

type Tone = "profile" | "project" | "experience" | "education" | "achievement" | "skill";

type Result = {
  original: string;
  enhanced: string;
  model: string;
};

const baseInputClass = "w-full min-w-0 rounded-md border border-border bg-field px-3 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary";

export function AdminAiField({
  name,
  label,
  defaultValue,
  tone,
  multiline = false,
  type = "text"
}: {
  name: string;
  label: string;
  defaultValue: string;
  tone: Tone;
  multiline?: boolean;
  type?: string;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputClass = `${baseInputClass} ${multiline ? "min-h-24 py-2 leading-6" : "h-10"}`;

  function enhance() {
    setError("");
    startTransition(async () => {
      const response = await enhanceAdminText({ label, value, tone });
      if (!response.ok) {
        setError(response.error ?? "AI enhancement failed. Please try again.");
        return;
      }
      if (!response.original || !response.enhanced || !response.model) {
        setError("AI enhancement returned an incomplete response. Please try again.");
        return;
      }
      setResult({ original: response.original, enhanced: response.enhanced, model: response.model });
    });
  }

  return (
    <div className="grid min-w-0 gap-1 text-xs font-black uppercase tracking-[0.12em] text-ink">
      <span className="flex items-center justify-between gap-3">
        <label htmlFor={id}>{label}</label>
        <button
          className="inline-flex h-8 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 text-xs font-black normal-case tracking-normal text-primary transition hover:border-primary hover:bg-primary hover:text-button-text disabled:cursor-wait disabled:opacity-70"
          type="button"
          onClick={enhance}
          disabled={isPending || value.trim().length < 2}
        >
          {isPending ? <AiLoader /> : <Sparkles size={14} />}
          {isPending ? "Enhancing" : "Enhance"}
        </button>
      </span>
      {multiline ? (
        <textarea id={id} className={inputClass} name={name} value={value} onChange={(event) => setValue(event.target.value)} />
      ) : (
        <input id={id} className={inputClass} name={name} type={type} value={value} onChange={(event) => setValue(event.target.value)} />
      )}
      {error && <span className="text-xs font-bold normal-case tracking-normal text-danger">{error}</span>}
      {result && (
        <ReviewModal
          label={label}
          result={result}
          onApply={() => {
            setValue(result.enhanced);
            setResult(null);
          }}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  );
}

function ReviewModal({ label, result, onApply, onClose }: { label: string; result: Result; onApply: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="my-6 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-md border border-border bg-surface shadow-panel">
        <div className="flex flex-col justify-between gap-3 border-b border-border bg-field p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">AI preview</p>
            <h2 className="mt-1 text-2xl font-black text-primary">{label}</h2>
            <p className="mt-1 text-sm font-bold text-ink">Model used: {result.model}</p>
          </div>
          <button className="inline-flex h-10 items-center justify-center rounded-md border border-border px-3 text-primary" type="button" onClick={onClose} aria-label="Close preview">
            <X size={18} />
          </button>
        </div>
        <div className="grid min-h-0 gap-4 overflow-hidden p-4 lg:grid-cols-2">
          <PreviewPane title="Before" text={result.original} />
          <PreviewPane title="After" text={result.enhanced} highlight />
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-border p-4 sm:flex-row sm:justify-end">
          <button className="h-11 rounded-md border border-border px-5 text-sm font-black text-primary" type="button" onClick={onClose}>
            Keep original
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-black text-button-text" type="button" onClick={onApply}>
            <Check size={16} />
            Apply enhanced text
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewPane({ title, text, highlight = false }: { title: string; text: string; highlight?: boolean }) {
  return (
    <section className={`min-h-0 rounded-md border p-4 ${highlight ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <h3 className="text-sm font-black uppercase tracking-[0.14em] text-primary">{title}</h3>
      <div className="mt-4 max-h-[46vh] overflow-y-auto rounded-md pr-2">
        <p className="whitespace-pre-wrap text-sm font-bold leading-7 text-ink">{text}</p>
      </div>
    </section>
  );
}

function AiLoader() {
  return (
    <span className="relative inline-flex h-4 w-4 items-center justify-center">
      <span className="absolute h-4 w-4 animate-ping rounded-full bg-current opacity-30" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
    </span>
  );
}
