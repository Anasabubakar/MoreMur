export type LegalDocKey = "pp" | "tc" | "cp";

export type LegalNavItem = { id: string; label: string };

export type LegalDocConfig = {
  key: LegalDocKey;
  buttonLabel: string;
  title: string;
  heroLines: [string, string];
  navItems: LegalNavItem[];
};

export const LEGAL_DOCS: Record<LegalDocKey, LegalDocConfig> = {
  pp: {
    key: "pp",
    buttonLabel: "01 — Privacy Policy",
    title: "Privacy Policy",
    heroLines: ["PRIVACY", "POLICY"],
    navItems: [
      { id: "pp-intro", label: "1. Introduction" },
      { id: "pp-collect", label: "2. Data We Collect" },
      { id: "pp-use", label: "3. How We Use Data" },
      { id: "pp-infra", label: "4. Infrastructure" },
      { id: "pp-rights", label: "5. Your Rights" },
      { id: "pp-retention", label: "6. Data Retention" },
      { id: "pp-minors", label: "7. Age & Jurisdiction" },
      { id: "pp-changes", label: "8. Policy Changes" },
    ],
  },
  tc: {
    key: "tc",
    buttonLabel: "02 — Terms & Conditions",
    title: "Terms & Conditions",
    heroLines: ["TERMS &", "CONDITIONS"],
    navItems: [
      { id: "tc-intro", label: "1. Agreement" },
      { id: "tc-eligibility", label: "2. Eligibility" },
      { id: "tc-account", label: "3. Your Account" },
      { id: "tc-conduct", label: "4. Acceptable Use" },
      { id: "tc-moderation", label: "5. Moderation" },
      { id: "tc-liability", label: "6. Liability" },
      { id: "tc-ip", label: "7. Intellectual Property" },
      { id: "tc-data-sale", label: "8. Data Commerce" },
      { id: "tc-termination", label: "9. Termination" },
      { id: "tc-governing", label: "10. Governing Law" },
    ],
  },
  cp: {
    key: "cp",
    buttonLabel: "03 — Cookie Policy",
    title: "Cookie Policy",
    heroLines: ["COOKIE", "POLICY"],
    navItems: [
      { id: "cp-intro", label: "1. What Are Cookies" },
      { id: "cp-types", label: "2. Cookies We Use" },
      { id: "cp-third", label: "3. Third-Party Cookies" },
      { id: "cp-control", label: "4. Managing Cookies" },
      { id: "cp-changes", label: "5. Policy Updates" },
    ],
  },
};

export const LEGAL_DOC_KEYS = Object.keys(LEGAL_DOCS) as LegalDocKey[];

export function parseLegalDoc(raw?: string | null): LegalDocKey {
  if (raw === "tc" || raw === "cp" || raw === "pp") return raw;
  return "pp";
}
