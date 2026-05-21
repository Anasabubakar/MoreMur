import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-block border-brutal text-center font-[family-name:var(--font-body)] text-sm font-bold uppercase shadow-brutal transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg active:translate-x-0 active:translate-y-0 active:shadow-none";

type NeoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "yellow" | "white" | "black";
  children: ReactNode;
};

function variantClasses(variant: "yellow" | "white" | "black") {
  if (variant === "black") return "bg-ink text-accent";
  if (variant === "white") return "bg-surface text-ink";
  return "bg-accent text-accent-fg";
}

export function NeoButton({
  variant = "yellow",
  className = "",
  children,
  ...props
}: NeoButtonProps) {
  return (
    <button type="button" className={`${base} ${variantClasses(variant)} ${className}`} {...props}>
      {children}
    </button>
  );
}

type NeoLinkProps = {
  href: string;
  variant?: "yellow" | "white" | "black";
  className?: string;
  children: ReactNode;
};

export function NeoLink({ href, variant = "yellow", className = "", children }: NeoLinkProps) {
  return (
    <Link href={href} className={`${base} ${variantClasses(variant)} ${className}`}>
      {children}
    </Link>
  );
}
