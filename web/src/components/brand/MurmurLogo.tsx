"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

type Props = {
  href?: string;
  className?: string;
};

export function MurmurLogo({ href = "/feed", className = "" }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const mobileSrc = isDark ? "/images/m-yellow.svg" : "/images/m-black.svg";
  const desktopSrc = isDark ? "/images/text-yellow.svg" : "/images/text-black.svg";

  const img = (
    <>
      <Image
        src={mobileSrc}
        alt="Murmur"
        width={40}
        height={40}
        className="h-9 w-9 md:hidden"
        priority
      />
      <Image
        src={desktopSrc}
        alt="Murmur"
        width={160}
        height={36}
        className="hidden h-8 w-auto md:block"
        priority
      />
    </>
  );

  if (!href) {
    return <div className={className}>{img}</div>;
  }

  return (
    <Link href={href} className={`inline-flex shrink-0 items-center ${className}`}>
      {img}
    </Link>
  );
}
