"use client";

import Link from "next/link";
import {
  LEGAL_DOCS,
  LEGAL_DOC_KEYS,
  type LegalDocKey,
} from "@/components/legal/legal-config";

type LegalSidebarProps = {
  activeDoc: LegalDocKey;
  activeSection: string | null;
  onDocChange: (key: LegalDocKey) => void;
  onNavClick?: () => void;
  showClose?: boolean;
  onClose?: () => void;
};

function SidebarNav({
  activeDoc,
  activeSection,
  onNavClick,
}: Pick<LegalSidebarProps, "activeDoc" | "activeSection" | "onNavClick">) {
  const doc = LEGAL_DOCS[activeDoc];

  return (
    <nav aria-label="Document sections">
      <div className="legal-nav-label">Sections</div>
      {doc.navItems.map((item) => (
        <a
          key={item.id}
          className={`legal-nav-item${activeSection === item.id ? " active" : ""}`}
          href={`#${item.id}`}
          onClick={onNavClick}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function LegalSidebar({
  activeDoc,
  activeSection,
  onDocChange,
  onNavClick,
  showClose = false,
  onClose,
}: LegalSidebarProps) {
  return (
    <>
      <div className="legal-sidebar-logo">
        {showClose ? (
          <div className="legal-drawer-header" style={{ padding: 0, border: "none" }}>
            <Link href="/" className="wordmark">
              MURMUR
            </Link>
            {onClose ? (
              <button
                type="button"
                className="legal-drawer-close"
                onClick={onClose}
                aria-label="Close menu"
              >
                ×
              </button>
            ) : null}
          </div>
        ) : (
          <Link href="/" className="wordmark">
            MURMUR
          </Link>
        )}
        <div className="tagline">Legal Documents // moremur.vercel.app</div>
        <Link href="/" className="legal-back-link">
          ← Back to site
        </Link>
      </div>

      <div className="legal-doc-switcher" role="tablist" aria-label="Legal documents">
        {LEGAL_DOC_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeDoc === key}
            className={`legal-doc-btn${activeDoc === key ? " active" : ""}`}
            onClick={() => onDocChange(key)}
          >
            {LEGAL_DOCS[key].buttonLabel}
          </button>
        ))}
      </div>

      <SidebarNav
        activeDoc={activeDoc}
        activeSection={activeSection}
        onNavClick={onNavClick}
      />

      <div className="legal-sidebar-footer">
        moremur.vercel.app
        <br />
        Last updated: May 2026
        <br />
        Effective: May 22, 2026
      </div>
    </>
  );
}

export function LegalMobileTabs({
  activeDoc,
  onDocChange,
}: {
  activeDoc: LegalDocKey;
  onDocChange: (key: LegalDocKey) => void;
}) {
  return (
    <div className="legal-mobile-tabs" role="tablist" aria-label="Legal documents">
      {LEGAL_DOC_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={activeDoc === key}
          className={`legal-mobile-tab${activeDoc === key ? " active" : ""}`}
          onClick={() => onDocChange(key)}
        >
          {LEGAL_DOCS[key].title}
        </button>
      ))}
    </div>
  );
}
