"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SearchToggle, type SearchApplyPayload } from "./SearchToggle";
import { HeaderIconButton, NavIcon } from "./HeaderIconButton";

type Props = {
  searchValue?: string;
  searchCategory?: string;
  onSearchApply?: (payload: SearchApplyPayload) => void;
  onSignOut?: () => void;
  extra?: React.ReactNode;
};

export function HeaderUtilities({
  searchValue,
  searchCategory,
  onSearchApply,
  onSignOut,
  extra,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const hasSearch = searchValue !== undefined && onSearchApply;

  const utilities = (
    <>
      {extra}
      {hasSearch && (
        <SearchToggle
          value={searchValue}
          category={searchCategory ?? ""}
          onApply={(p) => {
            onSearchApply(p);
            setMenuOpen(false);
          }}
        />
      )}
      <HeaderIconButton
        href="/settings"
        label="Settings"
        icon={<NavIcon name="settings" />}
      />
      <ThemeToggle compact iconOnly />
      {onSignOut && (
        <HeaderIconButton
          label="Sign out"
          icon={<NavIcon name="logout" />}
          onClick={onSignOut}
        />
      )}
    </>
  );

  return (
    <div className="flex items-center justify-end justify-self-end gap-2">
      <div className="hidden items-center gap-2 md:flex">{utilities}</div>

      <div className="relative md:hidden" ref={menuRef}>
        <HeaderIconButton
          label={menuOpen ? "Close menu" : "Open menu"}
          active={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          icon={<NavIcon name={menuOpen ? "close" : "more_vert"} />}
        />
        {menuOpen && (
          <div className="absolute right-0 top-full z-40 mt-2 flex min-w-[14rem] flex-col gap-2 border-brutal bg-surface p-3 shadow-brutal-lg">
            {hasSearch && (
              <SearchToggle
                value={searchValue}
                category={searchCategory ?? ""}
                onApply={(p) => {
                  onSearchApply(p);
                  setMenuOpen(false);
                }}
                inline
              />
            )}
            <div className="flex items-center gap-2">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center border-brutal bg-surface-2 text-ink hover:bg-[var(--m-chrome-hover)]"
                aria-label="Settings"
              >
                <NavIcon name="settings" />
              </Link>
              <ThemeToggle compact iconOnly />
              {onSignOut && (
                <HeaderIconButton
                  label="Sign out"
                  icon={<NavIcon name="logout" />}
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut();
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
