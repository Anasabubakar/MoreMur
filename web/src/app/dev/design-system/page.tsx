export default function DevDesignSystemPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#F2F2F2] p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/design-system.png"
        alt="Murmur design system"
        className="max-h-[90dvh] max-w-full border-[3px] border-black shadow-[8px_8px_0_#000]"
      />
    </main>
  );
}
