import { DevNav } from "@/components/DevNav";

/** Stitch HTML previews — developers only, not linked from the product. */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-brutal border-b bg-ink px-3 py-2 font-mono text-[10px] uppercase text-accent">
        Design preview — not part of the live app
      </div>
      {children}
      <DevNav />
    </>
  );
}
