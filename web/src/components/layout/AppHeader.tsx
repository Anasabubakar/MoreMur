import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type Props = {
  children?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AppHeader({ children, backHref, backLabel }: Props) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-brutal border-b bg-chrome px-4 py-3 text-chrome-fg shadow-brutal-sm">
      {backHref ? (
        <Link
          href={backHref}
          className="font-mono text-xs font-bold uppercase underline-offset-2 hover:underline"
        >
          {backLabel ?? "← Back"}
        </Link>
      ) : (
        <Link
          href="/feed"
          className="font-[family-name:var(--font-display)] text-3xl tracking-wide"
        >
          MURMUR
        </Link>
      )}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold uppercase">
        {children}
        <ThemeToggle compact />
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
        active ? "bg-ink text-accent" : "bg-surface text-ink"
      }`}
    >
      {children}
    </button>
  );
}
