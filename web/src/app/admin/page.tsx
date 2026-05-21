import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AdminPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-canvas p-8">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase text-ink">
        Org admin
      </h1>
      <p className="max-w-md text-center font-mono text-sm text-muted">
        Coming soon — moderation and org settings.
      </p>
      <Link
        href="/feed"
        className="border-brutal bg-accent px-4 py-2 font-mono text-xs font-bold uppercase text-accent-fg shadow-brutal-sm"
      >
        Back to feed
      </Link>
    </main>
  );
}
