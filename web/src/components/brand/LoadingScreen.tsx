"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeProvider";

export function LoadingScreen({ label = "Loading murmurs…" }: { label?: string }) {
  const { theme } = useTheme();
  const src =
    theme === "dark"
      ? "/images/logo-yellow-vector.svg"
      : "/images/logo-black-vector.svg";

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-8">
      <Image
        src={src}
        alt="Murmur"
        width={200}
        height={200}
        className="h-32 w-32 animate-pulse md:h-40 md:w-40"
        priority
      />
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
        {label}
      </p>
    </div>
  );
}
