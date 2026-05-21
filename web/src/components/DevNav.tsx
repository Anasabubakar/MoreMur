"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEV_NAV_ROUTES } from "@/lib/screens";

/** Floating nav for /dev Stitch previews only. */
export function DevNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 right-4 z-[9999] flex max-w-[calc(100vw-2rem)] flex-wrap gap-1 border-brutal bg-accent p-2 shadow-brutal-sm"
      aria-label="Stitch preview navigation"
    >
      {DEV_NAV_ROUTES.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${
              active
                ? "bg-ink text-accent"
                : "bg-surface text-ink hover:bg-ink hover:text-accent"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
