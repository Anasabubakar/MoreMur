import type { Metadata } from "next";
import { HowItWorksPage } from "@/components/landing/HowItWorksPage";

export const metadata: Metadata = {
  title: "MURMUR — How it works",
  description:
    "How Murmur works: org-scoped anonymous feeds, hashed emails, OTP signup, and community moderation.",
};

export default function Page() {
  return <HowItWorksPage />;
}
