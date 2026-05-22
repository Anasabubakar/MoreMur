"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
};

export function HeaderIconButton({
  label,
  icon,
  href,
  onClick,
  active,
  className = "",
}: Props) {
  const base = `flex h-9 w-9 items-center justify-center border-brutal transition-colors ${
    active
      ? "bg-accent text-accent-fg"
      : "bg-surface-2 text-chrome-fg hover:bg-[var(--m-chrome-hover)]"
  } ${className}`;

  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={base}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={base}>
      {icon}
    </button>
  );
}

export function NavIcon({ name, className = "text-xl" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined leading-none ${className}`} aria-hidden>
      {name}
    </span>
  );
}
