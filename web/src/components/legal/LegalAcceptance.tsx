"use client";

import Link from "next/link";

type Props = {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  onAcceptTerms: (v: boolean) => void;
  onAcceptPrivacy: (v: boolean) => void;
};

export function LegalAcceptance({
  acceptTerms,
  acceptPrivacy,
  onAcceptTerms,
  onAcceptPrivacy,
}: Props) {
  const boxClass =
    "mt-0.5 size-4 shrink-0 border-brutal accent-accent focus:outline-none";

  return (
    <div className="flex flex-col gap-3 border-brutal bg-canvas p-3">
      <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-muted">
        Before you continue
      </p>
      <label className="flex cursor-pointer items-start gap-2 font-[family-name:var(--font-body)] text-xs leading-snug text-ink">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => onAcceptTerms(e.target.checked)}
          className={boxClass}
        />
        <span>
          I accept the{" "}
          <Link href="/legal?doc=tc" target="_blank" className="font-bold underline">
            Terms &amp; Conditions
          </Link>
        </span>
      </label>
      <label className="flex cursor-pointer items-start gap-2 font-[family-name:var(--font-body)] text-xs leading-snug text-ink">
        <input
          type="checkbox"
          checked={acceptPrivacy}
          onChange={(e) => onAcceptPrivacy(e.target.checked)}
          className={boxClass}
        />
        <span>
          I accept the{" "}
          <Link href="/legal?doc=pp" target="_blank" className="font-bold underline">
            Privacy Policy
          </Link>
        </span>
      </label>
    </div>
  );
}

export function signupLegalReady(acceptTerms: boolean, acceptPrivacy: boolean) {
  return acceptTerms && acceptPrivacy;
}
