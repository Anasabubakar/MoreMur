"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MAIN_NAV } from "./MainNav";
import { NavIcon } from "./HeaderIconButton";

const DOCK_PATHS = new Set<string>(MAIN_NAV.map((n) => n.href));

export function MobileDock() {
  const pathname = usePathname();
  if (!DOCK_PATHS.has(pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-brutal border-t bg-chrome px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-brutal-sm md:hidden"
      aria-label="Feed navigation"
    >
      <ul className="mx-auto flex max-w-lg items-center justify-around">
        {MAIN_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 font-mono text-[9px] font-bold uppercase ${
                  active ? "text-accent" : "text-chrome-fg"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center border-brutal ${
                    active ? "bg-accent text-accent-fg" : "bg-surface-2"
                  }`}
                >
                  <NavIcon name={item.icon} className="text-2xl" />
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
