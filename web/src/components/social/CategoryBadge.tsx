const CATEGORY_COLORS: Record<string, string> = {
  RANT: "bg-[#ffb4a2]",
  GOSSIP: "bg-[#c8e6ff]",
  OPINION: "bg-[#fff9c4]",
  QUESTION: "bg-[#d4f4dd]",
  ANNOUNCEMENT: "bg-[#e2e2e2]",
  POLL: "bg-[#e8d4ff]",
};

/** Category label — top-right of post header (stitched style). */
export function CategoryBadge({ label }: { label: string }) {
  const bg = CATEGORY_COLORS[label] ?? "bg-accent";

  return (
    <span className="relative inline-block shrink-0">
      <span className="absolute left-0.5 top-0.5 block h-full w-full border-2 border-border bg-surface" />
      <span
        className={`relative block border-2 border-border px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--m-shadow)] ${bg}`}
      >
        {label}
      </span>
    </span>
  );
}
