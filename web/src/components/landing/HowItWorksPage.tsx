import Link from "next/link";
import { MurmurLogo } from "@/components/brand/MurmurLogo";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { NeoLink } from "@/components/ui/NeoButton";

const steps = [
  {
    label: "01",
    title: "Your org only",
    points: [
      "Sign up with your work or school email — personal inboxes like Gmail won't work.",
      "Each org is locked to its own domain. You only see murmurs from people at your company or campus.",
      "Emails are hashed, not stored in plain text. Posts can't be traced back to your inbox.",
    ],
  },
  {
    label: "02",
    title: "Sign up in three taps",
    points: [
      "Enter your org email → we send a one-time code.",
      "Verify the code → pick a password.",
      "Land in your org's feed. That's it.",
    ],
  },
  {
    label: "03",
    title: "Post anonymously",
    points: [
      "Write a murmur — your real name never appears.",
      "Only people in your org can see it.",
      "Reactions show counts, not who clicked.",
    ],
  },
  {
    label: "04",
    title: "Engage without exposure",
    points: [
      "Like or comment — the post gets a number, not your identity.",
      "Reply threads stay anonymous too.",
      "Sort by new, hot, trending, or top.",
    ],
  },
  {
    label: "05",
    title: "Community safety",
    points: [
      "Report a post if it crosses the line.",
      "Enough reports from org members and it's removed automatically.",
      "Admins can moderate; they still don't see who wrote what.",
    ],
  },
] as const;

function StripeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden border-brutal border-b px-4 py-16 md:px-8 md:py-20 ${className}`}
    >
      <div className="landing-stripes" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

export function HowItWorksPage() {
  return (
    <div className="relative min-h-[100dvh] bg-canvas text-ink">
      <PublicHeader />
      <main>
        <StripeSection className="py-14 md:py-20">
          <Link
            href="/"
            className="font-mono text-xs font-bold uppercase text-muted underline hover:text-ink"
          >
            ← Back to home
          </Link>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,4.5rem)] uppercase leading-[0.95]">
            How Murmur works
          </h1>
          <p className="mt-4 max-w-xl font-[family-name:var(--font-body)] text-base text-muted">
            Plain English. No jargon. Anonymous murmurs inside your verified org — secure,
            scoped, and built for honest signal.
          </p>
        </StripeSection>

        <StripeSection>
          <div className="divide-y-[3px] divide-border border-brutal bg-surface shadow-brutal">
            {steps.map((step) => (
              <article key={step.label} className="p-6 md:p-8">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="border-brutal border-2 bg-accent px-2 py-1 font-mono text-xs font-bold uppercase text-accent-fg shadow-brutal-sm">
                    {step.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase md:text-3xl">
                      {step.title}
                    </h2>
                    <ul className="mt-4 space-y-2">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2 font-[family-name:var(--font-body)] text-sm leading-relaxed text-muted"
                        >
                          <span className="mt-1.5 h-2 w-2 shrink-0 border-brutal bg-accent" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </StripeSection>

        <StripeSection>
          <div className="border-brutal bg-surface p-8 text-center shadow-brutal-lg">
            <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase">
              Ready to murmur?
            </h2>
            <NeoLink href="/signup" className="mt-6 px-10 py-4 text-base">
              Join your org
            </NeoLink>
          </div>
        </StripeSection>
      </main>

      <footer
        className="border-t-[3px] border-border px-4 py-8 md:px-8"
        style={{ backgroundColor: "var(--m-footer-bg)", color: "var(--m-footer-fg)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <MurmurLogo href="/" />
          <p className="font-mono text-[10px] opacity-70">
            © {new Date().getFullYear()} Murmur. Org-scoped anonymous communities.
          </p>
        </div>
      </footer>
    </div>
  );
}
