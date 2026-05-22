const CATEGORY_KEYS = [
  "RANT",
  "GOSSIP",
  "OPINION",
  "QUESTION",
  "ANNOUNCEMENT",
  "POLL",
] as const;

type CategoryKey = (typeof CATEGORY_KEYS)[number];

function categoryVar(key: CategoryKey | "default", part: "bg" | "fg") {
  return `var(--cat-${key.toLowerCase()}-${part})`;
}

/** Category label — top-right of post header (stitched style). */
export function CategoryBadge({ label }: { label: string }) {
  const key: CategoryKey | "default" = CATEGORY_KEYS.includes(label as CategoryKey)
    ? (label as CategoryKey)
    : "default";

  return (
    <span className="relative inline-block shrink-0">
      <span
        className="absolute left-0.5 top-0.5 block h-full w-full border-2 border-border"
        style={{ backgroundColor: "var(--cat-offset)" }}
        aria-hidden
      />
      <span
        className="relative block border-2 border-border px-2 py-0.5 font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0_0_var(--m-shadow)]"
        style={{
          backgroundColor: categoryVar(key, "bg"),
          color: categoryVar(key, "fg"),
        }}
      >
        {label}
      </span>
    </span>
  );
}
