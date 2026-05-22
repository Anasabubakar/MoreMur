"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  hasCookieConsentChoice,
  setCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsentChoice());
  }, []);

  function choose(value: CookieConsent) {
    setCookieConsent(value);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("murmur:cookie-consent", { detail: value }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] border-brutal border-t bg-surface p-4 shadow-brutal-lg md:p-5"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-ink">
          Murmur uses strictly necessary storage for sign-in. Optional storage (like
          saved theme) only runs if you accept.{" "}
          <Link href="/legal?doc=cp" className="font-bold underline">
            Cookie Policy
          </Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="border-brutal bg-canvas px-4 py-2 font-mono text-xs font-bold uppercase text-ink"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="border-brutal bg-accent px-4 py-2 font-mono text-xs font-bold uppercase text-accent-fg shadow-brutal-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
