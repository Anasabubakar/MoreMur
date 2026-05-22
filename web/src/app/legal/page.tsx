import type { Metadata } from "next";
import { Suspense } from "react";
import { LegalPage } from "@/components/legal/LegalPage";
import "./legal.css";

export const metadata: Metadata = {
  title: "MURMUR — Legal Documents",
  description:
    "Privacy Policy, Terms & Conditions, and Cookie Policy for Murmur — moremur.vercel.app",
};

function LegalLoading() {
  return (
    <div className="legal-root">
      <div className="legal-main">
        <header className="legal-topbar">
          <span className="legal-topbar-title">Loading…</span>
        </header>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LegalLoading />}>
      <LegalPage />
    </Suspense>
  );
}
