"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LEGAL_DOCS,
  parseLegalDoc,
  type LegalDocKey,
} from "@/components/legal/legal-config";
import { LegalMobileTabs, LegalSidebar } from "@/components/legal/LegalSidebar";
import { PrivacyPolicyPanel } from "@/components/legal/PrivacyPolicyPanel";
import { TermsPanel } from "@/components/legal/TermsPanel";
import { CookiePolicyPanel } from "@/components/legal/CookiePolicyPanel";

export function LegalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docParam = searchParams.get("doc");
  const [activeDoc, setActiveDoc] = useState<LegalDocKey>(() => parseLegalDoc(docParam));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const doc = LEGAL_DOCS[activeDoc];

  const switchDoc = useCallback(
    (key: LegalDocKey) => {
      setActiveDoc(key);
      setActiveSection(null);
      setDrawerOpen(false);

      const params = new URLSearchParams(searchParams.toString());
      if (key === "pp") {
        params.delete("doc");
      } else {
        params.set("doc", key);
      }
      const query = params.toString();
      router.replace(query ? `/legal?${query}` : "/legal", { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const parsed = parseLegalDoc(docParam);
    if (parsed !== activeDoc) {
      setActiveDoc(parsed);
      setActiveSection(null);
    }
  }, [docParam, activeDoc]);

  useEffect(() => {
    function applyLocationHash() {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      const panelFromHash: Record<string, LegalDocKey> = {
        pp: "pp",
        "panel-pp": "pp",
        tc: "tc",
        "panel-tc": "tc",
        cp: "cp",
        "panel-cp": "cp",
      };

      const docFromHash = panelFromHash[hash];
      if (docFromHash) {
        setActiveDoc(docFromHash);
        if (hash.startsWith("panel-")) return;
      }

      const sectionDoc =
        docFromHash ??
        (hash.startsWith("pp-") ? "pp" : hash.startsWith("tc-") ? "tc" : hash.startsWith("cp-") ? "cp" : null);

      if (sectionDoc && LEGAL_DOCS[sectionDoc].navItems.some((item) => item.id === hash)) {
        setActiveDoc(sectionDoc);
        setActiveSection(hash);
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        });
      }
    }

    applyLocationHash();
    window.addEventListener("hashchange", applyLocationHash);
    return () => window.removeEventListener("hashchange", applyLocationHash);
  }, []);

  useEffect(() => {
    const panel = document.querySelector(`[data-legal-panel="${activeDoc}"]`);
    if (!panel) return;

    const sections = panel.querySelectorAll<HTMLElement>(".legal-section[id]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [activeDoc]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <div className="legal-root">
      <aside className="legal-sidebar" aria-label="Legal navigation">
        <LegalSidebar activeDoc={activeDoc} activeSection={activeSection} onDocChange={switchDoc} />
      </aside>

      {drawerOpen ? (
        <>
          <button
            type="button"
            className="legal-drawer-backdrop"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className={`legal-drawer open`} role="dialog" aria-modal="true" aria-label="Legal menu">
            <LegalSidebar
              activeDoc={activeDoc}
              activeSection={activeSection}
              onDocChange={switchDoc}
              onNavClick={() => setDrawerOpen(false)}
              showClose
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </>
      ) : null}

      <div className="legal-main">
        <header className="legal-topbar">
          <div className="legal-topbar-left">
            <button
              type="button"
              className="legal-menu-btn"
              aria-expanded={drawerOpen}
              aria-controls="legal-mobile-drawer"
              onClick={() => setDrawerOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden>☰</span>
            </button>
            <span className="legal-topbar-title">{doc.title}</span>
          </div>
          <div className="legal-topbar-right">
            <Link href="/" className="legal-topbar-back hide-sm">
              ← Back to site
            </Link>
            <span className="legal-chip legal-chip-y">Effective May 22, 2026</span>
            <span className="legal-chip legal-chip-b hide-sm">v1.0</span>
          </div>
        </header>

        <LegalMobileTabs activeDoc={activeDoc} onDocChange={switchDoc} />

        <section className="legal-hero">
          <div className="legal-hero-eyebrow">// Legal Documentation</div>
          <h1 className="legal-hero-title">
            {doc.heroLines[0]}
            <br />
            {doc.heroLines[1]}
          </h1>
          <p className="legal-hero-sub">
            These documents govern how Murmur collects, uses, stores, and protects your data. Read
            them. They are written to be understood, not buried.
          </p>
          <div className="legal-hero-meta">
            <div className="legal-hero-meta-cell">
              <div className="legal-hmc-label">Platform</div>
              <div className="legal-hmc-val">moremur.vercel.app</div>
            </div>
            <div className="legal-hero-meta-cell">
              <div className="legal-hmc-label">Effective Date</div>
              <div className="legal-hmc-val">May 22, 2026</div>
            </div>
            <div className="legal-hero-meta-cell">
              <div className="legal-hmc-label">Jurisdiction</div>
              <div className="legal-hmc-val">Global (Nigeria Primary)</div>
            </div>
            <div className="legal-hero-meta-cell">
              <div className="legal-hmc-label">Minimum Age</div>
              <div className="legal-hmc-val">18+</div>
            </div>
          </div>
        </section>

        <div className="legal-panels">
          <div
            id="panel-pp"
            data-legal-panel="pp"
            className={`legal-doc-panel${activeDoc === "pp" ? " active" : ""}`}
          >
            <PrivacyPolicyPanel />
          </div>
          <div
            id="panel-tc"
            data-legal-panel="tc"
            className={`legal-doc-panel${activeDoc === "tc" ? " active" : ""}`}
          >
            <TermsPanel />
          </div>
          <div
            id="panel-cp"
            data-legal-panel="cp"
            className={`legal-doc-panel${activeDoc === "cp" ? " active" : ""}`}
          >
            <CookiePolicyPanel />
          </div>
        </div>

        <footer className="legal-doc-footer">
          <div className="legal-df-left">
            <div className="df-mark">MURMUR</div>
            <div className="df-sub">Legal Documents — Effective May 22, 2026</div>
          </div>
          <div className="legal-df-right">
            Operated by Anas Abubakar
            <br />
            moremur.vercel.app
            <br />
            anasabubakar840@gmail.com
          </div>
        </footer>
      </div>
    </div>
  );
}
