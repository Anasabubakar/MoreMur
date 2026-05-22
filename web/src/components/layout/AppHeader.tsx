"use client";

import type { ReactNode } from "react";
import { MurmurLogo } from "@/components/brand/MurmurLogo";
import { HeaderIconButton, NavIcon } from "./HeaderIconButton";
import { HeaderUtilities } from "./HeaderUtilities";
import { MainNav } from "./MainNav";
import type { SearchApplyPayload } from "./SearchToggle";

type Props = {
  backHref?: string;
  searchValue?: string;
  searchCategory?: string;
  onSearchApply?: (payload: SearchApplyPayload) => void;
  onSignOut?: () => void;
};

export function AppHeader({
  backHref,
  searchValue,
  searchCategory,
  onSearchApply,
  onSignOut,
}: Props) {
  return (
    <header className="sticky top-0 z-20 border-brutal border-b bg-chrome text-chrome-fg shadow-brutal-sm">
      <div className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-2 px-3 md:px-4">
        <div className="flex min-w-0 items-center">
          {backHref ? (
            <HeaderIconButton
              href={backHref}
              label="Back"
              icon={<NavIcon name="arrow_back" />}
            />
          ) : (
            <MurmurLogo href="/feed" />
          )}
        </div>

        <MainNav className="hidden md:flex" />

        <HeaderUtilities
          searchValue={searchValue}
          searchCategory={searchCategory}
          onSearchApply={onSearchApply}
          onSignOut={onSignOut}
        />
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
      className={`border-brutal px-2 py-1 font-mono text-xs font-bold uppercase transition-colors ${
        active ? "bg-ink text-accent" : "bg-surface-2 text-ink"
      }`}
    >
      {children}
    </button>
  );
}
