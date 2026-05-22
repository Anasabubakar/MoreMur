import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { NeoLink } from "@/components/ui/NeoButton";

const doctrine = [
  {
    icon: "visibility_off",
    title: "100% ANONYMOUS",
    body: "Speak inside your org without exposing who you are. Identity stays behind the verification wall.",
  },
  {
    icon: "corporate_fare",
    title: "ORG ISOLATED",
    body: "Feeds are scoped to your institution. One verified domain per org — no bleed between companies or campuses.",
  },
  {
    icon: "campaign",
    title: "HONEST FEEDBACK",
    body: "Gossip, questions, rants, and announcements — the signal your org actually needs, not polished PR.",
  },
] as const;

const phases = [
  {
    phase: "PHASE 01",
    title: "VERIFICATION",
    body: "Sign in with your organization email (any company or school domain). @gmail.com does not work.",
  },
  {
    phase: "PHASE 02",
    title: "ANONYMITY",
    body: "You get a random handle inside your org. Admins can moderate; they do not see your real name on posts.",
  },
  {
    phase: "PHASE 03",
    title: "TRANSMISSION",
    body: "Post, react, and sort by new or trending. Your murmurs stay inside your verified community.",
  },
] as const;

function StripeSection({
  children,
  className = "",
  contentClassName = "mx-auto max-w-6xl",
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden border-brutal border-b px-4 py-20 md:px-8 ${className}`}
    >
      <div className="landing-stripes" aria-hidden />
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] bg-canvas text-ink">
      <div className="landing-watermark" aria-hidden>
        <span className="landing-watermark__text">MURMUR</span>
      </div>
      <div className="relative z-[1]">
      <PublicHeader />
      <main>
        <StripeSection className="py-20 md:py-28">
          <span className="inline-block -rotate-2 border-brutal bg-surface px-4 py-2 font-mono text-xs font-bold uppercase text-ink shadow-brutal-sm">
            Verified org communities
          </span>
          <h1 className="mt-8 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.5rem,12vw,7.5rem)] uppercase leading-[0.9]">
            WHERE THE
            <br />
            REAL TALK
            <br />
            LIVES.
          </h1>
          <p className="mt-6 max-w-xl border-l-[3px] border-border pl-4 font-[family-name:var(--font-body)] text-lg font-medium">
            Anonymous, organisation-scoped feeds for any team or campus that needs honest
            signal — verified by work or school email.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <NeoLink href="/signup" className="px-8 py-4 text-base">
              Join your org
            </NeoLink>
              <NeoLink href="/login" variant="white" className="px-8 py-4 text-base">
                Sign in
              </NeoLink>
          </div>
        </StripeSection>

        <StripeSection>
          <h2 className="mb-12 inline-block border-b-[3px] border-border pb-4 font-[family-name:var(--font-display)] text-4xl uppercase md:text-5xl">
            Core doctrine
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {doctrine.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-6 border-brutal bg-surface p-6 shadow-brutal transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg md:p-8"
              >
                <div className="flex h-16 w-16 items-center justify-center border-brutal bg-accent text-accent-fg shadow-brutal-sm">
                  <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase">
                    {item.title}
                  </h3>
                  <div className="my-4 h-[3px] w-full bg-border" />
                  <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </StripeSection>

        <StripeSection>
          <div className="mb-12 flex flex-col justify-between gap-4 border-b-[3px] border-border pb-6 md:flex-row md:items-end">
            <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase md:text-5xl">
              How it works
            </h2>
            <span className="bg-ink px-3 py-1 font-mono text-xs font-bold uppercase text-accent">
              3 steps
            </span>
          </div>
          <div className="divide-y-[3px] divide-border border-brutal bg-surface shadow-brutal">
            {phases.map((step) => (
              <div
                key={step.phase}
                className="flex flex-col transition-colors hover:bg-surface-2 md:flex-row"
              >
                <div className="flex items-center border-b-[3px] border-border p-6 md:w-1/4 md:border-b-0 md:border-r-[3px]">
                  <span className="border-brutal border-2 bg-canvas px-2 py-1 font-mono text-xs font-bold uppercase text-ink shadow-brutal-sm">
                    {step.phase}
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-4 p-6 md:w-3/4 md:flex-row md:items-center">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase">
                    {step.title}
                  </h3>
                  <p className="max-w-md font-[family-name:var(--font-body)] text-sm text-muted">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </StripeSection>

        <StripeSection contentClassName="mx-auto max-w-3xl">
          <div className="border-brutal bg-surface p-8 text-center shadow-brutal-lg md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase md:text-5xl">
              Ready?
            </h2>
            <p className="mt-4 font-[family-name:var(--font-body)] text-sm text-muted">
              Join with your organization email. New domains are onboarded automatically.
            </p>
            <NeoLink href="/signup" className="mt-8 px-10 py-4 text-base">
              Get started
            </NeoLink>
          </div>
        </StripeSection>
      </main>

      <footer
        className="border-t-[3px] border-border px-4 py-8 md:px-8"
        style={{ backgroundColor: "var(--m-footer-bg)", color: "var(--m-footer-fg)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-[family-name:var(--font-display)] text-2xl uppercase">
            MURMUR
          </span>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase">
            <Link href="/legal?doc=pp" className="underline opacity-90 hover:opacity-100">
              Privacy
            </Link>
            <Link href="/legal?doc=tc" className="underline opacity-90 hover:opacity-100">
              Terms
            </Link>
            <Link href="/legal?doc=cp" className="underline opacity-90 hover:opacity-100">
              Cookies
            </Link>
          </nav>
          <p className="font-mono text-[10px] opacity-70">
            © {new Date().getFullYear()} Murmur. Org-scoped anonymous communities.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
