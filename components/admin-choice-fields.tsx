"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const inputClass = "h-10 w-full min-w-0 rounded-md border border-border bg-field px-3 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary";
const selectClass = `${inputClass} cursor-pointer`;
const labelClass = "grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-ink";

export function ChoiceSelect({ name, label, value, options }: { name: string; label: string; value: string; options: string[] }) {
  const initialIsCustom = Boolean(value) && !options.includes(value);
  const [selected, setSelected] = useState(initialIsCustom ? value : value);
  const [mode, setMode] = useState(initialIsCustom ? "custom" : "choice");
  const normalizedOptions = useMemo(() => (initialIsCustom ? [value, ...options] : options), [initialIsCustom, options, value]);
  const fieldValue = mode === "custom" ? selected.trim() : selected;

  return (
    <label className={labelClass}>
      {label}
      <input type="hidden" name={name} value={fieldValue} />
      <select
        className={selectClass}
        value={mode === "custom" && !normalizedOptions.includes(selected) ? "__other__" : selected}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue === "__other__") {
            setMode("custom");
            setSelected("");
            return;
          }
          setMode("choice");
          setSelected(nextValue);
        }}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {normalizedOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="__other__">Other</option>
      </select>
      {mode === "custom" && (
        <input className={inputClass} value={selected} onChange={(event) => setSelected(event.target.value)} placeholder={`Type other ${label.toLowerCase()}`} />
      )}
    </label>
  );
}

export function MultiChoiceSelect({ name, label, values, options }: { name: string; label: string; values: string[]; options: string[] }) {
  const [selected, setSelected] = useState(() => unique(values));
  const [customValue, setCustomValue] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const availableOptions = options.filter((option) => !selected.includes(option));

  function addValue(value: string) {
    const items = splitChoices(value);
    if (items.length === 0) return;
    setSelected((current) => unique([...current, ...items]));
    setCustomValue("");
    setIsAddingCustom(false);
  }

  return (
    <fieldset className="grid min-w-0 gap-3 rounded-md border border-border bg-field p-3">
      <legend className="px-1 text-xs font-black uppercase tracking-[0.12em] text-ink">{label}</legend>
      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
      <div className="flex min-h-11 min-w-0 flex-wrap gap-2 overflow-hidden rounded-md border border-border bg-surface p-2">
        {selected.length === 0 && <span className="px-2 py-1 text-sm font-bold text-field-muted">No tech selected yet</span>}
        {selected.map((value) => (
          <span key={value} className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm font-black text-button-text">
            <span className="min-w-0 truncate">{value}</span>
            <button className="rounded-full p-0.5 transition hover:bg-white/20" type="button" aria-label={`Remove ${value}`} onClick={() => setSelected((current) => current.filter((item) => item !== value))}>
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <select
          className={selectClass}
          value=""
          onChange={(event) => {
            const nextValue = event.target.value;
            if (nextValue === "__other__") {
              setIsAddingCustom(true);
              return;
            }
            addValue(nextValue);
          }}
        >
          <option value="">Add from dropdown</option>
          {availableOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="__other__">Other</option>
        </select>
        <button className="h-10 rounded-md border border-border bg-surface px-4 text-sm font-black text-primary transition hover:border-primary" type="button" onClick={() => setIsAddingCustom(true)}>
          Custom
        </button>
      </div>
      {isAddingCustom && (
        <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input className={inputClass} value={customValue} onChange={(event) => setCustomValue(event.target.value)} placeholder={`Add other ${label.toLowerCase()}`} />
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-button-text" type="button" onClick={() => addValue(customValue)}>
            <Plus size={15} />
            Add
          </button>
        </div>
      )}
    </fieldset>
  );
}

export function DatePickerField({ name, label, value }: { name: string; label: string; value: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.showPicker?.();
  }

  return (
    <label className={labelClass} onClick={openPicker}>
      {label}
      <input ref={inputRef} className={`${inputClass} cursor-pointer`} name={name} type="date" defaultValue={value} onFocus={openPicker} />
    </label>
  );
}

function unique(values: string[]) {
  return values.map(cleanChoice).filter(Boolean).filter((value, index, list) => list.indexOf(value) === index);
}

function splitChoices(value: string) {
  return value.split(/\n|,/).map(cleanChoice).filter(Boolean);
}

function cleanChoice(value: string) {
  return value.trim().replace(/[.;]+$/g, "");
}
