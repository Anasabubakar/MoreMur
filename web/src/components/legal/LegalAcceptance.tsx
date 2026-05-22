"use client";

import Link from "next/link";

type Props = {
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
};

export function LegalAcceptance({ accepted, onAcceptedChange }: Props) {
  const boxClass =
    "mt-0.5 size-4 shrink-0 border-brutal accent-accent focus:outline-none";

  return (
    <div className="border-brutal bg-canvas p-3">
      <label className="flex cursor-pointer items-start gap-2 font-[family-name:var(--font-body)] text-xs leading-snug text-ink">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAcceptedChange(e.target.checked)}
          className={boxClass}
        />
        <span>
          I accept the{" "}
          <Link
            href="/legal?doc=tc#panel-tc"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/legal?doc=pp#panel-pp"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
          >
            Privacy Policy
          </Link>
          , including use of anonymised aggregate data as described there.
        </span>
      </label>
    </div>
  );
}

export function signupLegalReady(accepted: boolean) {
  return accepted;
}
