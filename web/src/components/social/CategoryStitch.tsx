const CATEGORY_COLORS: Record<string, string> = {
  RANT: "bg-[#ffb4a2]",
  GOSSIP: "bg-[#c8e6ff]",
  OPINION: "bg-[#fff9c4]",
  QUESTION: "bg-[#d4f4dd]",
  ANNOUNCEMENT: "bg-[#e2e2e2]",
  POLL: "bg-[#e8d4ff]",
};

type Props = {
  label: string;
  hot?: boolean;
};

export function CategoryStitch({ label, hot = false }: Props) {
  if (hot) {
    return (
      <div className="pointer-events-none absolute -left-1 -top-3 z-10">
        <div className="absolute left-1 top-1 h-full w-full border-2 border-[#ff2d00] bg-[#ff2d00]" />
        <div className="relative flex items-center gap-1 border-2 border-[#ff2d00] bg-[#ff4500] px-2 py-1 shadow-[3px_3px_0_0_#000]">
          <span
            className="material-symbols-outlined text-base text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
          <span className="font-mono text-[10px] font-bold uppercase text-white">Hot</span>
        </div>
      </div>
    );
  }

  const bg = CATEGORY_COLORS[label] ?? "bg-accent";

  return (
    <div className="pointer-events-none absolute -left-1 -top-3 z-10">
      <div className="absolute left-1 top-1 h-full w-full border-2 border-border bg-surface" />
      <div
        className={`relative border-2 border-border px-2 py-1 font-mono text-[10px] font-bold uppercase text-ink shadow-[3px_3px_0_0_var(--m-shadow)] ${bg}`}
      >
        {label}
      </div>
    </div>
  );
}
