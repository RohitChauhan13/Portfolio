"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function AdminPasswordField() {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? EyeOff : Eye;

  return (
    <label className="mt-4 block text-sm font-black text-primary">
      Password
      <span className="relative mt-2 block">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          required
          className="h-12 w-full rounded-md border border-border bg-field px-4 pr-12 text-field-foreground outline-none focus:border-primary"
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          title={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((visible) => !visible)}
          className="focus-ring absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-secondary transition hover:bg-surface hover:text-primary"
        >
          <Icon aria-hidden="true" size={18} strokeWidth={2.5} />
        </button>
      </span>
    </label>
  );
}
