"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { deleteRow } from "@/app/actions";

export function DeleteButton({ table, id, label = "item" }: { table: string; id: string; label?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const openConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const cancelDelete = () => {
    setIsOpen(false);
  };

  const confirmDelete = () => {
    if (!formRef.current) return;
    setIsDeleting(true);
    if (typeof formRef.current.requestSubmit === "function") {
      formRef.current.requestSubmit();
    } else {
      formRef.current.submit();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelDelete();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <form ref={formRef} action={deleteRow} className="inline-block">
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={openConfirm}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-danger/30 bg-danger-surface px-3 text-xs font-black text-danger transition hover:bg-danger-surface/80"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </form>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="w-full max-w-md rounded-md border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-danger-surface text-danger">
                <AlertTriangle size={22} />
              </div>
              <button ref={cancelRef} type="button" onClick={cancelDelete} className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-border text-ink">
                <X size={17} />
              </button>
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-danger">Confirm delete</p>
            <h2 id="delete-title" className="mt-2 text-2xl font-black text-primary">Delete this {label}?</h2>
            <p className="mt-3 text-sm leading-6 text-ink">
              This permanently removes it from the admin panel and public portfolio. You cannot undo this action.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="h-10 rounded-md border border-border bg-background px-4 text-sm font-black text-ink transition hover:bg-muted disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-danger px-4 text-sm font-black text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
