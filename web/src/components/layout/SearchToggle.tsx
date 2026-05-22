"use client";

import { useEffect, useRef, useState } from "react";
import { POST_CATEGORIES } from "@/lib/categories";
import { NavIcon } from "./HeaderIconButton";

export type SearchApplyPayload = { q: string; category: string };

type Props = {
  value: string;
  category: string;
  onApply: (payload: SearchApplyPayload) => void;
  /** Always expanded (mobile menu panel) */
  inline?: boolean;
};

export function SearchToggle({ value, category, onApply, inline }: Props) {
  const [open, setOpen] = useState(inline);
  const [draftQ, setDraftQ] = useState(value);
  const [draftCat, setDraftCat] = useState(category);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftQ(value);
    setDraftCat(category);
  }, [value, category]);

  useEffect(() => {
    if (open && !inline) inputRef.current?.focus();
  }, [open, inline]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    onApply({ q: draftQ.trim(), category: draftCat });
    if (!inline) setOpen(false);
  }

  const panel = (
    <form
      onSubmit={submit}
      className={`flex flex-col gap-2 ${inline ? "" : "w-[min(18rem,calc(100vw-2rem))] border-brutal bg-surface p-2 shadow-brutal-sm"}`}
    >
      <input
        ref={inputRef}
        type="search"
        value={draftQ}
        onChange={(e) => setDraftQ(e.target.value)}
        placeholder="Keywords…"
        className="w-full border-brutal bg-canvas px-3 py-2 font-mono text-sm normal-case text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
      />
      <select
        value={draftCat}
        onChange={(e) => setDraftCat(e.target.value)}
        aria-label="Category filter"
        className="w-full border-brutal bg-canvas px-2 py-2 font-mono text-xs font-bold uppercase text-ink"
      >
        <option value="">All categories</option>
        {POST_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        type="submit"
        title="Search"
        className="flex h-9 w-full items-center justify-center border-brutal bg-accent text-accent-fg"
        aria-label="Search"
      >
        <NavIcon name="search" className="text-xl" />
      </button>
    </form>
  );

  if (inline) return panel;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close search" : "Search murmurs"}
        aria-expanded={open}
        className={`flex h-9 w-9 items-center justify-center border-brutal transition-colors ${
          open || value || category
            ? "bg-ink text-accent"
            : "bg-surface-2 text-chrome-fg hover:bg-[var(--m-chrome-hover)]"
        }`}
      >
        <NavIcon name={open ? "close" : "search"} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2">{panel}</div>
      )}
    </div>
  );
}
