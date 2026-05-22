"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MurmurLogo } from "@/components/brand/MurmurLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SearchToggle } from "./SearchToggle";

type Props = {
  children?: ReactNode;
  backHref?: string;
  backLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

const NAV = [
  { href: "/feed", label: "New" },
  { href: "/hot", label: "Hot" },
  { href: "/trending", label: "Trending" },
  { href: "/top", label: "Top" },
] as const;

export function AppHeader({
  children,
  backHref,
  backLabel,
  searchValue,
  onSearchChange,
}: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-brutal border-b bg-chrome text-chrome-fg shadow-brutal-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        {backHref ? (
          <Link
            href={backHref}
            className="font-mono text-xs font-bold uppercase text-chrome-fg underline-offset-2 hover:underline"
          >
            {backLabel ?? "← Back"}
          </Link>
        ) : (
          <MurmurLogo href="/feed" />
        )}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold uppercase">
          {!backHref &&
            NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-brutal px-2 py-1 transition-colors ${
                  pathname === item.href
                    ? "bg-accent text-accent-fg"
                    : "bg-surface-2 text-chrome-fg hover:bg-[var(--m-chrome-hover)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          {onSearchChange && searchValue !== undefined && (
            <SearchToggle value={searchValue} onChange={onSearchChange} />
          )}
          <Link
            href="/settings"
            className="flex h-9 w-9 items-center justify-center border-brutal bg-surface-2 text-chrome-fg hover:bg-[var(--m-chrome-hover)]"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </Link>
          {children}
          <ThemeToggle compact />
        </div>
      </div>
    </header>
  );
}

export function SortChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-brutal px-2 py-1 transition-colors ${
        active ? "bg-ink text-accent" : "bg-surface-2 text-ink"
      }`}
    >
      {children}
    </button>
  );
}
