/** Stitched flame badge — top-left of post card only. */
export function HotBadge() {
  return (
    <div className="pointer-events-none absolute -left-1 -top-3 z-10">
      <div className="absolute left-1 top-1 h-full w-full border-2 border-[#ff2d00] bg-[#ff2d00]" />
      <div className="relative flex items-center gap-0.5 border-2 border-[#ff2d00] bg-[#ff4500] px-1.5 py-0.5 shadow-[3px_3px_0_0_#000]">
        <span
          className="material-symbols-outlined text-sm text-white"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          local_fire_department
        </span>
      </div>
    </div>
  );
}
