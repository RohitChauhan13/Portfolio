"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AppLoader } from "@/components/app-loader";

type PendingSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingChildren?: ReactNode;
};

export function PendingSubmitButton({ children, pendingChildren, disabled, ...props }: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && <AppLoader />}
      <button {...props} disabled={disabled || pending}>
        {pending ? pendingChildren ?? children : children}
      </button>
    </>
  );
}
