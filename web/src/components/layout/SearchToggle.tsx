"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchToggle({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close search" : "Search murmurs"}
        aria-expanded={open}
        className={`flex h-9 w-9 items-center justify-center border-brutal transition-colors ${
          open ? "bg-ink text-accent" : "bg-surface-2 text-ink"
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          {open ? "close" : "search"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[min(18rem,calc(100vw-2rem))] border-brutal bg-surface p-2 shadow-brutal-sm">
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search rants, gossip…"
            className="w-full border-brutal bg-canvas px-3 py-2 font-mono text-sm normal-case text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
