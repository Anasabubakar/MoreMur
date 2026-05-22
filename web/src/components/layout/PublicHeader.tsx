"use client";

import Link from "next/link";
import { MurmurLogo } from "@/components/brand/MurmurLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/** Marketing shell — no in-app routes until the user is signed in. */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-brutal border-b bg-chrome text-chrome-fg shadow-brutal">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <MurmurLogo href="/" />
        <div className="flex items-center gap-3">
          <ThemeToggle compact />
          <Link
            href="/how-it-works"
            className="hidden border-brutal bg-canvas px-3 py-2 font-mono text-xs font-bold uppercase text-ink shadow-brutal-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal sm:inline-block"
          >
            How it works
          </Link>
          <Link
            href="/login"
            className="border-brutal bg-surface px-4 py-2 font-mono text-xs font-bold uppercase text-ink shadow-brutal-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
