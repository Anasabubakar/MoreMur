import Link from "next/link";
import { DARK_SCREENS, type DarkScreenKey } from "@/lib/screens-dark";

const entries = Object.entries(DARK_SCREENS) as [DarkScreenKey, (typeof DARK_SCREENS)[DarkScreenKey]][];

export default function DevDarkIndexPage() {
  return (
    <main className="min-h-[100dvh] bg-canvas p-8 text-ink">
      <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">
        Stitch — dark mode
      </h1>
      <p className="mt-2 max-w-lg font-mono text-xs text-muted">
        Reference exports for the dusty brutalist dark theme. Toggle{" "}
        <strong className="text-ink">Dust</strong> in the live app to match.
      </p>
      <ul className="mt-8 flex flex-col gap-2">
        {entries.map(([key, screen]) => (
          <li key={key}>
            <Link
              href={`/dev/dark/${key}`}
              className="border-brutal inline-block bg-surface px-4 py-2 font-mono text-sm font-bold uppercase shadow-brutal-sm hover:bg-accent hover:text-accent-fg"
            >
              {screen.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/dev" className="font-mono text-xs underline text-muted">
          ← Light previews
        </Link>
        {" · "}
        <Link href="/feed" className="font-mono text-xs underline text-muted">
          Live feed
        </Link>
      </p>
    </main>
  );
}
