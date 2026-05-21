"use client";

import { useTheme } from "./ThemeProvider";

type Props = {
  className?: string;
  compact?: boolean;
};

/** Light = yellow backgrounds · Dark = #1A1A1A terminal (Stitch design system). */
export function ThemeToggle({ className = "", compact = false }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`inline-flex items-center gap-2 border-brutal bg-surface font-mono text-xs font-bold uppercase text-ink shadow-brutal-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-x-0 active:translate-y-0 active:shadow-none ${compact ? "px-2 py-1.5" : "px-3 py-2"} ${className}`}
    >
      <span
        className={`flex h-5 w-9 shrink-0 items-center border-[2px] border-border p-0.5 transition-colors ${
          isDark ? "bg-surface-2 justify-end" : "bg-accent justify-start"
        }`}
        aria-hidden
      >
        <span
          className={`h-3.5 w-3.5 border-[2px] border-border ${
            isDark ? "bg-accent" : "bg-surface"
          }`}
        />
      </span>
      {!compact && (
        <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
      )}
      <span className="material-symbols-outlined text-base leading-none">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
