import Link from "next/link";
import { SCREENS, type ScreenKey } from "@/lib/screens";

const entries = Object.entries(SCREENS) as [ScreenKey, (typeof SCREENS)[ScreenKey]][];

export default function DevIndexPage() {
  return (
    <main className="min-h-[100dvh] bg-canvas p-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase text-ink">
        Stitch previews
      </h1>
      <p className="mt-2 max-w-lg font-mono text-xs text-muted">
        Static HTML exported from Google Stitch. Use these to compare pixels while building
        real React pages.
      </p>
      <ul className="mt-8 flex flex-col gap-2">
        {entries.map(([key, screen]) => (
          <li key={key}>
            <Link
              href={`/dev/${key}`}
              className="border-brutal bg-surface px-4 py-2 font-mono text-sm font-bold uppercase text-ink shadow-brutal-sm hover:bg-accent hover:text-accent-fg"
            >
              {screen.title}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/dev/design-system"
            className="border-brutal bg-surface px-4 py-2 font-mono text-sm font-bold uppercase text-ink shadow-brutal-sm hover:bg-accent hover:text-accent-fg"
          >
            Design system (PNG)
          </Link>
        </li>
      </ul>
      <p className="mt-8">
        <Link href="/" className="font-mono text-xs text-ink underline">
          ← Back to app
        </Link>
      </p>
    </main>
  );
}
