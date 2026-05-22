"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type BaseProps = {
  hoverLabel: string;
  ariaLabel: string;
  icon: ReactNode;
  count?: number;
  className?: string;
  disabled?: boolean;
  /** Accent submit-style button (yellow bg) */
  variant?: "default" | "accent";
};

type ButtonProps = BaseProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: undefined;
  type?: undefined;
  active?: boolean;
};

export type ActionButtonProps = ButtonProps | LinkProps;

const baseClass =
  "group relative inline-flex items-center gap-1 border-brutal border-transparent px-1 py-0.5 font-mono text-xs font-bold transition-colors";

function HoverLabel({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap border-brutal bg-surface px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink opacity-0 shadow-brutal-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {label}
    </span>
  );
}

function ActionContent({ icon, count }: { icon: ReactNode; count?: number }) {
  return (
    <>
      {icon}
      {count !== undefined && (
        <span className="tabular-nums" aria-hidden>
          {count}
        </span>
      )}
    </>
  );
}

export function ActionButton(props: ActionButtonProps) {
  const {
    hoverLabel,
    ariaLabel,
    icon,
    count,
    className = "",
    disabled,
    active,
    variant = "default",
  } = props;

  const stateClass =
    variant === "accent"
      ? "text-accent-fg"
      : active
        ? "text-danger"
        : "text-ink hover:text-danger";

  const merged = `${baseClass} ${stateClass} ${className}`.trim();

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        aria-label={ariaLabel}
        className={merged}
        onClick={(e) => e.stopPropagation()}
      >
        <HoverLabel label={hoverLabel} />
        <ActionContent icon={icon} count={count} />
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={props.type === "button" ? active : undefined}
      className={`${merged} disabled:opacity-40`}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
    >
      <HoverLabel label={hoverLabel} />
      <ActionContent icon={icon} count={count} />
    </button>
  );
}

export function MaterialIcon({
  name,
  filled = false,
  className = "text-xl leading-none",
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
