"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderIconButton, NavIcon } from "./HeaderIconButton";

const NAV = [
  { href: "/feed", label: "Feed", icon: "dynamic_feed" },
  { href: "/hot", label: "Hot", icon: "local_fire_department" },
  { href: "/trending", label: "Trending", icon: "trending_up" },
  { href: "/top", label: "Top", icon: "leaderboard" },
] as const;

export function MainNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Feed navigation"
    >
      {NAV.map((item) => (
        <HeaderIconButton
          key={item.href}
          href={item.href}
          label={item.label}
          active={pathname === item.href}
          icon={<NavIcon name={item.icon} />}
        />
      ))}
    </nav>
  );
}

export { NAV as MAIN_NAV };
